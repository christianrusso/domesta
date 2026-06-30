import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;

    // Obtener todas las conversaciones del usuario (client o domestic)
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { clientId: userId },
          { domestic: { userId } },
        ],
      },
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
            isRead: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Enriquecer: identificar quién es el "otro" usuario en cada conversación
    const enriched = conversations.map((conv) => {
      const isClient = conv.clientId === userId;
      const otherUser = isClient ? conv.domestic.user : conv.client;
      const lastMessage = conv.messages[0] || null;

      return {
        id: conv.id,
        otherUser: isClient
          ? {
              id: conv.domestic.user.id,
              name: conv.domestic.user.name,
              photoUrl: conv.domestic.user.photoUrl,
              zone: conv.domestic.user.zone,
              email: conv.domestic.user.email,
              phone: conv.domestic.user.phone,
              role: 'DOMESTIC',
              domesticId: conv.domestic.id,
              hourlyRate: conv.domestic.hourlyRate,
              experience: conv.domestic.experience,
              skills: conv.domestic.skills,
            }
          : {
              id: conv.client.id,
              name: conv.client.name,
              photoUrl: conv.client.photoUrl,
              zone: conv.client.zone,
              role: 'CLIENT',
            },
        lastMessage,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      };
    });

    return NextResponse.json({ conversations: enriched });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json({ error: 'Error fetching conversations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;

    const { domesticProfileId } = await request.json();
    if (!domesticProfileId) {
      return NextResponse.json({ error: 'domesticProfileId required' }, { status: 400 });
    }

    // Obtener el userId del perfil doméstico
    const domesticProfile = await prisma.domesticProfile.findUnique({
      where: { id: domesticProfileId },
      select: { userId: true },
    });

    if (!domesticProfile) {
      return NextResponse.json({ error: 'Domestic profile not found' }, { status: 404 });
    }

    // Crear o retornar conversación existente
    try {
      let conversation = await prisma.conversation.findUnique({
        where: {
          clientId_domesticId: {
            clientId: userId,
            domesticId: domesticProfileId,
          },
        },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            clientId: userId,
            domesticId: domesticProfileId,
          },
        });
      }

      return NextResponse.json({ conversationId: conversation.id });
    } catch (prismaError: any) {
      console.error('Prisma conversation error:', prismaError.code, prismaError.message);
      // Si es constraint unique, retornar la conversación existente
      if (prismaError.code === 'P2002') {
        const existing = await prisma.conversation.findUnique({
          where: {
            clientId_domesticId: {
              clientId: userId,
              domesticId: domesticProfileId,
            },
          },
        });
        if (existing) {
          return NextResponse.json({ conversationId: existing.id });
        }
      }
      throw prismaError;
    }
  } catch (error) {
    console.error('Conversation create error:', error);
    return NextResponse.json({ error: 'Error creating conversation' }, { status: 500 });
  }
}
