import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      address,
      zone,
      role,
      // Domestic fields
      personalTraits,
      languages,
      hasLicense,
      ownCar,
      doesSmoke,
      petFriendly,
      vaccinated,
      cprCertified,
      hourlyRate,
      isNegotiable,
      nannyDescription,
      nannyAgesHandled,
      nannyMaxChildren,
      nannyExperience,
      experience,
      availabilityTypes,
      skills,
      cleaningType,
      cleaningDetails,
      cookingType,
      cookingDetails,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        zone,
        role: role || 'CLIENT',
      },
    });

    if (role === 'DOMESTIC') {
      const domesticProfile = await prisma.domesticProfile.create({
        data: {
          userId: user.id,
          personalTraits: personalTraits || [],
          languages: languages || [],
          hasLicense: hasLicense || false,
          ownCar: ownCar || false,
          doesSmoke: doesSmoke || false,
          petFriendly: petFriendly || false,
          vaccinated: vaccinated || false,
          cprCertified: cprCertified || false,
          hourlyRate: hourlyRate || 0,
          isNegotiable: isNegotiable !== false,
          nannyDescription: nannyDescription || null,
          nannyAgesHandled: nannyAgesHandled || [],
          nannyMaxChildren: nannyMaxChildren || null,
          nannyExperience: nannyExperience || null,
          experience: experience || null,
          availabilityTypes: availabilityTypes || [],
          cleaningType: cleaningType || null,
          cleaningDetails: cleaningDetails || null,
          cookingType: cookingType || null,
          cookingDetails: cookingDetails || null,
        },
      });

      // Create skills
      if (skills && Array.isArray(skills) && skills.length > 0) {
        for (const skill of skills) {
          await prisma.skill.create({
            data: {
              domesticProfileId: domesticProfile.id,
              skillType: skill,
            },
          });
        }
      }
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    return NextResponse.json(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        token,
        needsProfileSetup: role === 'DOMESTIC',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
