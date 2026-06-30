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
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== 'Bearer dev-seed-key') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Borrar todos menos admin
    await prisma.domesticProfile.deleteMany({});
    await prisma.user.deleteMany({ where: { role: { in: ['DOMESTIC', 'CLIENT'] } } });

    const names = ['María', 'Ana', 'Rosa', 'Carmen', 'Isabel', 'Elena', 'Teresa', 'Marta', 'Patricia', 'Beatriz', 'Juan', 'Carlos', 'Pedro', 'Diego', 'Roberto', 'Antonio', 'Miguel', 'Luis', 'Francisco', 'Javier'];
    const surnames = ['García', 'Martínez', 'López', 'González', 'Rodríguez', 'Pérez', 'Díaz', 'Sánchez', 'Ramírez', 'Torres'];
    const provinces = ['Buenos Aires', 'CABA', 'Córdoba', 'Mendoza', 'Tucumán'];
    const localities = {
      'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca'],
      'CABA': ['San Telmo', 'Recoleta', 'Palermo'],
      'Córdoba': ['Córdoba Capital', 'Río Cuarto', 'Villa María'],
      'Mendoza': ['Mendoza Capital', 'Godoy Cruz', 'Las Heras'],
      'Tucumán': ['San Miguel de Tucumán', 'Yerba Buena', 'Tafí Viejo'],
    };

    // Crear 30 clientes
    for (let i = 1; i <= 30; i++) {
      const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
      const email = `client${i}@test.com`;
      const password = await bcrypt.hash('password123', 10);
      const province = provinces[Math.floor(Math.random() * provinces.length)];
      const localityList = localities[province as keyof typeof localities];
      const locality = localityList[Math.floor(Math.random() * localityList.length)];
      const zone = `${locality}, ${province}`;

      await prisma.user.create({
        data: {
          name,
          email,
          password,
          address: `Calle ${Math.floor(Math.random() * 5000)}`,
          zone,
          photoUrl: getGravatarUrl(email),
          role: 'CLIENT',
          isApproved: true,
        },
      });
    }

    // Crear 20 niñeras, 20 cocineras, 20 limpiadoras
    const serviceConfig = [
      { count: 20, type: 'NANNY', prefix: 'nanny' },
      { count: 20, type: 'COOKING', prefix: 'chef' },
      { count: 20, type: 'CLEANING', prefix: 'cleaner' },
    ];

    for (const service of serviceConfig) {
      for (let i = 1; i <= service.count; i++) {
        const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
        const email = `${service.prefix}${i}@test.com`;
        const password = await bcrypt.hash('password123', 10);
        const province = provinces[Math.floor(Math.random() * provinces.length)];
        const localityList = localities[province as keyof typeof localities];
        const locality = localityList[Math.floor(Math.random() * localityList.length)];
        const zone = `${locality}, ${province}`;
        const hourlyRate = 1500 + Math.floor(Math.random() * 2000);

        const user = await prisma.user.create({
          data: { name, email, password, address: `Calle ${Math.floor(Math.random() * 5000)}`, zone, photoUrl: getGravatarUrl(email), role: 'DOMESTIC', isApproved: true },
        });

        const profile = await prisma.domesticProfile.create({
          data: {
            userId: user.id,
            description: `Profesional en ${service.type}`,
            personalTraits: ['Responsable', 'Amable'],
            languages: ['Español'],
            hourlyRate,
            isNegotiable: true,
            nannyAgesHandled: ['0-2', '3-5'],
            nannyMaxChildren: 2,
            nannyExperience: '5 años',
            experience: '5 años',
            availabilityTypes: ['regular'],
            vaccinated: true,
            isApproved: true,
          },
        });

        await prisma.skill.create({
          data: { domesticProfileId: profile.id, skillType: service.type as any },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Datos creados: 30 clientes, 20 niñeras, 20 cocineras, 20 limpiadoras' });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
