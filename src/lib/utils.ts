import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { argentinianProvinces, localitiesByProvince } from './argentina-zones'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatZone(zone: string | null | undefined): string {
  if (!zone) return '-'

  const parts = zone.split(',').map(p => p.trim())
  if (parts.length !== 2) return zone

  const [locality, province] = parts

  const provinceObj = argentinianProvinces.find(p => p.value === province)
  const provinceName = provinceObj?.label || province

  const localities = localitiesByProvince[province] || []
  const localityObj = localities.find(l => l.value === locality)
  const localityName = localityObj?.label || locality

  return `${localityName}, ${provinceName}`
}
