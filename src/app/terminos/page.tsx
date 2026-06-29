'use client';

import Link from 'next/link';
import { LogoWithText } from '@/components/Logo';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br slate-950">
      {/* Header */}
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <LogoWithText />
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-white/70 hover:text-white transition font-medium">
              Volver
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Términos y Condiciones</h1>
          <p className="text-xl text-white/70">Última actualización: Junio 2026</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-8 text-white/80">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de Términos</h2>
            <p>
              Al registrarte y usar Domesta, aceptás estos términos y condiciones. Si no estás de acuerdo, por favor no uses nuestra plataforma.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Descripción del Servicio</h2>
            <p className="mb-4">
              Domesta es un marketplace que conecta a clientes con personal doméstico en Argentina. Somos un canal de contacto, NO un empleador, intermediario laboral, ni aseguradora.
            </p>
            <p>
              Nos limitamos a:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Proveer una plataforma de búsqueda</li>
              <li>Facilitar mensajería entre partes</li>
              <li>Procesar pagos de créditos de contacto</li>
              <li>Moderar contenido para seguridad básica</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Responsabilidades del Usuario</h2>
            <p className="mb-4">
              Al registrarte, vos asegurás que:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Tenés 18 años o más</li>
              <li>Tus datos son verdaderos y exactos</li>
              <li>No compartirás información de terceros sin consentimiento</li>
              <li>No crearás múltiples cuentas</li>
              <li>No intentarás evadir el sistema de moderación</li>
              <li>Respetarás la dignidad de otros usuarios</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Relación Laboral</h2>
            <p>
              Domesta NO es empleador ni intermediario laboral. La relación es directamente entre cliente y personal doméstico. Ustedes arreglan:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Horarios y días de trabajo</li>
              <li>Salario / forma de pago</li>
              <li>Tareas específicas</li>
              <li>Términos de contratación</li>
            </ul>
            <p className="mt-4 text-sm">
              💡 Recomendación: Realicen una entrevista antes de comprometerse formalmente.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Créditos de Contacto</h2>
            <ul className="list-disc list-inside space-y-3">
              <li>Los créditos se compran a través de Mercado Pago</li>
              <li>1 crédito = 1 contacto real desbloqueado (email/teléfono del personal)</li>
              <li>Los créditos NO son reembolsables</li>
              <li>Los créditos tienen validez de 12 meses desde la compra</li>
              <li>Domesta se reserva el derecho de modificar precios previo aviso</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Prohibiciones</h2>
            <p className="mb-4">
              Prohibido:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Discriminación (edad, género, raza, religión, orientación sexual)</li>
              <li>Acoso, amenazas o lenguaje abusivo</li>
              <li>Compartir contactos personales en mensajes (moderación bloqueará)</li>
              <li>Intentos de estafa o suplantación</li>
              <li>Publicar contenido explícito o ilegal</li>
              <li>Scam / phishing</li>
              <li>Spam o publicidad no autorizada</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Moderación y Suspensión</h2>
            <p className="mb-4">
              Domesta se reserva el derecho de:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Revisar perfiles antes de publicarlos</li>
              <li>Remover contenido inapropiado</li>
              <li>Suspender o eliminar cuentas por violación de términos</li>
              <li>Bloquear usuario para evitar fraude o abuso</li>
            </ul>
            <p className="mt-4">
              Las decisiones de moderación son finales y no sujetas a apelación (salvo en casos excepcionales).
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitación de Responsabilidad</h2>
            <p className="mb-4">
              Domesta NO es responsable por:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Calidad del trabajo realizado</li>
              <li>Conflictos laborales entre usuarios</li>
              <li>No-presentismo o incumplimiento de acuerdos</li>
              <li>Fraude o mentiras en perfiles</li>
              <li>Pérdidas económicas derivadas del uso</li>
              <li>Daños personales o materiales durante el trabajo</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Propiedad Intelectual</h2>
            <p>
              Todo contenido de Domesta (logo, diseño, funcionalidades) es propiedad de Domesta. Los usuarios otorgan licencia a Domesta para usar sus perfiles con fines de operación y marketing.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Cambios a los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de Domesta implica aceptación de cambios.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Contacto</h2>
            <p>
              Para preguntas sobre estos términos, contactanos a:
            </p>
            <p className="mt-4 text-purple-300 font-semibold">
              soporte@domesta.com.ar
            </p>
          </div>

          <div className="border-t border-white/10 pt-8 text-sm text-white/60">
            <p>
              Última actualización: Junio 26, 2026<br />
              Estos términos aplican a todos los usuarios de Domesta.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
