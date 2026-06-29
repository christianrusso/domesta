import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';


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
    const { domesticProfileId } = body;

    // Find domestic user ID from profile
    const domesticProfile = await prisma.domesticProfile.findUnique({
      where: { id: domesticProfileId },
      select: { userId: true },
    });

    if (!domesticProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Create or find existing conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        clientId_domesticId: {
          clientId: decoded.userId,
          domesticId: domesticProfileId,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          clientId: decoded.userId,
          domesticId: domesticProfileId,
        },
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Conversation create error:', error);
    return NextResponse.json(
      { error: 'Error creating conversation' },
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any;

    const conversations = await prisma.conversation.findMany({
      where: {
        clientId: decoded.userId,
      },
      include: {
        domestic: {
          include: {
            user: {
              select: {
                name: true,
                photoUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching conversations' },
      { status: 500 }
    );
  }
}
