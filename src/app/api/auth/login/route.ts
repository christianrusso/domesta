import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    if (user.isSuspended) {
      return NextResponse.json(
        { error: 'Tu cuenta ha sido bloqueada. Por favor, contacta con soporte.' },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    let needsProfileSetup = false;
    let isApproved = true;
    if (user.role === 'DOMESTIC') {
      const domesticProfile = await prisma.domesticProfile.findUnique({
        where: { userId: user.id },
        include: { skills: true },
      });
      needsProfileSetup = !domesticProfile || domesticProfile.skills.length === 0;
      isApproved = domesticProfile?.isApproved || false;
    }

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      token,
      needsProfileSetup,
      isApproved,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
