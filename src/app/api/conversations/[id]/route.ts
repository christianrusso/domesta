import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
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
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Conversation fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching conversation' },
      { status: 500 }
    );
  }
}
