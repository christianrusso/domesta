'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogoWithText } from '@/components/Logo';
import { argentinianProvinces } from '@/lib/argentina-zones';
import { formatZone } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';

interface DomesticProfile {
  id: string;
  user: {
    name: string;
    photoUrl: string | null;
    zone: string | null;
  };
  hourlyRate: number | null;
  skills: Array<{ skillType: string }>;
  description: string | null;
}

export default function SearchPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [allProfiles, setAllProfiles] = useState<DomesticProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<DomesticProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [searchText, setSearchText] = useState('');
  // Filtros adicionales
  const [hasLicense, setHasLicense] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [ownCar, setOwnCar] = useState(false);
  const [doesSmoke, setDoesSmoke] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);
  const [cprCertified, setCprCertified] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const skillOptions = [
    { value: 'NANNY', label: 'Niñera' },
    { value: 'CLEANING', label: 'Limpieza' },
    { value: 'COOKING', label: 'Cocina' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      const userRes = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUser(userData);

      const profilesRes = await fetch('/api/profiles?limit=1000', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profilesData = await profilesRes.json();
      const profiles = profilesData.profiles || [];
      setAllProfiles(profiles);
      setFilteredProfiles(profiles);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = allProfiles;

    if (searchText) {
      filtered = filtered.filter((p) =>
        p.user.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((p) =>
        selectedSkills.some((skill) =>
          p.skills.some((s) => s.skillType === skill)
        )
      );
    }

    if (selectedProvince) {
      filtered = filtered.filter((p) => {
        const zoneParts = p.user.zone?.split(',') || [];
        return zoneParts.length === 2 && zoneParts[1].trim() === selectedProvince;
      });
    }

    if (minRate) {
      filtered = filtered.filter((p) => (p.hourlyRate || 0) >= parseInt(minRate));
    }

    if (maxRate) {
      filtered = filtered.filter((p) => (p.hourlyRate || 0) <= parseInt(maxRate));
    }

    if (hasLicense) {
      filtered = filtered.filter((p) => p.hasLicense);
    }

    if (petFriendly) {
      filtered = filtered.filter((p) => p.petFriendly);
    }

    if (ownCar) {
      filtered = filtered.filter((p) => p.ownCar);
    }

    if (doesSmoke) {
      filtered = filtered.filter((p) => !p.doesSmoke);
    }

    if (vaccinated) {
      filtered = filtered.filter((p) => p.vaccinated);
    }

    if (cprCertified) {
      filtered = filtered.filter((p) => p.cprCertified);
    }

    if (isNegotiable) {
      filtered = filtered.filter((p) => p.isNegotiable);
    }

    // Ordenamiento
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
    } else {
      filtered.sort((a, b) => a.user.name.localeCompare(b.user.name));
    }

    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedSkills([]);
    setSelectedProvince('');
    setMinRate('');
    setMaxRate('');
    setSearchText('');
    setHasLicense(false);
    setPetFriendly(false);
    setOwnCar(false);
    setDoesSmoke(false);
    setVaccinated(false);
    setCprCertified(false);
    setIsNegotiable(false);
    setSortBy('name');
    setCurrentPage(1);
    setFilteredProfiles(allProfiles);
  };

  const toggleSkill = (skill: string) => {
    const updated = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br slate-950">
      {/* Header */}
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <LogoWithText />
          </Link>
          <div className="flex gap-6">
            <Link href="/inbox" className="text-white/70 hover:text-white transition">Mensajes</Link>
            <Link href="/profile" className="text-white/70 hover:text-white transition">Mi Perfil</Link>
            <span className="text-sm text-white/70">{user?.name}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Sidebar de Filtros */}
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 sticky top-20">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Filtrar por:</h3>

              {/* Búsqueda */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm">Nombre</label>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              {/* Servicios */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm">Servicios</label>
                <div className="space-y-2">
                  {skillOptions.map((skill) => (
                    <label key={skill.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill.value)}
                        onChange={() => toggleSkill(skill.value)}
                        className="w-4 h-4 rounded accent-purple-600"
                      />
                      <span className="text-white text-sm">{skill.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Provincia */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm">Provincia</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Todas</option>
                  {argentinianProvinces.map((prov) => (
                    <option key={prov.value} value={prov.value}>
                      {prov.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarifa */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm">Tarifa ($/h)</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-white/60 text-xs mb-1 block">Desde</label>
                      <input
                        type="number"
                        value={minRate}
                        onChange={(e) => setMinRate(e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-white/60 text-xs mb-1 block">Hasta</label>
                      <input
                        type="number"
                        value={maxRate}
                        onChange={(e) => setMaxRate(e.target.value)}
                        placeholder="10000"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="h-2 bg-white/20 rounded-full relative">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                        style={{
                          width: `${minRate ? Math.min(100, (parseInt(minRate) / 10000) * 100) : 0}%`
                        }}
                      ></div>
                    </div>
                    {minRate || maxRate ? (
                      <p className="text-purple-300 text-sm mt-2 text-center font-semibold">
                        ${minRate || '0'} - ${maxRate || '∞'}
                      </p>
                    ) : (
                      <p className="text-white/60 text-xs mt-2 text-center">Cualquier precio</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Características */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm">Características</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasLicense}
                      onChange={(e) => setHasLicense(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-white text-sm">Con licencia</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={petFriendly}
                      onChange={(e) => setPetFriendly(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-white text-sm">Amigable con mascotas</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ownCar}
                      onChange={(e) => setOwnCar(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-white text-sm">Tiene auto</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!doesSmoke}
                      onChange={(e) => setDoesSmoke(!e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-white text-sm">No fuma</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vaccinated}
                      onChange={(e) => setVaccinated(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-white text-sm">Vacunada</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cprCertified}
                      onChange={(e) => setCprCertified(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-white text-sm">CPR Certificada</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-white text-sm">Precio negociable</span>
                  </label>
                </div>
              </div>

              {/* Ordenamiento */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="name">Nombre (A-Z)</option>
                  <option value="price-asc">Precio menor a mayor</option>
                  <option value="price-desc">Precio mayor a menor</option>
                </select>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold text-sm sm:text-base rounded-lg transition"
                >
                  Aplicar
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold text-sm sm:text-base rounded-lg transition"
                >
                  Limpiar
                </button>
              </div>

              <p className="text-xs text-white/60 mt-3 sm:mt-4">{filteredProfiles.length} resultados</p>
            </div>
          </div>

          {/* Lista de Niñeras */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="space-y-4">
              {filteredProfiles.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
                  <p className="text-white/70 text-lg">No se encontraron niñeras con estos criterios</p>
                </div>
              ) : (
                <>
                  {filteredProfiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/profile/${profile.id}`}
                    className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:border-purple-500/50 hover:bg-white/20 transition p-4 flex gap-6"
                  >
                    {/* Foto */}
                    <div className="flex-shrink-0">
                      <Avatar name={profile.user.name} photoUrl={profile.user.photoUrl} size="lg" className="!rounded-lg" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition">
                          {profile.user.name}
                        </h4>
                        <p className="text-white/60 text-sm mb-3">📍 {formatZone(profile.user.zone)}</p>
                        {profile.description && (
                          <p className="text-white/70 text-sm mb-3 line-clamp-2">
                            {profile.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <span
                              key={skill.skillType}
                              className="text-xs bg-purple-600/50 text-purple-100 px-3 py-1 rounded-full"
                            >
                              {skill.skillType === 'NANNY' && '👶 Niñera'}
                              {skill.skillType === 'CLEANING' && '🧹 Limpieza'}
                              {skill.skillType === 'COOKING' && '👨‍🍳 Cocina'}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tarifa */}
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-2xl font-bold text-purple-300">
                          ${profile.hourlyRate}
                          <span className="text-sm text-white/60 font-normal">/hora</span>
                        </p>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="flex-shrink-0 flex items-end">
                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                        Ver perfil →
                      </button>
                    </div>
                  </Link>
                  ))}

                  {/* Paginación */}
                  {filteredProfiles.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
                      >
                        ← Anterior
                      </button>
                      <span className="text-white text-sm">
                        Página {currentPage} de {Math.ceil(filteredProfiles.length / itemsPerPage)}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(Math.ceil(filteredProfiles.length / itemsPerPage), currentPage + 1))}
                        disabled={currentPage === Math.ceil(filteredProfiles.length / itemsPerPage)}
                        className="px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-white/60 mt-4">Mostrando {Math.min(itemsPerPage, filteredProfiles.length - (currentPage - 1) * itemsPerPage)} de {filteredProfiles.length} resultados</p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
