import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Ya existe un administrador' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@domesta.local',
        password: hashedPassword,
        phone: '',
        address: 'N/A',
        zone: 'N/A',
        role: 'ADMIN',
        isApproved: true,
        isSuspended: false,
      },
    });

    const token = jwt.sign(
      { userId: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Admin creado exitosamente',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      credentials: {
        email: 'admin@domesta.local',
        password: 'admin123',
      },
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creando admin' },
      { status: 500 }
    );
  }
}
