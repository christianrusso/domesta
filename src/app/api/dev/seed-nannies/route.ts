import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const getGravatarUrl = (email: string) => {
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
};

const firstNames = ['María', 'Ana', 'Carmen', 'Rosa', 'Francisca', 'Isabel', 'Juana', 'Dolores', 'Pilar', 'Gloria',
  'Elena', 'Teresa', 'Marta', 'Patricia', 'Beatriz', 'Magdalena', 'Antonia', 'Encarnación', 'Esperanza', 'Soledad',
  'Amparo', 'Virtudes', 'Felicidad', 'Milagros', 'Consuelo', 'Graciela', 'Silvia', 'Susana', 'Claudia', 'Patricia'];

const lastNames = ['García', 'Martínez', 'López', 'González', 'Rodríguez', 'Fernández', 'Pérez', 'Díaz', 'Sánchez', 'Ramírez',
  'Morales', 'Torres', 'Flores', 'Rivera', 'Gutierrez', 'Ortiz', 'Vargas', 'Castro', 'Herrera', 'Medina',
  'Vega', 'Reyes', 'Mendoza', 'Campos', 'Rojas', 'Moreno', 'Navarro', 'Contreras', 'Ríos', 'Acosta'];

const provinces = ['Buenos Aires', 'CABA', 'Córdoba', 'Mendoza', 'Tucumán'];
const localities = {
  'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca', 'Bragado', 'Junín'],
  'CABA': ['San Telmo', 'Recoleta', 'Palermo', 'Caballito', 'Villa Urquiza'],
  'Córdoba': ['Córdoba Capital', 'Río Cuarto', 'Villa María', 'Jesús María', 'San Francisco'],
  'Mendoza': ['Mendoza Capital', 'Godoy Cruz', 'Las Heras', 'Maipú', 'Luján de Cuyo'],
  'Tucumán': ['San Miguel de Tucumán', 'Yerba Buena', 'Tafí Viejo', 'Concepción', 'Alderetes'],
};

const ageGroups = ['0-2', '3-5', '6-8', '9-12'];
const personalTraits = ['Responsable', 'Paciente', 'Creativa', 'Energética', 'Confiable', 'Amable'];

export async function POST(request: NextRequest) {
  try {
    // Verificar API key simple
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== 'Bearer dev-seed-key') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Borrar todas las niñeras (DomesticProfile cascadeará)
    const deletedProfiles = await prisma.domesticProfile.deleteMany({});
    const deletedUsers = await prisma.user.deleteMany({
      where: { role: 'DOMESTIC' },
    });

    console.log(`Borrados: ${deletedProfiles.count} perfiles, ${deletedUsers.count} usuarios domésticos`);

    // Crear 100 niñeras
    const createdNannies = [];
    for (let i = 1; i <= 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const email = `nanny${i}@test.com`;
      const password = await bcrypt.hash('password123', 10);
      const province = provinces[Math.floor(Math.random() * provinces.length)];
      const localityList = localities[province as keyof typeof localities];
      const locality = localityList[Math.floor(Math.random() * localityList.length)];
      const zone = `${locality}, ${province}`;
      const hourlyRate = 1000 + Math.floor(Math.random() * 2000);

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          address: `Calle ${Math.floor(Math.random() * 9000)} ${Math.floor(Math.random() * 999)}`,
          zone,
          photoUrl: getGravatarUrl(email),
          role: 'DOMESTIC',
          isApproved: true,
        },
      });

      // Crear perfil doméstico
      const selectedTraits = personalTraits
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 2);

      const selectedAges = ageGroups.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);

      const profile = await prisma.domesticProfile.create({
        data: {
          userId: user.id,
          description: `Soy ${name}, niñera experimentada con pasión por el cuidado infantil. Ofrezco atención personalizada y divertida para los niños.`,
          personalTraits: selectedTraits,
          languages: ['Español'],
          hourlyRate,
          isNegotiable: Math.random() > 0.5,
          nannyDescription: `Cuido niños desde recién nacidos hasta 12 años. Experiencia en educación inicial y primaria.`,
          nannyAgesHandled: selectedAges,
          nannyMaxChildren: Math.floor(Math.random() * 3) + 1,
          nannyExperience: `${Math.floor(Math.random() * 10) + 1} años`,
          experience: `${Math.floor(Math.random() * 10) + 1} años`,
          availabilityTypes: Math.random() > 0.5 ? ['regular'] : ['occasional'],
          petFriendly: Math.random() > 0.5,
          vaccinated: true,
          cprCertified: Math.random() > 0.3,
          isApproved: true,
        },
      });

      // Crear skill NANNY
      await prisma.skill.create({
        data: {
          domesticProfileId: profile.id,
          skillType: 'NANNY',
        },
      });

      createdNannies.push({ id: user.id, name, email });
    }

    return NextResponse.json({
      success: true,
      message: '100 niñeras de prueba creadas',
      deletedCount: { profiles: deletedProfiles.count, users: deletedUsers.count },
      createdCount: createdNannies.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Error creando datos de prueba' },
      { status: 500 }
    );
  }
}
