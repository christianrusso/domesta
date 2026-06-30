'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { formatZone } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  zone: string | null;
  photoUrl: string | null;
  role: string;
  domesticProfile?: {
    id: string;
    description: string | null;
    hourlyRate: number | null;
    isApproved: boolean;
    skills: Array<{ skillType: string }>;
    personalTraits: string[] | string;
    languages: string[] | string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchProfile(token);
  }, [router]);

  useEffect(() => {
    if (user && user.role === 'DOMESTIC') {
      const isProfileComplete = user.domesticProfile &&
        user.domesticProfile.skills &&
        user.domesticProfile.skills.length > 0;

      if (!isProfileComplete) {
        router.push(`/profile/setup?userId=${user.id}`);
      }
    }
  }, [user, router]);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br slate-950 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-white/70 text-lg">Error al cargar perfil</p>
          </div>
        </div>
      </div>
    );
  }

  const isDomestic = user.role === 'DOMESTIC';
  const personalTraits = Array.isArray(user.domesticProfile?.personalTraits)
    ? user.domesticProfile.personalTraits
    : typeof user.domesticProfile?.personalTraits === 'string'
      ? JSON.parse(user.domesticProfile.personalTraits)
      : [];

  const languages = Array.isArray(user.domesticProfile?.languages)
    ? user.domesticProfile.languages
    : typeof user.domesticProfile?.languages === 'string'
      ? JSON.parse(user.domesticProfile.languages)
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br slate-950">
      <Header user={user} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
          {/* Header with Photo */}
          <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center relative">
            <div className="absolute -bottom-16 left-8">
              <Avatar name={user.name} photoUrl={user.photoUrl} size="xl" className="!border-4 !border-white/50" />
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            {/* Profile Info */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                    {isDomestic && user.domesticProfile?.isApproved && (
                      <span className="bg-green-600/50 text-green-100 px-3 py-1 rounded-full text-sm font-semibold">✓ Validada</span>
                    )}
                    {isDomestic && !user.domesticProfile?.isApproved && (
                      <span className="bg-yellow-600/50 text-yellow-100 px-3 py-1 rounded-full text-sm font-semibold">⏳ Pendiente de validación</span>
                    )}
                  </div>
                  <p className="text-white/60 text-lg">{user.email}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition"
                  >
                    🔐 Cambiar Contraseña
                  </button>
                  {isDomestic && (
                    <Link
                      href="/profile/setup?mode=edit"
                      className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition inline-block"
                    >
                      ✏️ Editar Perfil
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>
              <div className="space-y-2">
                {user.phone && (
                  <p className="text-white/80">
                    <span className="text-white/60">Teléfono:</span> {user.phone}
                  </p>
                )}
                {user.address && (
                  <p className="text-white/80">
                    <span className="text-white/60">Dirección:</span> {user.address}
                  </p>
                )}
                {user.zone && (
                  <p className="text-white/80">
                    <span className="text-white/60">Zona:</span> {formatZone(user.zone)}
                  </p>
                )}
              </div>
            </div>

            {/* Domestic Profile */}
            {isDomestic && user.domesticProfile && (
              <>
                {user.domesticProfile.description && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Descripción</h3>
                    <p className="text-white/80 leading-relaxed">{user.domesticProfile.description}</p>
                  </div>
                )}

                {/* Skills */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Servicios</h3>
                  <div className="flex flex-wrap gap-3">
                    {user.domesticProfile.skills.map((skill) => (
                      <span
                        key={skill.skillType}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg"
                      >
                        {skill.skillType === 'CLEANING' && 'Limpieza'}
                        {skill.skillType === 'NANNY' && 'Niñera'}
                        {skill.skillType === 'COOKING' && 'Cocina'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tarifa */}
                {user.domesticProfile.hourlyRate && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 mb-8">
                    <p className="text-white/60 text-sm mb-2">Tarifa por hora</p>
                    <p className="text-3xl font-bold text-green-300">${user.domesticProfile.hourlyRate}/hora</p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {personalTraits.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-2">Cualidades</p>
                      <p className="text-white font-semibold">{personalTraits.join(', ')}</p>
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white/60 text-sm mb-2">Idiomas</p>
                      <p className="text-white font-semibold">{languages.join(', ')}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}
