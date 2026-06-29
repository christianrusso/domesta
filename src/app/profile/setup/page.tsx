'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogoWithText } from '@/components/Logo';
import { languageOptions, nannyAgeGroups, personalTraitOptions } from '@/lib/argentina-zones';

type SkillType = 'CLEANING' | 'NANNY' | 'COOKING';

interface ProfileData {
  description: string;
  personalTraits: string[];
  customTraits: string[];
  newCustomTrait: string;
  languages: string[];
  skills: SkillType[];
  photoUrl: string;
  hourlyRate: string;
  isNegotiable: boolean;
  hasLicense: boolean;
  ownCar: boolean;
  doesSmoke: boolean;
  petFriendly: boolean;
  vaccinated: boolean;
  cprCertified: boolean;
  nannyDescription?: string;
  nannyAgesHandled: string[];
  nannyMaxChildren?: string;
  nannyExperience?: string;
  cleaningType?: string;
  cleaningDetails?: string;
  cookingType?: string;
  cookingDetails?: string;
}

export default function ProfileSetupPage() {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileData>({
    description: '',
    personalTraits: [],
    customTraits: [],
    newCustomTrait: '',
    languages: [],
    skills: [],
    photoUrl: '',
    hourlyRate: '',
    isNegotiable: true,
    hasLicense: false,
    ownCar: false,
    doesSmoke: false,
    petFriendly: false,
    vaccinated: false,
    cprCertified: false,
    nannyAgesHandled: [],
  });

  const skillOptions = [
    { value: 'CLEANING' as SkillType, label: 'Limpieza' },
    { value: 'NANNY' as SkillType, label: 'Niñera' },
    { value: 'COOKING' as SkillType, label: 'Cocina' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchProfileData(token);
  }, [router]);

  const fetchProfileData = async (token: string) => {
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.domesticProfile?.skills?.length > 0) {
        setIsEditMode(true);
        const profile = data.domesticProfile;
        const personalTraits = Array.isArray(profile.personalTraits)
          ? profile.personalTraits
          : typeof profile.personalTraits === 'string'
            ? JSON.parse(profile.personalTraits)
            : [];
        const languages = Array.isArray(profile.languages)
          ? profile.languages
          : typeof profile.languages === 'string'
            ? JSON.parse(profile.languages)
            : [];

        setFormData({
          description: profile.description || '',
          personalTraits,
          customTraits: [],
          newCustomTrait: '',
          languages,
          hasLicense: profile.hasLicense || false,
          ownCar: profile.ownCar || false,
          doesSmoke: profile.doesSmoke || false,
          petFriendly: profile.petFriendly || false,
          vaccinated: profile.vaccinated || false,
          cprCertified: profile.cprCertified || false,
          hourlyRate: profile.hourlyRate?.toString() || '',
          isNegotiable: profile.isNegotiable ?? true,
          skills: profile.skills.map((s: any) => s.skillType) || [],
          photoUrl: data.photoUrl || '',
          nannyDescription: profile.nannyDescription || '',
          nannyAgesHandled: profile.nannyAgesHandled || [],
          nannyMaxChildren: profile.nannyMaxChildren?.toString() || '',
          nannyExperience: profile.nannyExperience || '',
          cleaningType: profile.cleaningType || '',
          cleaningDetails: profile.cleaningDetails || '',
          cookingType: profile.cookingType || '',
          cookingDetails: profile.cookingDetails || '',
        });
        if (data.photoUrl) setPhotoPreview(data.photoUrl);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const toggleSkill = (skill: SkillType) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter((s) => s !== skill)
        : [...formData.skills, skill],
    });
  };

  const toggleTrait = (trait: string) => {
    setFormData({
      ...formData,
      personalTraits: formData.personalTraits.includes(trait)
        ? formData.personalTraits.filter((t) => t !== trait)
        : [...formData.personalTraits, trait],
    });
  };

  const toggleLanguage = (lang: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.includes(lang)
        ? formData.languages.filter((l) => l !== lang)
        : [...formData.languages, lang],
    });
  };

  const toggleNannyAge = (age: string) => {
    setFormData({
      ...formData,
      nannyAgesHandled: formData.nannyAgesHandled.includes(age)
        ? formData.nannyAgesHandled.filter((a) => a !== age)
        : [...formData.nannyAgesHandled, age],
    });
  };

  const addCustomTrait = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.newCustomTrait.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        customTraits: [...formData.customTraits, formData.newCustomTrait.trim()],
        newCustomTrait: '',
      });
    }
  };

  const removeCustomTrait = (index: number) => {
    setFormData({
      ...formData,
      customTraits: formData.customTraits.filter((_, i) => i !== index),
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setFormData({ ...formData, photoUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.skills.length) {
      setError('Debes seleccionar al menos un servicio');
      return;
    }
    if (!formData.hourlyRate) {
      setError('La tarifa por hora es obligatoria');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const traits = [...formData.personalTraits, ...formData.customTraits];
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profiles/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: formData.description,
          personalTraits: traits,
          languages: formData.languages,
          hasLicense: formData.hasLicense,
          ownCar: formData.ownCar,
          doesSmoke: formData.doesSmoke,
          petFriendly: formData.petFriendly,
          vaccinated: formData.vaccinated,
          cprCertified: formData.cprCertified,
          hourlyRate: parseInt(formData.hourlyRate),
          isNegotiable: formData.isNegotiable,
          skills: formData.skills,
          photoUrl: formData.photoUrl,
          nannyDescription: formData.nannyDescription,
          nannyAgesHandled: formData.nannyAgesHandled,
          nannyMaxChildren: formData.nannyMaxChildren ? parseInt(formData.nannyMaxChildren) : null,
          nannyExperience: formData.nannyExperience,
          cleaningType: formData.cleaningType,
          cleaningDetails: formData.cleaningDetails,
          cookingType: formData.cookingType,
          cookingDetails: formData.cookingDetails,
        }),
      });

      if (!res.ok) throw new Error('Error saving profile');
      router.push('/profile');
    } catch (error) {
      setError('Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br slate-950 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto mb-8"><LogoWithText /></div>

      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 sm:p-12">
        <h1 className="text-4xl font-bold text-white mb-3">{isEditMode ? 'Editar tu perfil' : 'Completa tu perfil'}</h1>
        <p className="text-white/70 mb-8 text-lg">{isEditMode ? 'Actualiza tu información.' : 'Cuéntanos más sobre ti.'}</p>

        {error && <div className="rounded-md bg-red-500/20 border border-red-500/50 p-4 mb-6"><p className="text-sm text-red-200">{error}</p></div>}

        <div className="space-y-8">
          <div><h2 className="text-2xl font-bold text-white mb-4">📸 Foto de Perfil</h2><div className="flex gap-6"><div className="flex-1"><label className="block text-sm font-medium text-white mb-2">Selecciona una foto</label><input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full px-4 py-2 border border-white/20 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm" /><p className="text-xs text-white/60 mt-2">JPG, PNG (máx 5MB)</p></div>{photoPreview && <div className="flex items-center"><img src={photoPreview} alt="Preview" className="w-32 h-32 rounded-lg object-cover border border-white/20" /></div>}</div></div>

          <div><h2 className="text-2xl font-bold text-white mb-4">1. Cuéntanos sobre ti</h2><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="¡Hola! Soy una persona responsable..." rows={4} className="w-full px-4 py-3 border border-white/20 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm" /></div>

          <div><h2 className="text-2xl font-bold text-white mb-4">2. ¿Qué servicios ofreces?</h2><div className="space-y-3">{skillOptions.map((skill) => (<label key={skill.value} className="flex items-center gap-3 cursor-pointer p-4 border border-white/20 bg-white/5 hover:bg-white/10 rounded-lg transition"><input type="checkbox" checked={formData.skills.includes(skill.value)} onChange={() => toggleSkill(skill.value)} className="w-5 h-5 text-purple-600 rounded" /><span className="font-medium text-white text-lg">{skill.label}</span></label>))}</div></div>

          <div><h2 className="text-2xl font-bold text-white mb-4">3. Tarifa por hora *</h2><input type="number" value={formData.hourlyRate} onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })} placeholder="1500" className="w-full px-4 py-3 border border-white/20 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm mb-3" /><label className="flex items-center gap-3 cursor-pointer p-3 border border-white/20 bg-white/5 hover:bg-white/10 rounded-lg transition"><input type="checkbox" checked={formData.isNegotiable} onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm text-white">El precio es negociable</span></label></div>

          <div><h2 className="text-2xl font-bold text-white mb-4">4. Idiomas</h2><div className="space-y-2">{languageOptions.map((lang) => (<label key={lang.value} className="flex items-center gap-3 cursor-pointer p-3 border border-white/20 bg-white/5 hover:bg-white/10 rounded-lg transition"><input type="checkbox" checked={formData.languages.includes(lang.value)} onChange={() => toggleLanguage(lang.value)} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm text-white">{lang.label}</span></label>))}</div></div>

          <div><h2 className="text-2xl font-bold text-white mb-4">5. Características personales</h2><div className="grid grid-cols-2 gap-3 mb-4">{personalTraitOptions.map((trait) => (<label key={trait} className="flex items-center gap-3 cursor-pointer p-3 border border-white/20 bg-white/5 hover:bg-white/10 rounded-lg transition"><input type="checkbox" checked={formData.personalTraits.includes(trait)} onChange={() => toggleTrait(trait)} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm text-white">{trait}</span></label>))}</div><div><label className="block text-xs font-medium text-white/70 mb-2">O agrega características personalizadas (Enter para agregar)</label><input type="text" value={formData.newCustomTrait} onChange={(e) => setFormData({ ...formData, newCustomTrait: e.target.value })} onKeyDown={addCustomTrait} placeholder="Ej: Especialista en..." className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition backdrop-blur-sm text-sm" />{formData.customTraits.length > 0 && (<div className="mt-3 flex flex-wrap gap-2">{formData.customTraits.map((trait, i) => (<div key={i} className="bg-purple-600/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"><span>{trait}</span><button type="button" onClick={() => removeCustomTrait(i)} className="text-white/70 hover:text-white">✕</button></div>))}</div>)}</div></div>

          <div><h2 className="text-2xl font-bold text-white mb-4">6. Información general</h2><div className="space-y-2">{[{ field: 'hasLicense', label: 'Tengo licencia de conducir' }, { field: 'ownCar', label: 'Tengo auto propio' }, { field: 'doesSmoke', label: 'Fumo' }, { field: 'petFriendly', label: 'Soy amable con mascotas' }, { field: 'vaccinated', label: 'Estoy vacunada/o' }, { field: 'cprCertified', label: 'Tengo certificación RCP' }].map(({ field, label }) => (<label key={field} className="flex items-center gap-3 cursor-pointer p-3 border border-white/20 bg-white/5 hover:bg-white/10 rounded-lg transition"><input type="checkbox" checked={formData[field as keyof ProfileData] as boolean} onChange={() => setFormData({ ...formData, [field]: !formData[field as keyof ProfileData] })} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm text-white">{label}</span></label>))}</div></div>

          {formData.skills.includes('NANNY') && (<div><h2 className="text-2xl font-bold text-white mb-4">🍼 Información para Niñeras</h2><div className="mb-4"><label className="block text-sm font-medium text-white mb-2">Cuéntanos sobre tu experiencia con niños</label><textarea value={formData.nannyDescription || ''} onChange={(e) => setFormData({ ...formData, nannyDescription: e.target.value })} placeholder="Ej: Tengo 5 años cuidando niños..." rows={3} className="w-full px-4 py-3 border border-white/20 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm" /></div><div className="mb-4"><label className="block text-sm font-medium text-white mb-2">¿Qué edades puedes cuidar?</label><div className="space-y-2">{nannyAgeGroups.map((age) => (<label key={age.value} className="flex items-center gap-3 cursor-pointer p-3 border border-white/20 bg-white/5 hover:bg-white/10 rounded-lg transition"><input type="checkbox" checked={formData.nannyAgesHandled.includes(age.value)} onChange={() => toggleNannyAge(age.value)} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm text-white">{age.label}</span></label>))}</div></div><div className="mb-4"><label className="block text-sm font-medium text-white mb-2">¿Máximo de niños?</label><input type="number" min="1" value={formData.nannyMaxChildren || ''} onChange={(e) => setFormData({ ...formData, nannyMaxChildren: e.target.value })} placeholder="Ej: 3" className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition backdrop-blur-sm" /></div><div><label className="block text-sm font-medium text-white mb-2">¿Otras habilidades?</label><textarea value={formData.nannyExperience || ''} onChange={(e) => setFormData({ ...formData, nannyExperience: e.target.value })} placeholder="Ej: Puedo ayudar con tareas..." rows={2} className="w-full px-4 py-3 border border-white/20 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition backdrop-blur-sm" /></div></div>)}

          {formData.skills.includes('CLEANING') && (<div><h2 className="text-2xl font-bold text-white mb-4">🧹 Información para Limpieza</h2><div className="mb-4"><label className="block text-sm font-medium text-white mb-2">¿Qué tipo de limpieza ofreces?</label><select value={formData.cleaningType || ''} onChange={(e) => setFormData({ ...formData, cleaningType: e.target.value })} className="w-full px-4 py-3 border border-white/20 bg-white/10 rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"><option value="">Selecciona</option><option value="general">Limpieza general</option><option value="profunda">Limpieza profunda</option><option value="posobra">Limpieza post-obra</option><option value="varias">Varias de las anteriores</option></select></div><div><label className="block text-sm font-medium text-white mb-2">Detalles adicionales</label><textarea value={formData.cleaningDetails || ''} onChange={(e) => setFormData({ ...formData, cleaningDetails: e.target.value })} placeholder="Ej: Uso productos ecológicos..." rows={2} className="w-full px-4 py-3 border border-white/20 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition backdrop-blur-sm" /></div></div>)}

          {formData.skills.includes('COOKING') && (<div><h2 className="text-2xl font-bold text-white mb-4">👨‍🍳 Información para Cocina</h2><div className="mb-4"><label className="block text-sm font-medium text-white mb-2">¿Qué tipo de cocina ofreces?</label><select value={formData.cookingType || ''} onChange={(e) => setFormData({ ...formData, cookingType: e.target.value })} className="w-full px-4 py-3 border border-white/20 bg-white/10 rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"><option value="">Selecciona</option><option value="casera">Cocina casera</option><option value="eventos">Catering para eventos</option><option value="reposteria">Repostería</option><option value="varias">Varias de las anteriores</option></select></div><div><label className="block text-sm font-medium text-white mb-2">Detalles adicionales</label><textarea value={formData.cookingDetails || ''} onChange={(e) => setFormData({ ...formData, cookingDetails: e.target.value })} placeholder="Ej: Especializada en cocina saludable..." rows={2} className="w-full px-4 py-3 border border-white/20 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition backdrop-blur-sm" /></div></div>)}

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition">{loading ? (isEditMode ? 'Actualizando...' : 'Guardando...') : (isEditMode ? 'Actualizar perfil' : 'Guardar perfil')}</button>
        </div>
      </div>
    </div>
  );
}
