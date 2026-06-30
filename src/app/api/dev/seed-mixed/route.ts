import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAIFaceUrl } from '@/lib/aifaces';
import bcrypt from 'bcryptjs';

const nannyDescriptions = [
  'Niñera con 8 años de experiencia. Excelente con bebés y preescolares. Paciente, responsable y muy atenta.',
  'Cuidadora infantil profesional con 10 años en el rubro. CPR certificada. Especializada en estimulación temprana.',
  'Niñera confiable con 7 años de experiencia. Bilingüe español-inglés. Educación lúdica y seguridad en primer lugar.',
];

const cookingDescriptions = [
  'Cocinera profesional con 12 años de experiencia. Cocina casera, repostería y dietas especiales. Menúes balanceados.',
  'Chef con 9 años en el rubro. Especializada en comida saludable y vegetariana. Cocina italiana y argentina.',
  'Cocinera experimentada con 10 años. Menúes para niños, alérgicos y dietas especiales. Muy organizada.',
];

const cleaningDescriptions = [
  'Limpiadora profesional con 8 años de experiencia. Limpieza general, profunda y post-obra. Muy prolija y responsable.',
  'Especialista en limpieza con 10 años en el sector. Hogares grandes, limpieza profunda, detergentes ecológicos.',
  'Limpiadora confiable con 9 años de trayectoria. Limpieza semanal, mensual y profunda. Referencias excelentes.',
];

let userIndex = 0;

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
          photoUrl: getAIFaceUrl(userIndex++),
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
      let descIndex = 0;
      for (let i = 1; i <= service.count; i++) {
        const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
        const email = `${service.prefix}${i}@test.com`;
        const password = await bcrypt.hash('password123', 10);
        const province = provinces[Math.floor(Math.random() * provinces.length)];
        const localityList = localities[province as keyof typeof localities];
        const locality = localityList[Math.floor(Math.random() * localityList.length)];
        const zone = `${locality}, ${province}`;
        const hourlyRate = 1500 + Math.floor(Math.random() * 2000);

        let description = '';
        if (service.type === 'NANNY') description = nannyDescriptions[descIndex % nannyDescriptions.length];
        else if (service.type === 'COOKING') description = cookingDescriptions[descIndex % cookingDescriptions.length];
        else if (service.type === 'CLEANING') description = cleaningDescriptions[descIndex % cleaningDescriptions.length];
        descIndex++;

        const user = await prisma.user.create({
          data: { name, email, password, address: `Calle ${Math.floor(Math.random() * 5000)}`, zone, photoUrl: getAIFaceUrl(userIndex++), role: 'DOMESTIC', isApproved: true },
        });

        const profile = await prisma.domesticProfile.create({
          data: {
            userId: user.id,
            description,
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

        // Crear horarios con disponibilidad variada
        let availabilityDays: Array<{ day: string; start: string; end: string }> = [];
        const availPattern = i % 7;

        if (availPattern === 0) {
          // Lunes a viernes
          availabilityDays = [
            { day: 'Mon', start: '09:00', end: '18:00' },
            { day: 'Tue', start: '09:00', end: '18:00' },
            { day: 'Wed', start: '09:00', end: '18:00' },
            { day: 'Thu', start: '09:00', end: '18:00' },
            { day: 'Fri', start: '09:00', end: '18:00' },
          ];
        } else if (availPattern === 1) {
          // Solo sábados
          availabilityDays = [{ day: 'Sat', start: '10:00', end: '18:00' }];
        } else if (availPattern === 2) {
          // Solo domingos
          availabilityDays = [{ day: 'Sun', start: '10:00', end: '17:00' }];
        } else if (availPattern === 3) {
          // Fines de semana
          availabilityDays = [
            { day: 'Sat', start: '09:00', end: '19:00' },
            { day: 'Sun', start: '10:00', end: '18:00' },
          ];
        } else if (availPattern === 4) {
          // Lunes, miércoles, viernes
          availabilityDays = [
            { day: 'Mon', start: '08:00', end: '14:00' },
            { day: 'Wed', start: '08:00', end: '14:00' },
            { day: 'Fri', start: '08:00', end: '14:00' },
          ];
        } else if (availPattern === 5) {
          // Martes, jueves, sábado
          availabilityDays = [
            { day: 'Tue', start: '14:00', end: '20:00' },
            { day: 'Thu', start: '14:00', end: '20:00' },
            { day: 'Sat', start: '10:00', end: '16:00' },
          ];
        } else {
          // Lunes a viernes (mañana) + sábado
          availabilityDays = [
            { day: 'Mon', start: '07:00', end: '13:00' },
            { day: 'Tue', start: '07:00', end: '13:00' },
            { day: 'Wed', start: '07:00', end: '13:00' },
            { day: 'Thu', start: '07:00', end: '13:00' },
            { day: 'Fri', start: '07:00', end: '13:00' },
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
    }

    return NextResponse.json({ success: true, message: 'Datos creados: 30 clientes, 20 niñeras, 20 cocineras, 20 limpiadoras' });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
