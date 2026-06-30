'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatZone } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';

interface DomesticProfile {
  id: string;
  userId: string;
  description: string | null;
  personalTraits: string[] | string | null;
  languages: string[] | string | null;
  hourlyRate: number | null;
  isNegotiable: boolean;
  hasLicense: boolean;
  ownCar: boolean;
  doesSmoke: boolean;
  petFriendly: boolean;
  vaccinated: boolean;
  cprCertified: boolean;
  experience: string | null;
  availabilityTypes: string[];
  nannyAgesHandled: string[];
  nannyMaxChildren: number | null;
  nannyExperience: string | null;
  nannyDescription: string | null;
  cleaningType: string | null;
  cleaningDetails: string | null;
  cookingType: string | null;
  cookingDetails: string | null;
  skills: Array<{ skillType: string }>;
  availability: Array<{
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
  user: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    zone: string | null;
    photoUrl: string | null;
    createdAt: string;
  };
}

export default function ProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const profileId = (params?.id as string) || '';

  const [profile, setProfile] = useState<DomesticProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [referrer, setReferrer] = useState<string>('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ref = document.referrer;
      if (ref.includes('/search')) {
        setReferrer('/search');
      } else if (ref.includes('/dashboard') || ref.includes('/')) {
        setReferrer('/');
      }
    }
  }, []);

  useEffect(() => {
    if (!profileId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchProfile(token);
  }, [profileId, router]);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`/api/profiles/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setError('Perfil no encontrado');
        return;
      }

      const data = await res.json();
      if (typeof data.personalTraits === 'string') {
        data.personalTraits = JSON.parse(data.personalTraits);
      }
      if (typeof data.languages === 'string') {
        data.languages = JSON.parse(data.languages);
      }
      setProfile(data);
    } catch (error) {
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!profileId) {
      alert('Cargando perfil... intenta de nuevo');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domesticProfileId: profileId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al crear conversación');
      }

      const data = await res.json();
      router.push(`/inbox?conversationId=${data.conversationId}`);
    } catch (error) {
      console.error('Contact error:', error);
      alert(`Error al contactar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!profile || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br slate-950 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-white/70 mb-4 text-lg">{error || 'Perfil no disponible'}</p>
            <Link href="/search" className="text-purple-300 hover:text-purple-200 font-semibold">
              ← Volver al buscador
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const personalTraits = Array.isArray(profile.personalTraits)
    ? profile.personalTraits
    : [];
  const languages = Array.isArray(profile.languages) ? profile.languages : [];
  const isNanny = profile.skills.some((s) => s.skillType === 'NANNY');
  const isCooking = profile.skills.some((s) => s.skillType === 'COOKING');
  const isCleaning = profile.skills.some((s) => s.skillType === 'CLEANING');

  const getDayName = (day: string): string => {
    const days: Record<string, string> = {
      'Mon': 'Lunes',
      'Tue': 'Martes',
      'Wed': 'Miércoles',
      'Thu': 'Jueves',
      'Fri': 'Viernes',
      'Sat': 'Sábado',
      'Sun': 'Domingo',
    };
    return days[day] || day;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br slate-950 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <button
          onClick={() => router.back()}
          className="text-purple-300 hover:text-purple-200 font-semibold mb-4 sm:mb-8 inline-block transition text-sm sm:text-base"
        >
          ← Volver
        </button>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
          {/* Header with Photo */}
          <div className="aspect-video sm:aspect-video bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
            {profile.user.photoUrl ? (
              <img
                src={profile.user.photoUrl}
                alt={profile.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar name={profile.user.name} photoUrl={null} size="xl" />
            )}
          </div>

          {/* Profile Info */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{profile.user.name}</h1>
              <p className="text-white/60 text-base sm:text-lg mb-3 sm:mb-4">📍 {formatZone(profile.user.zone)}</p>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.skillType}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg"
                  >
                    {skill.skillType === 'CLEANING' && '🧹 Limpieza'}
                    {skill.skillType === 'NANNY' && '👶 Niñera'}
                    {skill.skillType === 'COOKING' && '👨‍🍳 Cocina'}
                  </span>
                ))}
              </div>
            </div>

            {/* Tarifa */}
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 sm:p-6">
              <p className="text-white/60 text-xs sm:text-sm mb-2">Tarifa por hora</p>
              <p className="text-3xl sm:text-4xl font-bold text-green-300">
                ${profile.hourlyRate}
              </p>
              {profile.isNegotiable && (
                <p className="text-green-200 text-xs sm:text-sm mt-2">💬 Precio negociable</p>
              )}
            </div>

            {/* Descripción General */}
            {profile.description && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Sobre mí</h2>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <p className="text-white/80 leading-relaxed">{profile.description}</p>
                </div>
              </div>
            )}

            {/* Experiencia */}
            {profile.experience && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Experiencia</h2>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6">
                  <p className="text-white/80 font-semibold text-sm sm:text-base">{profile.experience}</p>
                </div>
              </div>
            )}

            {/* Sección Niñera */}
            {isNanny && (
              <div className="border-l-4 border-blue-500 pl-4 sm:pl-6 py-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">👶 Servicios de Niñera</h2>

                {profile.nannyDescription && (
                  <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-6">
                    <p className="text-white/80">{profile.nannyDescription}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.nannyAgesHandled.length > 0 && (
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                      <p className="text-white/60 text-xs sm:text-sm mb-2">Edades que atiende</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.nannyAgesHandled.map((age) => (
                          <span key={age} className="bg-blue-600/50 text-blue-100 px-3 py-1 rounded-full text-sm">
                            {age}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.nannyMaxChildren && (
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-2">Máximo de niños</p>
                      <p className="text-white font-semibold">{profile.nannyMaxChildren} niños</p>
                    </div>
                  )}
                  {profile.nannyExperience && (
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-2">Experiencia en niñera</p>
                      <p className="text-white font-semibold">{profile.nannyExperience}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sección Limpieza */}
            {isCleaning && (
              <div className="border-l-4 border-purple-500 pl-4 sm:pl-6 py-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">🧹 Servicios de Limpieza</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.cleaningType && (
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-2">Tipo de limpieza</p>
                      <p className="text-white font-semibold">{profile.cleaningType}</p>
                    </div>
                  )}
                  {profile.cleaningDetails && (
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4 col-span-2">
                      <p className="text-white/60 text-sm mb-2">Detalles</p>
                      <p className="text-white">{profile.cleaningDetails}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sección Cocina */}
            {isCooking && (
              <div className="border-l-4 border-orange-500 pl-6 py-4">
                <h2 className="text-2xl font-bold text-white mb-4">👨‍🍳 Servicios de Cocina</h2>
                <div className="grid grid-cols-2 gap-4">
                  {profile.cookingType && (
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-2">Tipo de cocina</p>
                      <p className="text-white font-semibold">{profile.cookingType}</p>
                    </div>
                  )}
                  {profile.cookingDetails && (
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4 col-span-2">
                      <p className="text-white/60 text-sm mb-2">Detalles</p>
                      <p className="text-white">{profile.cookingDetails}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Disponibilidad */}
            {profile.availabilityTypes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">⏰ Disponibilidad</h2>
                <div className="flex flex-wrap gap-3">
                  {profile.availabilityTypes.includes('regular') && (
                    <span className="bg-green-600/50 text-green-100 px-4 py-2 rounded-lg font-semibold">
                      Horario regular
                    </span>
                  )}
                  {profile.availabilityTypes.includes('occasional') && (
                    <span className="bg-yellow-600/50 text-yellow-100 px-4 py-2 rounded-lg font-semibold">
                      Ocasionalmente
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Idiomas y Características */}
            <div className="grid grid-cols-2 gap-4">
              {languages.length > 0 && (
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <p className="text-white/60 text-sm mb-3">Idiomas</p>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <span key={lang} className="bg-purple-600/50 text-purple-100 px-3 py-1 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {personalTraits.length > 0 && (
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <p className="text-white/60 text-sm mb-3">Características</p>
                  <div className="flex flex-wrap gap-2">
                    {personalTraits.map((trait) => (
                      <span key={trait} className="bg-pink-600/50 text-pink-100 px-3 py-1 rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Horarios de Disponibilidad */}
            {profile.availability && profile.availability.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">📅 Horarios de Disponibilidad</h2>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6">
                  <div className="space-y-3">
                    {profile.availability.map((avail) => (
                      <div key={avail.id} className="flex items-center justify-between p-3 bg-white/10 border border-white/20 rounded-lg">
                        <span className="font-semibold text-white">{getDayName(avail.dayOfWeek)}</span>
                        <span className="text-white/70 text-sm">{avail.startTime} - {avail.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Información Adicional */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">ℹ️ Información Adicional</h2>
              <div className="grid grid-cols-2 gap-4">
                {profile.vaccinated && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <p className="text-white font-semibold">✓ Vacunada</p>
                  </div>
                )}
                {profile.cprCertified && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <p className="text-white font-semibold">✓ Certificado CPR</p>
                  </div>
                )}
                {profile.petFriendly && (
                  <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
                    <p className="text-white font-semibold">🐕 Amable con mascotas</p>
                  </div>
                )}
                {!profile.doesSmoke && (
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-white font-semibold">🚭 No fuma</p>
                  </div>
                )}
                {profile.hasLicense && (
                  <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                    <p className="text-white font-semibold">📋 Licencia</p>
                  </div>
                )}
                {profile.ownCar && (
                  <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                    <p className="text-white font-semibold">🚗 Tiene auto</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Button */}
            <div className="pt-4">
              <button
                onClick={handleContact}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold py-4 px-6 rounded-lg transition text-lg"
              >
                💬 Contactar a {profile.user.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
