import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAIFaceUrl } from '@/lib/aifaces';
import bcrypt from 'bcryptjs';

const nannyDescriptions = [
  'Niñera experimentada con 8 años en el rubro. Especializada en niños de 0-5 años. Paciente, atenta y muy responsable. CPR certificada.',
  'Profesional en cuidado infantil con 10 años de experiencia. Excelente con bebés recién nacidos. Juegos educativos y estimulación temprana.',
  'Niñera cariñosa con 6 años de experiencia. Especializada en edades 3-8 años. Creativa, energética y muy comprometida con el bienestar de los niños.',
  'Cuidadora de niños con 12 años en el rubro. Experiencia con necesidades especiales. Paciente, empática y muy profesional.',
  'Niñera confiable con 9 años de experiencia. Especializada en múltiples niños simultáneamente. Organizada, responsable y muy puntual.',
  'Profesional en cuidado infantil con 7 años de trayectoria. Soy bilingüe (español-inglés). Estimulación del desarrollo cognitivo.',
  'Niñera experimentada con 11 años en el sector. Especializada en infantes y preescolares. Muy atenta, cuidadosa y proactiva.',
  'Cuidadora con 8 años de experiencia en hogares de clase alta. Educación Inicial certificada. Disciplina respetuosa y estimulación lúdica.',
  'Niñera con 6 años de trayectoria. Experta en rutinas y hábitos saludables. Seguridad y confianza en todo momento.',
  'Profesional en cuidado de niños con 10 años. Experiencia con niños con discapacidades. Formación en primeros auxilios pediatricos.',
];

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
          photoUrl: getAIFaceUrl(i - 1),
          role: 'DOMESTIC',
          isApproved: true,
        },
      });

      // Crear perfil doméstico
      const selectedTraits = personalTraits
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 2);

      const selectedAges = ageGroups.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);

      const description = nannyDescriptions[i % nannyDescriptions.length];

      const profile = await prisma.domesticProfile.create({
        data: {
          userId: user.id,
          description,
          personalTraits: selectedTraits,
          languages: ['Español'],
          hourlyRate,
          isNegotiable: Math.random() > 0.5,
          nannyDescription: description,
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

      // Crear horarios con patrones variados
      let availabilityDays: Array<{ day: string; start: string; end: string }> = [];
      const availPattern = i % 7;

      if (availPattern === 0 || availPattern === 1) {
        // Lunes a viernes (40%)
        availabilityDays = [
          { day: 'Mon', start: '07:00', end: '19:00' },
          { day: 'Tue', start: '07:00', end: '19:00' },
          { day: 'Wed', start: '07:00', end: '19:00' },
          { day: 'Thu', start: '07:00', end: '19:00' },
          { day: 'Fri', start: '07:00', end: '19:00' },
        ];
      } else if (availPattern === 2) {
        // Solo sábados (30%)
        availabilityDays = [{ day: 'Sat', start: '09:00', end: '18:00' }];
      } else if (availPattern === 3) {
        // Fines de semana (15%)
        availabilityDays = [
          { day: 'Sat', start: '09:00', end: '19:00' },
          { day: 'Sun', start: '10:00', end: '18:00' },
        ];
      } else if (availPattern === 4) {
        // Lunes, miércoles, viernes + sábado (15%)
        availabilityDays = [
          { day: 'Mon', start: '08:00', end: '16:00' },
          { day: 'Wed', start: '08:00', end: '16:00' },
          { day: 'Fri', start: '08:00', end: '16:00' },
          { day: 'Sat', start: '10:00', end: '17:00' },
        ];
      } else if (availPattern === 5) {
        // Martes, jueves, sábado, domingo
        availabilityDays = [
          { day: 'Tue', start: '14:00', end: '20:00' },
          { day: 'Thu', start: '14:00', end: '20:00' },
          { day: 'Sat', start: '09:00', end: '18:00' },
          { day: 'Sun', start: '10:00', end: '17:00' },
        ];
      } else {
        // Lunes a domingo (7 días)
        availabilityDays = [
          { day: 'Mon', start: '07:00', end: '19:00' },
          { day: 'Tue', start: '07:00', end: '19:00' },
          { day: 'Wed', start: '07:00', end: '19:00' },
          { day: 'Thu', start: '07:00', end: '19:00' },
          { day: 'Fri', start: '07:00', end: '19:00' },
          { day: 'Sat', start: '09:00', end: '18:00' },
          { day: 'Sun', start: '10:00', end: '17:00' },
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
