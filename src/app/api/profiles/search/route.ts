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
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const skill = request.nextUrl.searchParams.get('skill');
    const zone = request.nextUrl.searchParams.get('zone');
    const minPrice = request.nextUrl.searchParams.get('minPrice');
    const maxPrice = request.nextUrl.searchParams.get('maxPrice');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const skip = parseInt(request.nextUrl.searchParams.get('skip') || '0');

    // Build where clause
    const where: any = {};

    // Filter by skill
    if (skill) {
      where.skills = {
        some: {
          skillType: skill,
        },
      };
    }

    // Filter by zone
    if (zone) {
      where.user = {
        zone: {
          contains: zone,
          mode: 'insensitive',
        },
      };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.hourlyRate = {};
      if (minPrice) where.hourlyRate.gte = parseInt(minPrice);
      if (maxPrice) where.hourlyRate.lte = parseInt(maxPrice);
    }

    // Query
    const profiles = await prisma.domesticProfile.findMany({
      where,
      take: limit,
      skip,
      select: {
        id: true,
        description: true,
        hourlyRate: true,
        user: {
          select: {
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

    const total = await prisma.domesticProfile.count({ where });

    return NextResponse.json({
      profiles,
      total,
      limit,
      skip,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error searching profiles' },
      { status: 500 }
    );
  }
}
