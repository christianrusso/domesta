'use client';

import Link from 'next/link';
import { LogoWithText } from '@/components/Logo';

export default function AyudaPage() {
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
          <h1 className="text-5xl font-bold text-white mb-4">Centro de Ayuda</h1>
          <p className="text-xl text-white/70">Guías y tutoriales para aprovechar Domesta al máximo</p>
        </div>

        <div className="space-y-8">
          {/* Para Clientes */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8">🏠 Para Clientes</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Cómo registrarme</h3>
                <ol className="list-decimal list-inside text-white/80 space-y-2">
                  <li>Hacé clic en "Buscar personal" en la landing</li>
                  <li>Seleccioná el rol "Cliente"</li>
                  <li>Completá tus datos (email, contraseña, teléfono, dirección y zona)</li>
                  <li>¡Listo! Ya podés buscar personal doméstico</li>
                </ol>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3">Cómo buscar personal</h3>
                <p className="text-white/80 mb-3">
                  Desde el dashboard tenés dos opciones:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li><span className="font-semibold">Búsqueda con IA:</span> Escribí lo que necesitás (ej: "busco niñera en Caseros") y dejaremos que la IA te encuentre el mejor match</li>
                  <li><span className="font-semibold">Búsqueda Avanzada:</span> Filtrá por servicio (limpieza, niñera, cocina), zona y otros criterios</li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3">Mensajería gratis</h3>
                <p className="text-white/80">
                  Podés contactar hasta 3 perfiles de forma gratuita. Los mensajes están moderados para proteger a ambas partes. El personal NO verá tu teléfono o email hasta que compres un paquete de créditos.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3">Comprar créditos</h3>
                <p className="text-white/80 mb-3">
                  Los créditos te permiten desbloquear el contacto real del personal. Cada crédito = 1 contacto desbloqueado.
                </p>
                <p className="text-white/80">
                  Para comprar:
                </p>
                <ol className="list-decimal list-inside text-white/80 space-y-2 mt-2">
                  <li>Hacé clic en "Comprar créditos" en el dashboard</li>
                  <li>Seleccioná el paquete que querés</li>
                  <li>Pagá a través de Mercado Pago</li>
                  <li>Los créditos se acreditarán instantáneamente</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Para Personal */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8">💼 Para Personal Doméstico</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Cómo registrarme</h3>
                <ol className="list-decimal list-inside text-white/80 space-y-2">
                  <li>Hacé clic en "Registrarse como personal" en la landing</li>
                  <li>Completá tus datos personales</li>
                  <li>Completá tu perfil profesional (descripción, servicios, tarifa)</li>
                  <li>Aguardá aprobación del equipo (máximo 24hs)</li>
                  <li>¡Ya estás visible para los clientes!</li>
                </ol>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3">Completar el perfil</h3>
                <p className="text-white/80 mb-3">
                  Tu perfil es clave para conseguir más clientes. Incluye:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li><span className="font-semibold">Foto:</span> Una foto clara y profesional</li>
                  <li><span className="font-semibold">Descripción:</span> Contá sobre tu experiencia (ej: "8 años en limpieza profunda")</li>
                  <li><span className="font-semibold">Servicios:</span> Seleccioná los que ofrecés (limpieza, niñera, cocina)</li>
                  <li><span className="font-semibold">Tarifa:</span> Tu precio por hora</li>
                  <li><span className="font-semibold">Características:</span> Cualidades (confiable, puntual, etc.) e idiomas que hablás</li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3">Cómo responder clientes</h3>
                <p className="text-white/80">
                  Los clientes se contactan a través de mensajes. No compartas tu teléfono o email directamente en la plataforma (los moderadores lo bloquearán). Cuando un cliente compre un crédito, verá tu contacto real y podrán arreglar afuera de la app.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3">Sistema de referencias (próximamente)</h3>
                <p className="text-white/80">
                  Una vez que labures con un cliente, él podrá dejarte referencias publicadas. Acumulá buenas referencias para ganar confianza y conseguir más trabajo.
                </p>
              </div>
            </div>
          </div>

          {/* Preguntas Generales */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8">❓ Preguntas Generales</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">¿Es gratis usar Domesta?</h3>
                <p className="text-white/80">
                  Sí, registrarse es gratis para todos. El personal doméstico nunca paga. Los clientes tienen 3 mensajes gratis; después pagan créditos solo cuando quieren contactar directamente.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-2">¿Cómo se protege mi privacidad?</h3>
                <p className="text-white/80">
                  Domesta es solo un canal de contacto. Los datos personales (teléfono, email) se comparten solo cuando corresponde (el cliente compra crédito). Todos los mensajes son moderados y almacenados de forma segura.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-2">¿Qué pasa si hay un problema con un cliente/personal?</h3>
                <p className="text-white/80">
                  Podés reportar perfiles o comportamientos inapropiados. Nuestro equipo lo revisará. Ten en cuenta que Domesta es un canal de contacto, no un empleador, así que los detalles del trabajo (sueldo, horarios) se arreglan entre ustedes.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-2">¿Puedo editar mi perfil después?</h3>
                <p className="text-white/80">
                  Claro. Tanto clientes como personal pueden editar sus perfiles en cualquier momento desde la sección "Mi Perfil".
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
