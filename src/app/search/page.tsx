'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
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
  availability?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
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
  const [showAILegend, setShowAILegend] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

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

    // Detectar si vienen filtros de IA
    const params = new URLSearchParams(window.location.search);
    const isAIPowered = params.get('aiPowered') === 'true';
    const aiFiltersStr = sessionStorage.getItem('aiFilters');

    if (isAIPowered && aiFiltersStr) {
      try {
        const aiFilters = JSON.parse(aiFiltersStr);
        setShowAILegend(true);

        // Aplicar filtros de IA
        if (aiFilters.skills && aiFilters.skills.length > 0) {
          setSelectedSkills(aiFilters.skills);
        }
        if (aiFilters.maxPrice) {
          setMaxRate(aiFilters.maxPrice.toString());
        }
        if (aiFilters.minPrice) {
          setMinRate(aiFilters.minPrice.toString());
        }
        if (aiFilters.province) {
          setSelectedProvince(aiFilters.province);
        }

        // Limpiar sessionStorage
        sessionStorage.removeItem('aiFilters');

        // Limpiar URL
        window.history.replaceState({}, document.title, '/search');
      } catch (error) {
        console.error('Error parsing AI filters:', error);
      }
    }
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
      // No establecer filteredProfiles aquí - dejar que el useEffect lo haga basado en los filtros
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros automáticamente cuando cambien
  useEffect(() => {
    if (allProfiles.length > 0) {
      applyFilters();
    } else if (allProfiles.length === 0 && selectedSkills.length === 0 && !selectedProvince) {
      // Si no hay perfiles cargados y no hay filtros, mostrar lista vacía
      setFilteredProfiles([]);
    }
  }, [allProfiles, selectedSkills, selectedProvince, minRate, maxRate, searchText, sortBy, hasLicense, petFriendly, ownCar, doesSmoke, vaccinated, cprCertified, isNegotiable, selectedDays]);

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
        if (!p.user.zone) return false;
        // Buscar si la provincia está en la zona (puede ser después de una coma)
        const zoneUpper = p.user.zone.toUpperCase();
        return zoneUpper.includes(selectedProvince.toUpperCase());
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

    if (selectedDays.length > 0) {
      filtered = filtered.filter((p) => {
        if (!p.availability || p.availability.length === 0) return false;
        return selectedDays.some((day) =>
          p.availability!.some((avail) => avail.dayOfWeek === day)
        );
      });
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
    setSelectedDays([]);
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
      <Header user={user} />

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
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-xs block mb-2">Mínimo: ${minRate || '0'}</label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={minRate || '0'}
                      onChange={(e) => setMinRate(e.target.value)}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      style={{
                        background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${((parseInt(minRate) || 0) / 10000) * 100}%, rgba(255,255,255,0.2) ${((parseInt(minRate) || 0) / 10000) * 100}%, rgba(255,255,255,0.2) 100%)`
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-white/60 text-xs block mb-2">Máximo: ${maxRate || '∞'}</label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={maxRate || '10000'}
                      onChange={(e) => setMaxRate(e.target.value)}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      style={{
                        background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${((parseInt(maxRate) || 10000) / 10000) * 100}%, rgba(255,255,255,0.2) ${((parseInt(maxRate) || 10000) / 10000) * 100}%, rgba(255,255,255,0.2) 100%)`
                      }}
                    />
                  </div>

                  <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-purple-500/50 rounded-lg p-3">
                    <p className="text-purple-300 text-sm text-center font-semibold">
                      ${minRate || '0'} - ${maxRate || '∞'} por hora
                    </p>
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

              {/* Días de Disponibilidad */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm">Días disponibles</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'Mon', label: 'Lunes' },
                    { value: 'Tue', label: 'Martes' },
                    { value: 'Wed', label: 'Miércoles' },
                    { value: 'Thu', label: 'Jueves' },
                    { value: 'Fri', label: 'Viernes' },
                    { value: 'Sat', label: 'Sábado' },
                    { value: 'Sun', label: 'Domingo' },
                  ].map((day) => (
                    <label key={day.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDays([...selectedDays, day.value]);
                          } else {
                            setSelectedDays(selectedDays.filter((d) => d !== day.value));
                          }
                        }}
                        className="w-4 h-4 rounded accent-purple-600"
                      />
                      <span className="text-white text-xs sm:text-sm">{day.label}</span>
                    </label>
                  ))}
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
            {showAILegend && (
              <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
                <p className="text-blue-300 text-sm flex items-center gap-2">
                  ✨ <span>Resultados generados por IA basados en tu búsqueda</span>
                </p>
              </div>
            )}
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
