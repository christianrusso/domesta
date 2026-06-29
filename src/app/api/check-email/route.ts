import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    return NextResponse.json(
      { available: !existingUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { error: 'Error validando email' },
      { status: 500 }
    );
  }
}
