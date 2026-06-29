import { Sparkles } from "lucide-react"
import Link from "next/link"

const columns = [
  {
    title: "Servicios",
    links: [
      { label: "Limpieza", href: "#" },
      { label: "Niñera", href: "#" },
      { label: "Cocina", href: "#" },
    ],
  },
  {
    title: "Domesta",
    links: [
      { label: "Cómo funciona", href: "#" },
      { label: "Confianza y seguridad", href: "#" },
      { label: "Sumate como personal", href: "#" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Soporte", href: "/soporte" },
      { label: "Ayuda", href: "/ayuda" },
      { label: "Términos", href: "/terminos" },
      { label: "Privacidad", href: "/privacidad" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="Domesta inicio">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground">Domesta</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              El marketplace de servicios domésticos de confianza en Argentina.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Domesta. Hecho en Argentina.</p>
        </div>
      </div>
    </footer>
  )
}
