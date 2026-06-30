"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, ShieldCheck, Star, Sparkles } from "lucide-react"

const trustBadges = [
  { icon: ShieldCheck, label: "Perfiles verificados" },
  { icon: Star, label: "Referencias reales" },
  { icon: Sparkles, label: "Búsqueda con IA" },
]

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
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
      setIsLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            Hecho en Argentina
          </span>

          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Encontrá personal doméstico de confianza
          </h1>

          <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            Conectamos a familias de todo el país con profesionales de limpieza,
            cuidado y cocina. Buscá con lenguaje natural y contratá con tranquilidad.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:rounded-full sm:p-2"
          >
            <div className="flex flex-1 items-center gap-2 px-2">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="hero-search" className="sr-only">
                Describí lo que necesitás
              </label>
              <input
                id="hero-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describí lo que necesitás..."
                className="w-full bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
          </form>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-xl">
            <Image
              src="/images/hero-professional.png"
              alt="Profesional de servicios domésticos sonriendo en un hogar luminoso"
              width={720}
              height={820}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">+4.800 perfiles</p>
                <p className="text-xs text-muted-foreground">verificados en el país</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
