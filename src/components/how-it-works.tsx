import { MessageSquareText, Users, Handshake } from "lucide-react"

const steps = [
  {
    icon: MessageSquareText,
    title: "Describí lo que necesitás",
    description:
      "Contanos en tus palabras qué buscás. Nuestra búsqueda con IA entiende lo que necesitás.",
  },
  {
    icon: Users,
    title: "Contactá perfiles",
    description:
      "Revisá perfiles verificados, su historial laboral y referencias reales antes de decidir.",
  },
  {
    icon: Handshake,
    title: "Contratá directo",
    description:
      "Coordiná y acordá los términos directamente, sin intermediarios ni comisiones ocultas.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-secondary/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Cómo funciona</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tres pasos para encontrar a la persona indicada
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="relative rounded-2xl border border-border bg-card p-7 shadow-sm"
            >
              <span className="absolute right-6 top-6 text-sm font-bold text-muted-foreground/40">
                0{i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
