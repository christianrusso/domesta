'use client';

import Link from 'next/link';
import { LogoWithText } from '@/components/Logo';

export default function SoportePage() {
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
          <h1 className="text-5xl font-bold text-white mb-4">Soporte</h1>
          <p className="text-xl text-white/70">Estamos acá para ayudarte con cualquier pregunta</p>
        </div>

        <div className="space-y-8">
          {/* Contact Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">¿Necesitás ayuda?</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">📧 Email</h3>
                <p className="text-white/80">
                  Escribinos a <span className="text-purple-300 font-semibold">soporte@domesta.com.ar</span> y te responderemos en menos de 24 horas.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">💬 WhatsApp</h3>
                <p className="text-white/80">
                  También podés contactarnos por WhatsApp al <span className="text-purple-300 font-semibold">+54 11 XXXX-XXXX</span> de lunes a viernes de 9 a 18hs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">⏰ Horarios</h3>
                <p className="text-white/80">
                  Lunes a viernes: 9:00 - 18:00<br />
                  Sábados: 10:00 - 14:00<br />
                  Domingos y feriados: cerrado
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Preguntas frecuentes</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">¿Cómo reporto un problema con la plataforma?</h3>
                <p className="text-white/70">
                  Podés reportar cualquier problema directamente desde tu cuenta en la sección de Ayuda, o escribiendo a soporte@domesta.com.ar con detalles de lo que sucedió.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-2">¿Qué hago si tengo problemas para pagar los créditos?</h3>
                <p className="text-white/70">
                  Si hay inconvenientes con el pago a través de Mercado Pago, te recomendamos verificar que tu tarjeta esté activa y con fondos. Si el problema persiste, contactá a soporte.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-2">¿Puedo recuperar un mensaje eliminado?</h3>
                <p className="text-white/70">
                  Lamentablemente, los mensajes eliminados no se pueden recuperar. Recomendamos guardar información importante en otro medio.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-2">¿Cómo denuncio un perfil inapropiado?</h3>
                <p className="text-white/70">
                  Podés reportar perfiles o mensajes sospechosos haciendo clic en el botón de reporte (🚩) en la plataforma. Nuestro equipo lo revisará en breve.
                </p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Estado del servicio</h2>
            <p className="text-white/80 mb-4">
              Verificá el estado actual de la plataforma y cualquier incidencia en tiempo real.
            </p>
            <a
              href="#"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Ver estado del sistema →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
