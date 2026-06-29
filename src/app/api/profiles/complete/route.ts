import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any;

    const body = await request.json();
    const {
      description,
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
      skills,
      photoUrl,
      nannyDescription,
      nannyAgesHandled,
      nannyMaxChildren,
      nannyExperience,
    } = body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: 'Debes seleccionar al menos un servicio' },
        { status: 400 }
      );
    }

    if (!hourlyRate) {
      return NextResponse.json(
        { error: 'La tarifa por hora es obligatoria' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    let profile = await prisma.domesticProfile.findUnique({
      where: { userId: decoded.userId },
    });

    if (photoUrl) {
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { photoUrl },
      });
    }

    const profileData = {
      description,
      personalTraits: personalTraits || [],
      languages: languages || [],
      hasLicense: hasLicense || false,
      ownCar: ownCar || false,
      doesSmoke: doesSmoke || false,
      petFriendly: petFriendly || false,
      vaccinated: vaccinated || false,
      cprCertified: cprCertified || false,
      hourlyRate: hourlyRate ? parseInt(hourlyRate) : 0,
      isNegotiable: isNegotiable !== false,
      nannyDescription: nannyDescription || null,
      nannyAgesHandled: nannyAgesHandled || [],
      nannyMaxChildren: nannyMaxChildren || null,
      nannyExperience: nannyExperience || null,
    };

    if (!profile) {
      profile = await prisma.domesticProfile.create({
        data: {
          userId: decoded.userId,
          ...profileData,
        },
      });
    } else {
      profile = await prisma.domesticProfile.update({
        where: { userId: decoded.userId },
        data: profileData,
      });
    }

    await prisma.skill.deleteMany({
      where: { domesticProfileId: profile.id },
    });

    for (const skill of skills) {
      await prisma.skill.create({
        data: {
          domesticProfileId: profile.id,
          skillType: skill,
        },
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Profile complete error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error saving profile';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
