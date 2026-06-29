import { FileCheck, Sparkles, Quote } from "lucide-react"

const features = [
  {
    icon: FileCheck,
    title: "Historial laboral verificable",
    description:
      "Cada perfil muestra su experiencia y referencias de familias reales. Conocé el historial laboral antes de contactar, sin sorpresas.",
  },
  {
    icon: Sparkles,
    title: "Búsqueda con inteligencia artificial",
    description:
      "Escribí lo que necesitás como si se lo contaras a un amigo. Nuestra IA interpreta tu pedido y te muestra los perfiles más afines.",
  },
]

export function TrustSection() {
  return (
    <section className="bg-secondary/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Confianza ante todo
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Transparencia real para decisiones tranquilas
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Construimos una comunidad basada en la confianza. Por eso priorizamos la
              verificación de perfiles y un sistema de referencias claro.
            </p>

            <div className="mt-8 space-y-6">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-pretty leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <Quote className="h-9 w-9 text-accent" aria-hidden="true" />
            <blockquote className="mt-4 text-balance text-xl font-medium leading-relaxed text-foreground">
              "Encontré el personal doméstico perfecto para mis necesidades. El proceso fue
              transparente y confiable. Recomiendo Domesta a todas mis amigas."
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                👤
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Familia Argentina</p>
                <p className="text-sm text-muted-foreground">Verificada en Domesta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
