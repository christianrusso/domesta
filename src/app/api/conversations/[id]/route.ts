import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;
    const { id } = await context.params;

    // Obtener conversación con todos los mensajes
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
            zone: true,
          },
        },
        domestic: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                photoUrl: true,
                zone: true,
                email: true,
                phone: true,
              },
            },
            hourlyRate: true,
            experience: true,
            skills: {
              select: { skillType: true },
            },
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            isModeratorAlert: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Verificar acceso
    const hasAccess = conversation.clientId === userId || conversation.domestic.user.id === userId;
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Enriquecer respuesta
    const isClient = conversation.clientId === userId;

    return NextResponse.json({
      id: conversation.id,
      otherUser: isClient
        ? {
            id: conversation.domestic.user.id,
            name: conversation.domestic.user.name,
            photoUrl: conversation.domestic.user.photoUrl,
            zone: conversation.domestic.user.zone,
            email: conversation.domestic.user.email,
            phone: conversation.domestic.user.phone,
            role: 'DOMESTIC',
            domesticId: conversation.domestic.id,
            hourlyRate: conversation.domestic.hourlyRate,
            experience: conversation.domestic.experience,
            skills: conversation.domestic.skills,
          }
        : {
            id: conversation.client.id,
            name: conversation.client.name,
            photoUrl: conversation.client.photoUrl,
            zone: conversation.client.zone,
            role: 'CLIENT',
          },
      messages: conversation.messages,
      createdAt: conversation.createdAt,
    });
  } catch (error) {
    console.error('Conversation fetch error:', error);
    return NextResponse.json({ error: 'Error fetching conversation' }, { status: 500 });
  }
}
