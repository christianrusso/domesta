'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogoWithText } from '@/components/Logo';
import { argentinianProvinces, localitiesByProvince, languageOptions, nannyAgeGroups, personalTraitOptions } from '@/lib/argentina-zones';

type Step = 'role' | 'basics' | 'location' | 'age' | 'services' | 'experience' | 'tariff' | 'availability' | 'days' | 'languages' | 'traits' | 'presentation' | 'photo' | 'verification';

interface FormState {
  // Básico
  role: 'client' | 'domestic' | '';
  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Ubicación
  province: string;
  locality: string;
  address: string;

  // Personal
  gender: string;
  birthDate: string;

  // Para personal doméstico
  services: string[];

  // Experiencia (años)
  experience: string;

  // Tarifa
  hourlyRate: string;
  isNegotiable: boolean;

  // Disponibilidad
  availabilityTypes: string[];

  // Días
  availability: Record<string, string[]>;

  // Idiomas
  languages: string[];

  // Características
  personalTraits: string[];

  // Presentación
  description: string;

  // Foto
  photoUrl: string;

  // Específico NANNY
  nannyAgesHandled: string[];
  nannyMaxChildren: string;

  // Específico CLEANING
  cleaningType: string;

  // Específico COOKING
  cookingType: string;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HOURS = ['Mañana', 'Tarde', 'Noche'];

const getSteps = (role: 'client' | 'domestic' | ''): Step[] => {
  if (role === 'client') {
    return ['role', 'basics', 'location', 'verification'];
  }
  if (role === 'domestic') {
    return ['role', 'basics', 'location', 'age', 'services', 'experience', 'tariff', 'availability', 'days', 'languages', 'traits', 'presentation', 'photo', 'verification'];
  }
  return ['role'];
};

export default function RegisterWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') || '') as 'client' | 'domestic' | '';

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateAge = (dateString: string): boolean => {
    if (!dateString) return false;
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const [form, setForm] = useState<FormState>({
    role: initialRole,
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    province: '',
    locality: '',
    address: '',
    gender: '',
    birthDate: '',
    services: [],
    experience: '',
    hourlyRate: '',
    isNegotiable: true,
    availabilityTypes: [],
    availability: {
      Lunes: [],
      Martes: [],
      Miércoles: [],
      Jueves: [],
      Viernes: [],
      Sábado: [],
      Domingo: [],
    },
    languages: [],
    personalTraits: [],
    description: '',
    photoUrl: '',
    nannyAgesHandled: [],
    nannyMaxChildren: '',
    cleaningType: '',
    cookingType: '',
  });

  const STEPS = getSteps(form.role);
  const currentStepKey = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const availableLocalities = selectedProvince ? localitiesByProvince[selectedProvince] || [] : [];

  const toggleService = (service: string) => {
    setForm({
      ...form,
      services: form.services.includes(service)
        ? form.services.filter((s) => s !== service)
        : [...form.services, service],
    });
  };

  const toggleAvailabilityType = (type: string) => {
    setForm({
      ...form,
      availabilityTypes: form.availabilityTypes.includes(type)
        ? form.availabilityTypes.filter((t) => t !== type)
        : [...form.availabilityTypes, type],
    });
  };

  const toggleTrait = (trait: string) => {
    setForm({
      ...form,
      personalTraits: form.personalTraits.includes(trait)
        ? form.personalTraits.filter((t) => t !== trait)
        : [...form.personalTraits, trait],
    });
  };

  const toggleLanguage = (lang: string) => {
    setForm({
      ...form,
      languages: form.languages.includes(lang)
        ? form.languages.filter((l) => l !== lang)
        : [...form.languages, lang],
    });
  };

  const toggleDay = (day: string, hour: string) => {
    const daySchedule = form.availability[day] || [];
    setForm({
      ...form,
      availability: {
        ...form.availability,
        [day]: daySchedule.includes(hour)
          ? daySchedule.filter((h) => h !== hour)
          : [...daySchedule, hour],
      },
    });
  };

  const toggleNannyAge = (age: string) => {
    setForm({
      ...form,
      nannyAgesHandled: form.nannyAgesHandled.includes(age)
        ? form.nannyAgesHandled.filter((a) => a !== age)
        : [...form.nannyAgesHandled, age],
    });
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep = (): Record<string, string> => {
    switch (currentStepKey) {
      case 'basics': {
        const errors: Record<string, string> = {};
        if (!form.name) errors.name = 'Campo requerido';
        if (!form.email) {
          errors.email = 'Campo requerido';
        } else if (!isValidEmail(form.email)) {
          errors.email = 'Email inválido';
        }
        if (!form.password) errors.password = 'Campo requerido';
        if (!form.confirmPassword) errors.confirmPassword = 'Campo requerido';
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        }
        return errors;
      }
      case 'age': {
        const errors: Record<string, string> = {};
        if (!form.gender) errors.gender = 'Selecciona un género';
        if (!form.birthDate) {
          errors.birthDate = 'Selecciona tu fecha de nacimiento';
        } else if (!validateAge(form.birthDate)) {
          errors.birthDate = 'Debes ser mayor de 18 años';
        }
        return errors;
      }
      default:
        return {};
    }
  };

  const canProceed = (): boolean => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) return false;

    switch (currentStepKey) {
      case 'role':
        return form.role !== '';
      case 'basics':
        return true;
      case 'location':
        return form.province && form.locality && form.address;
      case 'age':
        return true;
      case 'services':
        return form.role === 'client' || form.services.length > 0;
      case 'experience':
        return form.role === 'client' || form.experience;
      case 'tariff':
        return form.role === 'client' || form.hourlyRate;
      case 'availability':
        return form.role === 'client' || form.availabilityTypes.length > 0;
      case 'days':
        return form.role === 'client' || Object.values(form.availability).some((hours) => hours.length > 0);
      case 'languages':
      case 'traits':
      case 'presentation':
      case 'photo':
      case 'verification':
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Validar disponibilidad de email en el paso 'basics'
    if (currentStepKey === 'basics') {
      try {
        const res = await fetch('/api/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email }),
        });
        const data = await res.json();
        if (!res.ok || !data.available) {
          setFieldErrors({ email: 'Este email ya está registrado' });
          return;
        }
      } catch (err) {
        console.error('Error checking email:', err);
      }
    }

    if (canProceed() && currentStep < STEPS.length - 1) {
      setFieldErrors({});
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limitar tamaño: máx 5MB
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors({ photoUrl: 'La foto no debe superar 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Comprimir imagen a máx 400x400 con calidad 80%
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > 400) {
              height *= 400 / width;
              width = 400;
            }
          } else {
            if (height > 400) {
              width *= 400 / height;
              height = 400;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convertir a JPEG al 80% de calidad
          const compressed = canvas.toDataURL('image/jpeg', 0.8);
          setForm({ ...form, photoUrl: compressed });
          setFieldErrors({});
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const registerData = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: '', // TODO: agregar campo de teléfono
        address: form.address,
        zone: `${form.locality}, ${form.province}`,
        photoUrl: form.photoUrl || null,
        role: form.role === 'domestic' ? 'DOMESTIC' : 'CLIENT',
        ...(form.role === 'domestic' && {
          personalTraits: form.personalTraits,
          languages: form.languages,
          hourlyRate: parseInt(form.hourlyRate),
          isNegotiable: form.isNegotiable,
          skills: form.services,
          experience: form.experience,
          availabilityTypes: form.availabilityTypes,
          nannyDescription: form.description,
          nannyAgesHandled: form.nannyAgesHandled,
          nannyMaxChildren: form.nannyMaxChildren ? parseInt(form.nannyMaxChildren) : null,
          cleaningType: form.cleaningType,
          cleaningDetails: form.description, // usando description como placeholder
          cookingType: form.cookingType,
          cookingDetails: form.description, // usando description como placeholder
        }),
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error en el registro');
        return;
      }

      localStorage.setItem('token', data.token);
      if (form.role === 'domestic') {
        router.push('/profile');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br slate-950 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><LogoWithText /></Link>
          <div className="text-sm text-white/60">Paso {currentStep + 1} de {STEPS.length}</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {error && (
            <div className="rounded-md bg-red-500/20 border border-red-500/50 p-4 mb-6">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* PASO 1: Rol */}
          {currentStepKey === 'role' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¿Quién eres?</h2><p className="text-white/60 mt-2">Selecciona cómo quieres usar Domesta</p></div>
              <div className="space-y-3">
                <button onClick={() => setForm({ ...form, role: 'client' })} className={`w-full p-6 rounded-2xl border-2 transition ${form.role === 'client' ? 'border-purple-600 bg-purple-600/20' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}><div className="text-2xl mb-2">🏠</div><div className="font-semibold text-white">Cliente</div><div className="text-sm text-white/60">Busco personal doméstico</div></button>
                <button onClick={() => setForm({ ...form, role: 'domestic' })} className={`w-full p-6 rounded-2xl border-2 transition ${form.role === 'domestic' ? 'border-purple-600 bg-purple-600/20' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}><div className="text-2xl mb-2">💼</div><div className="font-semibold text-white">Personal Doméstico</div><div className="text-sm text-white/60">Ofrezco servicios de limpieza, niñera o cocina</div></button>
              </div>
            </div>
          )}

          {/* PASO 2: Básicos */}
          {currentStepKey === 'basics' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">Cuéntanos sobre ti</h2><p className="text-white/60 mt-2">Información básica</p></div>
              <div className="space-y-4">
                <div>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre completo" className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.name ? 'border-red-500/50 bg-red-500/10' : 'border-white/20 bg-white/10'} text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50`} />
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-400">⚠️ {fieldErrors.name}</p>}
                </div>
                <div>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.email ? 'border-red-500/50 bg-red-500/10' : 'border-white/20 bg-white/10'} text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50`} />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-400">⚠️ {fieldErrors.email}</p>}
                </div>
                <div>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contraseña" className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.password ? 'border-red-500/50 bg-red-500/10' : 'border-white/20 bg-white/10'} text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50`} />
                  {fieldErrors.password && <p className="mt-1 text-xs text-red-400">⚠️ {fieldErrors.password}</p>}
                </div>
                <div>
                  <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirmar contraseña" className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.confirmPassword ? 'border-red-500/50 bg-red-500/10' : 'border-white/20 bg-white/10'} text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50`} />
                  {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-400">⚠️ {fieldErrors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Ubicación */}
          {currentStepKey === 'location' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¿Dónde vivís?</h2><p className="text-white/60 mt-2">Para mostrarte las mejores opciones en tu zona</p></div>
              <div className="space-y-4">
                <select value={form.province} onChange={(e) => { setForm({ ...form, province: e.target.value, locality: '' }); setSelectedProvince(e.target.value); }} className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"><option value="">Selecciona provincia</option>{argentinianProvinces.map((p) => (<option key={p.value} value={p.value} className="bg-slate-900">{p.label}</option>))}</select>
                {form.province && (<select value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"><option value="">Selecciona localidad</option>{availableLocalities.map((l) => (<option key={l.value} value={l.value} className="bg-slate-900">{l.label}</option>))}</select>)}
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Calle y número" className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
            </div>
          )}

          {/* PASO 4: Edad y Género */}
          {currentStepKey === 'age' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">Datos personales</h2><p className="text-white/60 mt-2">Género y fecha de nacimiento</p></div>
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-3">¿Cuál es tu género?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setForm({ ...form, gender: 'F' })} className={`p-6 rounded-xl border-2 transition flex flex-col items-center gap-2 ${form.gender === 'F' ? 'border-purple-600 bg-purple-600/20' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}><div className="text-4xl">👩</div><div className="font-semibold text-white">Femenino</div></button>
                    <button onClick={() => setForm({ ...form, gender: 'M' })} className={`p-6 rounded-xl border-2 transition flex flex-col items-center gap-2 ${form.gender === 'M' ? 'border-purple-600 bg-purple-600/20' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}><div className="text-4xl">👨</div><div className="font-semibold text-white">Masculino</div></button>
                  </div>
                  {fieldErrors.gender && <p className="mt-2 text-xs text-red-400">⚠️ {fieldErrors.gender}</p>}
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">Fecha de nacimiento</label>
                  <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.birthDate ? 'border-red-500/50 bg-red-500/10' : 'border-white/20 bg-white/10'} text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50`} />
                  {fieldErrors.birthDate && <p className="mt-2 text-xs text-red-400">⚠️ {fieldErrors.birthDate}</p>}
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: Servicios (solo para domestic) */}
          {currentStepKey === 'services' && form.role === 'domestic' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¿Qué servicios ofreces?</h2><p className="text-white/60 mt-2">Selecciona uno o varios</p></div>
              <div className="space-y-3">
                {[{ value: 'NANNY', label: '🍼 Niñera', desc: 'Cuidado de niños' }, { value: 'CLEANING', label: '🧹 Limpieza', desc: 'Tareas de limpieza' }, { value: 'COOKING', label: '👨‍🍳 Cocina', desc: 'Preparación de comidas' }].map((s) => (<button key={s.value} onClick={() => toggleService(s.value)} className={`w-full p-4 rounded-lg border-2 transition text-left ${form.services.includes(s.value) ? 'border-purple-600 bg-purple-600/20' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}><div className="font-semibold text-white">{s.label}</div><div className="text-sm text-white/60">{s.desc}</div></button>))}</div>
            </div>
          )}

          {/* PASO 6: Experiencia (solo para domestic) */}
          {currentStepKey === 'experience' && form.role === 'domestic' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¿Cuánta experiencia tienes?</h2><p className="text-white/60 mt-2">En los servicios que ofreces</p></div>
              <div className="space-y-3">
                {['Sin experiencia', '1 año', '2 años', '3 años', '4 años', '5 años', 'Más de 5 años'].map((e) => (<button key={e} onClick={() => setForm({ ...form, experience: e })} className={`w-full p-4 rounded-lg border-2 transition ${form.experience === e ? 'border-purple-600 bg-purple-600/20' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}><div className="font-semibold text-white">{e}</div></button>))}</div>
            </div>
          )}

          {/* PASO 7: Tarifa (solo para domestic) */}
          {currentStepKey === 'tariff' && form.role === 'domestic' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¿Cuál es tu tarifa por hora?</h2><p className="text-white/60 mt-2">En pesos argentinos</p></div>
              <div className="space-y-4">
                <input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} placeholder="Ej: 1500" className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-white/20 bg-white/5 hover:bg-white/10 rounded-lg transition"><input type="checkbox" checked={form.isNegotiable} onChange={(e) => setForm({ ...form, isNegotiable: e.target.checked })} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm text-white">El precio es negociable</span></label>
              </div>
            </div>
          )}

          {/* PASO 8: Tipo de disponibilidad (solo para domestic) */}
          {currentStepKey === 'availability' && form.role === 'domestic' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¿Cuándo estás disponible?</h2><p className="text-white/60 mt-2">Puedes seleccionar una o ambas opciones</p></div>
              <div className="space-y-3">
                <button onClick={() => toggleAvailabilityType('regular')} className={`w-full p-4 rounded-lg border-2 transition text-left ${form.availabilityTypes.includes('regular') ? 'border-purple-600 bg-purple-600/20' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}><div className="font-semibold text-white">✓ Horario regular</div><div className="text-sm text-white/60">Los mismos días y horas cada semana</div></button>
                <button onClick={() => toggleAvailabilityType('occasional')} className={`w-full p-4 rounded-lg border-2 transition text-left ${form.availabilityTypes.includes('occasional') ? 'border-purple-600 bg-purple-600/20' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}><div className="font-semibold text-white">✓ Ocasionalmente</div><div className="text-sm text-white/60">Solo algunos días o por encargo</div></button>
              </div>
            </div>
          )}

          {/* PASO 9: Días de la semana (solo para domestic) */}
          {currentStepKey === 'days' && form.role === 'domestic' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¿En qué días estás disponible?</h2><p className="text-white/60 mt-2">Selecciona días y turnos</p></div>
              <div className="space-y-2">
                {DAYS.map((day) => (
                  <div key={day} className="flex items-center gap-3 p-3 border border-white/20 bg-white/5 rounded-lg">
                    <span className="text-white font-medium min-w-24">{day}</span>
                    <div className="flex gap-2">
                      {HOURS.map((hour) => (
                        <button key={hour} onClick={() => toggleDay(day, hour)} className={`px-3 py-1 rounded-full text-sm transition ${form.availability[day]?.includes(hour) ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>{hour}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 10: Idiomas */}
          {currentStepKey === 'languages' && form.role === 'domestic' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¿Qué idiomas hablas?</h2><p className="text-white/60 mt-2">Opcional: agrega idiomas adicionales</p></div>
              <div className="space-y-3">
                {languageOptions.map((lang) => (
                  <button key={lang.value} onClick={() => toggleLanguage(lang.value)} className={`w-full p-3 rounded-lg border-2 transition text-left ${form.languages.includes(lang.value) ? 'border-purple-600 bg-purple-600/20' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}><span className="font-semibold text-white">{lang.label}</span></button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 11: Características */}
          {currentStepKey === 'traits' && form.role === 'domestic' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¿Cómo te describirías?</h2><p className="text-white/60 mt-2">Selecciona tus características</p></div>
              <div className="grid grid-cols-2 gap-2">
                {personalTraitOptions.map((trait) => (
                  <button key={trait} onClick={() => toggleTrait(trait)} className={`p-2 rounded-lg border transition text-sm font-medium ${form.personalTraits.includes(trait) ? 'border-purple-600 bg-purple-600/20 text-white' : 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10'}`}>{trait}</button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 12: Presentación */}
          {currentStepKey === 'presentation' && form.role === 'domestic' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">Cuéntales sobre ti</h2><p className="text-white/60 mt-2">Una breve presentación para que los clientes te conozcan</p></div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="¡Hola! Soy una persona responsable con experiencia en..." rows={5} className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>
          )}

          {/* PASO 13: Foto */}
          {currentStepKey === 'photo' && form.role === 'domestic' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">Sube una foto</h2><p className="text-white/60 mt-2">Una foto de perfil clara y profesional</p></div>
              <div className="border-2 border-dashed border-purple-600/50 rounded-2xl p-8 text-center">
                {form.photoUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <img src={form.photoUrl} alt="Preview" className="w-32 h-32 rounded-lg object-cover" />
                    <button onClick={() => document.getElementById('photo-input')?.click()} className="text-purple-300 hover:text-purple-200 font-semibold">Cambiar foto</button>
                  </div>
                ) : (
                  <button onClick={() => document.getElementById('photo-input')?.click()} className="flex flex-col items-center gap-3 w-full">
                    <div className="text-4xl">📸</div>
                    <div className="text-white font-semibold">Selecciona una foto</div>
                    <div className="text-sm text-white/60">JPG, PNG (máx 5MB)</div>
                  </button>
                )}
                <input id="photo-input" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>
            </div>
          )}

          {/* PASO 14: Verificación de email */}
          {currentStepKey === 'verification' && (
            <div className="space-y-6">
              <div><h2 className="text-3xl font-bold text-white">¡Casi listo!</h2><p className="text-white/60 mt-2">Verifica tu email para completar el registro</p></div>
              <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <p className="text-white/80 text-center">Un enlace de verificación se enviará a:</p>
                <p className="text-white font-semibold text-center mt-2">{form.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-12">
            <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition">Atrás</button>
            {currentStep === STEPS.length - 1 ? (
              <button onClick={handleSubmit} disabled={loading} className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition">{loading ? 'Registrando...' : 'Completar Registro'}</button>
            ) : (
              <button onClick={handleNext} className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">Siguiente</button>
            )}
          </div>

          {/* Link to login */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">¿Ya tienes cuenta? <Link href="/auth/login" className="text-purple-300 hover:text-purple-200 font-semibold transition">Inicia sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
