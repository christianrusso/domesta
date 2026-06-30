import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const getGravatarUrl = (email: string) => {
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
};

export async function POST(request: NextRequest) {
  try {
    await prisma.domesticProfile.deleteMany({});
    await prisma.user.deleteMany({ where: { role: { in: ['DOMESTIC', 'CLIENT'] } } });

    const names = ['María', 'Ana', 'Rosa', 'Carmen', 'Isabel'];
    const surnames = ['García', 'López', 'González', 'Pérez', 'Díaz'];
    const provinces = ['Buenos Aires', 'CABA'];
    const localities = { 'Buenos Aires': ['La Plata', 'Mar del Plata'], 'CABA': ['San Telmo', 'Recoleta'] };

    for (let i = 1; i <= 5; i++) {
      const name = `${names[i % 5]} ${surnames[i % 5]}`;
      const email = `client${i}@test.com`;
      const password = await bcrypt.hash('password123', 10);
      const zone = 'Recoleta, CABA';
      await prisma.user.create({
        data: { name, email, password, address: `Calle ${i}`, zone, photoUrl: getGravatarUrl(email), role: 'CLIENT', isApproved: true },
      });
    }

    for (let i = 1; i <= 15; i++) {
      const typeMap = [
        { type: 'NANNY', prefix: 'nanny', desc: 'Niñera' },
        { type: 'COOKING', prefix: 'chef', desc: 'Cocinera' },
        { type: 'CLEANING', prefix: 'cleaner', desc: 'Limpiadora' },
      ];
      const svc = typeMap[Math.floor((i - 1) / 5)];
      const name = `${names[i % 5]} ${surnames[i % 5]}`;
      const email = `${svc.prefix}${i}@test.com`;
      const password = await bcrypt.hash('password123', 10);
      const zone = 'Recoleta, CABA';
      const user = await prisma.user.create({
        data: { name, email, password, address: `Calle ${i}`, zone, photoUrl: getGravatarUrl(email), role: 'DOMESTIC', isApproved: true },
      });
      const profile = await prisma.domesticProfile.create({
        data: {
          userId: user.id,
          description: `Profesional ${svc.desc}`,
          personalTraits: ['Responsable'],
          languages: ['Español'],
          hourlyRate: 1500,
          isNegotiable: true,
          nannyAgesHandled: ['0-2'],
          experience: '5 años',
          availabilityTypes: ['regular'],
          vaccinated: true,
          isApproved: true,
        },
      });
      await prisma.skill.create({
        data: { domesticProfileId: profile.id, skillType: svc.type as any },
      });
    }

    return NextResponse.json({ success: true, message: 'OK' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
