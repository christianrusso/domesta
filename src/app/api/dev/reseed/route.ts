import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAIFaceUrl } from '@/lib/aifaces';
import bcrypt from 'bcryptjs';

const nannyDescriptions = [
  'Niñera con 8 años de experiencia. Excelente con bebés y preescolares. Paciente y responsable.',
  'Cuidadora infantil profesional. CPR certificada. Especializada en estimulación temprana.',
];

const cookingDescriptions = [
  'Cocinera profesional con 12 años. Cocina casera, repostería y dietas especiales.',
  'Chef con especialidad en comida saludable y vegetariana.',
];

const cleaningDescriptions = [
  'Limpiadora profesional con 8 años. Limpieza general y profunda. Muy prolija.',
  'Especialista en limpieza. Hogares grandes y limpieza post-obra.',
];

let userIndex = 0;

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
        data: { name, email, password, address: `Calle ${i}`, zone, photoUrl: getAIFaceUrl(userIndex++), role: 'CLIENT', isApproved: true },
      });
    }

    for (let i = 1; i <= 15; i++) {
      const typeMap = [
        { type: 'NANNY', prefix: 'nanny', descriptions: nannyDescriptions },
        { type: 'COOKING', prefix: 'chef', descriptions: cookingDescriptions },
        { type: 'CLEANING', prefix: 'cleaner', descriptions: cleaningDescriptions },
      ];
      const svc = typeMap[Math.floor((i - 1) / 5)];
      const name = `${names[i % 5]} ${surnames[i % 5]}`;
      const email = `${svc.prefix}${i}@test.com`;
      const password = await bcrypt.hash('password123', 10);
      const zone = 'Recoleta, CABA';
      const description = svc.descriptions[(i - 1) % svc.descriptions.length];
      const user = await prisma.user.create({
        data: { name, email, password, address: `Calle ${i}`, zone, photoUrl: getAIFaceUrl(userIndex++), role: 'DOMESTIC', isApproved: true },
      });
      const profile = await prisma.domesticProfile.create({
        data: {
          userId: user.id,
          description,
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

      // Crear horarios con patrones variados
      let availabilityDays: Array<{ day: string; start: string; end: string }> = [];
      const availPattern = i % 5;

      if (availPattern === 0 || availPattern === 1) {
        // Lunes a viernes
        availabilityDays = [
          { day: 'Mon', start: '09:00', end: '18:00' },
          { day: 'Tue', start: '09:00', end: '18:00' },
          { day: 'Wed', start: '09:00', end: '18:00' },
          { day: 'Thu', start: '09:00', end: '18:00' },
          { day: 'Fri', start: '09:00', end: '18:00' },
        ];
      } else if (availPattern === 2) {
        // Solo sábados
        availabilityDays = [{ day: 'Sat', start: '10:00', end: '18:00' }];
      } else if (availPattern === 3) {
        // Fines de semana
        availabilityDays = [
          { day: 'Sat', start: '09:00', end: '19:00' },
          { day: 'Sun', start: '10:00', end: '17:00' },
        ];
      } else {
        // Lunes a viernes mañana + sábado
        availabilityDays = [
          { day: 'Mon', start: '08:00', end: '14:00' },
          { day: 'Tue', start: '08:00', end: '14:00' },
          { day: 'Wed', start: '08:00', end: '14:00' },
          { day: 'Thu', start: '08:00', end: '14:00' },
          { day: 'Fri', start: '08:00', end: '14:00' },
          { day: 'Sat', start: '10:00', end: '16:00' },
        ];
      }

      for (const { day, start, end } of availabilityDays) {
        await prisma.availability.create({
          data: {
            domesticProfileId: profile.id,
            dayOfWeek: day,
            startTime: start,
            endTime: end,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'OK' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
