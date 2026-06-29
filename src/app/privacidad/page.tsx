'use client';

import Link from 'next/link';
import { LogoWithText } from '@/components/Logo';

export default function PrivacidadPage() {
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
          <h1 className="text-5xl font-bold text-white mb-4">Política de Privacidad</h1>
          <p className="text-xl text-white/70">Última actualización: Junio 2026</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-8 text-white/80">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Introducción</h2>
            <p>
              En Domesta, tu privacidad es importante. Esta política explica cómo recopilamos, usamos y protegemos tus datos personales. Al usar Domesta, aceptás esta política.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Información que Recopilamos</h2>
            <p className="mb-4 font-semibold text-white">Información de Registro:</p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Nombre completo</li>
              <li>Email</li>
              <li>Contraseña (hasheada)</li>
              <li>Teléfono</li>
              <li>Dirección y zona</li>
            </ul>

            <p className="mb-4 font-semibold text-white">Información Adicional (Personal Doméstico):</p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Foto de perfil</li>
              <li>Descripción profesional</li>
              <li>Servicios ofrecidos (limpieza, niñera, cocina)</li>
              <li>Tarifa por hora</li>
              <li>Características personales e idiomas</li>
            </ul>

            <p className="mb-4 font-semibold text-white">Información de Uso:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Búsquedas realizadas</li>
              <li>Perfiles visitados</li>
              <li>Mensajes enviados/recibidos</li>
              <li>Compras de créditos</li>
              <li>Dirección IP y datos de navegación (cookies)</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Cómo Usamos Tu Información</h2>
            <p className="mb-4">Usamos tus datos para:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Crear y mantener tu cuenta</li>
              <li>Facilitar búsquedas y mensajería</li>
              <li>Procesar pagos (Mercado Pago)</li>
              <li>Moderar contenido y prevenir fraude</li>
              <li>Mejorar nuestros servicios</li>
              <li>Enviarte notificaciones (email, push, WhatsApp)</li>
              <li>Cumplir requisitos legales</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Compartición de Datos</h2>
            <p className="mb-4">
              Tu información se comparte en las siguientes circunstancias:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li><span className="font-semibold text-white">Mercado Pago:</span> Cuando compras créditos, compartimos datos de pago (NO guardamos números de tarjeta)</li>
              <li><span className="font-semibold text-white">Otros Usuarios:</span> Tu perfil (foto, nombre, servicios) es visible a todos. Tu email/teléfono solo se revelan cuando alguien compra un crédito</li>
              <li><span className="font-semibold text-white">Moderación:</span> Nuestro equipo revisa mensajes si hay reportes</li>
              <li><span className="font-semibold text-white">Autoridades:</span> Si es requerido por ley (investigación policial, orden judicial)</li>
              <li><span className="font-semibold text-white">NO:</span> Nunca vendemos datos a terceros o publicitarios</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Desbloqueo de Contacto</h2>
            <p className="mb-4">
              Cuando un cliente compra un crédito, se habilita el acceso a:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Email del personal doméstico</li>
              <li>Teléfono del personal doméstico</li>
            </ul>
            <p>
              A partir de ese momento, la comunicación ocurre fuera de Domesta. Domesta NO es responsable de lo que suceda después del desbloqueo de contacto.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Seguridad de Datos</h2>
            <p className="mb-4">
              Implementamos medidas de seguridad:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Contraseñas hasheadas con bcrypt</li>
              <li>Tokens JWT para autenticación</li>
              <li>Base de datos encriptada en reposo</li>
              <li>Conexiones HTTPS/SSL</li>
              <li>Acceso restringido a datos sensibles</li>
            </ul>
            <p className="text-sm">
              Sin embargo, ninguna seguridad es 100% garantizada. Usá contraseñas fuertes y no compartas tu token.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Tus Derechos</h2>
            <p className="mb-4">
              Tenés derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="font-semibold text-white">Acceso:</span> Ver qué datos tenemos sobre vos</li>
              <li><span className="font-semibold text-white">Rectificación:</span> Corregir datos incorrectos</li>
              <li><span className="font-semibold text-white">Eliminación:</span> Borrar tu cuenta y datos (aplica la "derecha al olvido")</li>
              <li><span className="font-semibold text-white">Oposición:</span> Rechazar ciertos usos de datos</li>
              <li><span className="font-semibold text-white">Portabilidad:</span> Obtener una copia de tus datos en formato estándar</li>
            </ul>
            <p className="mt-4">
              Para ejercer estos derechos, escribí a <span className="text-purple-300 font-semibold">privacidad@domesta.com.ar</span>
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies y Rastreo</h2>
            <p className="mb-4">
              Usamos cookies para:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Mantener sesiones activas</li>
              <li>Recordar preferencias</li>
              <li>Analizar cómo usás Domesta (Google Analytics)</li>
            </ul>
            <p>
              Podés rechazar cookies no esenciales en el banner de consentimiento. Si rechazo todo, algunos servicios no funcionarán.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Retención de Datos</h2>
            <p className="mb-4">
              Guardamos tus datos mientras:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Tu cuenta esté activa</li>
              <li>Sea necesario para cumplir la ley</li>
              <li>Haya un litigio en curso</li>
            </ul>
            <p>
              Cuando elimines tu cuenta, borramos datos en 30 días, excepto registros requeridos por ley (transacciones financieras, auditoría).
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Cambios a Esta Política</h2>
            <p>
              Si hacemos cambios significativos, te notificaremos por email. El uso continuado implica aceptación.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contacto</h2>
            <p className="mb-4">
              Para consultas sobre privacidad:
            </p>
            <div className="space-y-2">
              <p className="text-purple-300 font-semibold">
                Email: privacidad@domesta.com.ar
              </p>
              <p className="text-purple-300 font-semibold">
                Email General: soporte@domesta.com.ar
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Cumplimiento Legal</h2>
            <p className="mb-4">
              Esta política cumple con:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="font-semibold text-white">PDPA de Argentina:</span> Ley de Protección de Datos Personales</li>
              <li><span className="font-semibold text-white">GDPR (parcial):</span> En caso de usuarios en EU</li>
              <li><span className="font-semibold text-white">Ley de E-commerce:</span> Regulaciones de Argentina</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8 text-sm text-white/60">
            <p>
              Última actualización: Junio 26, 2026<br />
              Vigencia: Aplica a todos los usuarios de Domesta
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
