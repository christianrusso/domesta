import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';


// Simple email/phone detection for moderation
const detectContactInfo = (text: string): boolean => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /\+?[\d\s\-\(\)]{7,}/;
  const whatsappRegex = /whatsapp|whats|wa\.me/i;

  return emailRegex.test(text) || phoneRegex.test(text) || whatsappRegex.test(text);
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any;

    const body = await request.json();
    const { conversationId, content, receiverId } = body;

    if (!conversationId || !content || !receiverId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const isModeratorAlert = detectContactInfo(content);

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: decoded.userId,
        receiverId,
        content,
        isModeratorAlert,
      },
    });

    return NextResponse.json({
      ...message,
      blocked: isModeratorAlert,
      warning: isModeratorAlert
        ? 'Este mensaje contiene información de contacto y será bloqueado hasta confirmar la compra de créditos.'
        : null,
    });
  } catch (error) {
    console.error('Message create error:', error);
    return NextResponse.json(
      { error: 'Error creating message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const conversationId = request.nextUrl.searchParams.get('conversationId');
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Missing conversationId' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, photoUrl: true },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching messages' },
      { status: 500 }
    );
  }
}
