import { Sparkles, Baby, ChefHat, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Sparkles,
    title: "Limpieza",
    description:
      "Personal de limpieza para tu hogar, por hora o jornada completa. Confiable y con experiencia comprobable.",
  },
  {
    icon: Baby,
    title: "Niñera",
    description:
      "Cuidado de niños con personas verificadas y referencias reales. Tranquilidad para toda la familia.",
  },
  {
    icon: ChefHat,
    title: "Cocina",
    description:
      "Cocineros y cocineras para el día a día o eventos. Comida casera adaptada a tus gustos.",
  },
]

export function Services() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Servicios</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Profesionales para cada necesidad del hogar
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-2 flex-1 text-pretty leading-relaxed text-muted-foreground">
                {description}
              </p>
              <a
                href="#"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Ver profesionales
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
