"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Services } from "@/components/services"
import { TrustSection } from "@/components/trust-section"
import { CtaBanner } from "@/components/cta-banner"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { formatZone } from "@/lib/utils"
import { Avatar } from "@/components/Avatar"

export default function Page() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (isLoggedIn) {
    return <DashboardView />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Services />
        <TrustSection />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  )
}

function DashboardView() {
  const router = useRouter()
  const [allProfiles, setAllProfiles] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [recommendedProfiles, setRecommendedProfiles] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    fetchData(token)
  }, [])

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      })

      if (!response.ok) throw new Error('Error en la búsqueda')

      const { filters } = await response.json()

      // Guardar filtros en sessionStorage para que /search los use
      sessionStorage.setItem('aiFilters', JSON.stringify(filters))

      // Redirigir a /search con leyenda
      router.push('/search?aiPowered=true')
    } catch (error) {
      console.error('Search error:', error)
      alert('Error al procesar la búsqueda')
    } finally {
      setIsSearching(false)
    }
  }

  const fetchData = async (token: string) => {
    try {
      const userRes = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const userData = await userRes.json()
      setUser(userData)

      const profilesRes = await fetch("/api/profiles?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const profilesData = await profilesRes.json()
      const allProfilesData = profilesData.profiles || []
      setAllProfiles(allProfilesData)
      setProfiles(allProfilesData)

      if (allProfilesData && allProfilesData.length > 0) {
        const clientProvince = userData?.zone?.split(",")[1]?.trim() || ""
        const scoredProfiles = allProfilesData.map((p: any) => {
          const employeeProvince = p.user?.zone?.split(",")[1]?.trim() || ""
          let score = 0
          if (clientProvince && employeeProvince && clientProvince === employeeProvince) {
            score += 100
          }
          if (p.hourlyRate && p.hourlyRate < 5000) {
            score += 10
          }
          return { ...p, _score: score }
        })

        const recommended = scoredProfiles
          .sort((a: any, b: any) => b._score - a._score)
          .slice(0, 5)
          .map((p: any) => {
            const { _score, ...rest } = p
            return rest
          })

        setRecommendedProfiles(recommended.length > 0 ? recommended : allProfilesData.slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              Domesta
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/inbox" className="text-white/70 hover:text-white transition text-sm">
                Mensajes
              </Link>
              <Link href="/profile" className="text-white/70 hover:text-white transition text-sm">
                Mi Perfil
              </Link>
              <span className="text-sm text-white/70">Hola, {user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-8">Encuentra personal doméstico</h2>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8">
            <label className="block text-white/80 mb-4 text-lg">¿Qué servicio buscas?</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe lo que necesitas..."
              disabled={isSearching}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 disabled:opacity-50"
            />
            <div className="flex gap-4">
              <button
                onClick={handleAISearch}
                disabled={isSearching}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
              >
                {isSearching ? 'Buscando...' : 'Buscar con IA'}
              </button>
              <Link
                href="/search"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition border border-white/20 text-center"
              >
                🔍 Búsqueda Avanzada
              </Link>
            </div>
          </div>
        </div>

        {recommendedProfiles.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">⭐ Las mejores para tu zona</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProfiles.slice(0, 4).map((profile) => (
                <Link
                  key={profile.id}
                  href={`/profile/${profile.id}`}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:border-purple-500/50 hover:bg-white/20 transition"
                >
                  <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center p-4">
                    <Avatar name={profile.user.name} photoUrl={profile.user.photoUrl} size="xl" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-white text-lg">{profile.user.name}</h4>
                    <p className="text-white/60 text-sm mb-3">📍 {formatZone(profile.user.zone)}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.skills.map((skill: any) => (
                        <span key={skill.skillType} className="text-xs bg-purple-600/50 text-purple-100 px-3 py-1 rounded-full">
                          {skill.skillType === "NANNY" && "Niñera"}
                          {skill.skillType === "CLEANING" && "Limpieza"}
                          {skill.skillType === "COOKING" && "Cocina"}
                        </span>
                      ))}
                    </div>
                    <p className="text-purple-300 font-semibold">${profile.hourlyRate}/hora</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
