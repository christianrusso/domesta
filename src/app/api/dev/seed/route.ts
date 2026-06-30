import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const getGravatarUrl = (email: string) => {
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
};

const seedData = [
  {
    name: 'María González',
    email: 'maria.gonzalez@test.com',
    description: 'Tengo 8 años de experiencia en limpieza. Soy responsable, puntual y muy prolija.',
    hourlyRate: 2500,
    skills: ['CLEANING'],
    personalTraits: ['Puntual', 'Confiable', 'Prolija'],
    languages: ['Español'],
    zone: 'Caseros',
    hasLicense: true,
  },
  {
    name: 'Ana Martínez',
    email: 'ana.martinez@test.com',
    description: 'Niñera con 10 años de experiencia. Especializada en niños de 0-5 años. Muy atenta y paciente.',
    hourlyRate: 3000,
    skills: ['NANNY'],
    personalTraits: ['Paciente', 'Atenta', 'Simpática'],
    languages: ['Español', 'Inglés'],
    zone: 'La Matanza',
    hasLicense: false,
  },
  {
    name: 'Carmen López',
    email: 'carmen.lopez@test.com',
    description: 'Chef con 12 años de experiencia. Cocina casera y repostería. Dietas especiales.',
    hourlyRate: 3500,
    skills: ['COOKING'],
    personalTraits: ['Organizada', 'Creativa'],
    languages: ['Español'],
    zone: 'Flores',
    hasLicense: true,
    ownCar: true,
  },
  {
    name: 'Rosa Fernández',
    email: 'rosa.fernandez@test.com',
    description: 'Multioficio: limpieza, cuidado de niños y cocina básica. 15 años en el rubro.',
    hourlyRate: 2800,
    skills: ['CLEANING', 'NANNY', 'COOKING'],
    personalTraits: ['Puntual', 'Confiable', 'Organizada', 'Simpática'],
    languages: ['Español'],
    zone: 'San Justo',
    hasLicense: true,
  },
  {
    name: 'Lucia Rodríguez',
    email: 'lucia.rodriguez@test.com',
    description: 'Especialista en limpieza profunda y mantenimiento. Experiencia con casas grandes.',
    hourlyRate: 3200,
    skills: ['CLEANING'],
    personalTraits: ['Prolija', 'Confiable', 'Puntual'],
    languages: ['Español', 'Portugués'],
    zone: 'Ituzaingó',
    hasLicense: false,
  },
  {
    name: 'Teresa Gómez',
    email: 'teresa.gomez@test.com',
    description: 'Niñera y cuidadora. Experiencia con niños especiales. Muy comprometida.',
    hourlyRate: 3500,
    skills: ['NANNY'],
    personalTraits: ['Paciente', 'Comprometida', 'Atenta'],
    languages: ['Español'],
    zone: 'Morón',
    hasLicense: true,
    ownCar: true,
  },
  {
    name: 'Gabriela Pérez',
    email: 'gabriela.perez@test.com',
    description: 'Cocinera especializada en comida saludable y vegetariana. Cursos de nutrición.',
    hourlyRate: 4000,
    skills: ['COOKING'],
    personalTraits: ['Profesional', 'Organizada', 'Creativa'],
    languages: ['Español', 'Inglés'],
    zone: 'Castelar',
    hasLicense: true,
  },
  {
    name: 'Silvia Torres',
    email: 'silvia.torres@test.com',
    description: 'Limpieza y organización. Especialista en feng shui y organización de espacios.',
    hourlyRate: 3000,
    skills: ['CLEANING'],
    personalTraits: ['Organizada', 'Prolija', 'Creativa'],
    languages: ['Español'],
    zone: 'Ramos Mejía',
    hasLicense: false,
  },
  {
    name: 'Beatriz Sánchez',
    email: 'beatriz.sanchez@test.com',
    description: 'Niñera, limpieza y cocina. Persona de confianza con muchos años de experiencia.',
    hourlyRate: 2900,
    skills: ['NANNY', 'CLEANING', 'COOKING'],
    personalTraits: ['Confiable', 'Puntual', 'Simpática', 'Paciente'],
    languages: ['Español'],
    zone: 'Lanús',
    hasLicense: true,
  },
  {
    name: 'Norma Díaz',
    email: 'norma.diaz@test.com',
    description: 'Limpieza profunda y pasante. 20 años en limpieza de hogares de clase alta.',
    hourlyRate: 3300,
    skills: ['CLEANING'],
    personalTraits: ['Prolija', 'Profesional', 'Confiable'],
    languages: ['Español'],
    zone: 'Avellaneda',
    hasLicense: true,
    ownCar: true,
  },
];

export async function GET(request: NextRequest) {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seed endpoint not available in production' },
      { status: 403 }
    );
  }

  try {
    // Limpiar datos previos (opcional)
    const deleteMessages = await prisma.message.deleteMany({});
    const deleteConversations = await prisma.conversation.deleteMany({});
    const deleteSkills = await prisma.skill.deleteMany({});
    const deleteAvailability = await prisma.availability.deleteMany({});
    const deleteProfiles = await prisma.domesticProfile.deleteMany({});
    const deleteUsers = await prisma.user.deleteMany({ where: { role: 'DOMESTIC' } });

    console.log('Deleted existing data');

    // Crear empleadas de prueba
    let createdCount = 0;

    for (const employee of seedData) {
      const hashedPassword = await bcrypt.hash('password123', 10);

      const user = await prisma.user.create({
        data: {
          email: employee.email,
          password: hashedPassword,
          name: employee.name,
          zone: employee.zone,
          photoUrl: getGravatarUrl(employee.email),
          role: 'DOMESTIC',
          isApproved: true, // Auto-approve para testing
        },
      });

      const profile = await prisma.domesticProfile.create({
        data: {
          userId: user.id,
          description: employee.description,
          hourlyRate: employee.hourlyRate,
          personalTraits: employee.personalTraits,
          languages: employee.languages,
          hasLicense: employee.hasLicense,
          ownCar: employee.ownCar || false,
          isApproved: true,
        },
      });

      // Crear skills
      for (const skill of employee.skills) {
        await prisma.skill.create({
          data: {
            domesticProfileId: profile.id,
            skillType: skill as any,
          },
        });
      }

      // Crear disponibilidad (todos disponibles de lunes a viernes)
      for (let day = 0; day < 5; day++) {
        await prisma.availability.create({
          data: {
            domesticProfileId: profile.id,
            dayOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][day],
            startTime: '09:00',
            endTime: '18:00',
          },
        });
      }

      createdCount++;
      console.log(`✓ Created: ${employee.name}`);
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdCount} test employees`,
      employees: seedData.map((e) => ({ name: e.name, email: e.email, skills: e.skills })),
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Error seeding data', details: String(error) },
      { status: 500 }
    );
  }
}
