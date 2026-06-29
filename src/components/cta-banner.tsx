import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaBanner() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center shadow-lg sm:px-12 lg:py-16">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            ¿Ofrecés servicios domésticos?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Creá tu perfil gratis, mostrá tu experiencia y conectá con familias que
            buscan profesionales como vos.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-accent px-8 text-accent-foreground hover:bg-accent/90"
            >
              Creá tu perfil gratis
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              Saber más
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
