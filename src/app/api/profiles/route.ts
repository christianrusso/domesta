import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';


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

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const skip = parseInt(request.nextUrl.searchParams.get('skip') || '0');

    const profiles = await prisma.domesticProfile.findMany({
      take: limit,
      skip,
      select: {
        id: true,
        description: true,
        hourlyRate: true,
        user: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
            address: true,
            zone: true,
          },
        },
        skills: {
          select: {
            skillType: true,
          },
        },
      },
    });

    const total = await prisma.domesticProfile.count();

    return NextResponse.json({
      profiles,
      total,
      limit,
      skip,
    });
  } catch (error) {
    console.error('Profiles fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching profiles' },
      { status: 500 }
    );
  }
}
