import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Detect obvious contact info (emails, clear phone patterns)
const detectObviousContactInfo = (text: string): boolean => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /\+?54\s?11\s?\d{4}\s?\d{4}/; // +54 11 XXXX XXXX format
  const whatsappRegex = /whatsapp|whats|wa\.me|telegram/i;

  return emailRegex.test(text) || phoneRegex.test(text) || whatsappRegex.test(text);
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    const { conversationId, content } = await request.json();

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verificar que el usuario es parte de esta conversación
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { client: { select: { id: true } } },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const hasAccess = conversation.clientId === decoded.userId ||
      (await prisma.domesticProfile.findUnique({
        where: { id: conversation.domesticId },
        select: { userId: true },
      }))?.userId === decoded.userId;

    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Bloquear si detecta contacto obvio
    if (detectObviousContactInfo(content)) {
      // Mensaje diferente según rol
      const isClient = conversation.clientId === decoded.userId;
      const errorMsg = isClient
        ? 'No puedes compartir datos de contacto. Compra créditos para desbloquear la información de contacto.'
        : 'No puedes compartir datos de contacto en el chat.';

      return NextResponse.json({
        error: errorMsg,
        code: 'CONTACT_INFO_BLOCKED'
      }, { status: 400 });
    }

    // Crear mensaje (si pasó regex)
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: decoded.userId,
        content,
        isModeratorAlert: false,
      },
      include: {
        sender: {
          select: { id: true, name: true, photoUrl: true },
        },
      },
    });

    // Actualizar updatedAt de la conversación
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Trigger IA async (sin esperar respuesta)
    const { analyzeMessageWithAI } = await import('@/lib/ai-moderation');
    analyzeMessageWithAI(message.id, content, conversationId).catch(err =>
      console.error('AI moderation error:', err)
    );

    return NextResponse.json(message);
  } catch (error) {
    console.error('Message create error:', error);
    return NextResponse.json({ error: 'Error creating message' }, { status: 500 });
  }
}
