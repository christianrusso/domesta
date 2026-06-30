'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogoWithText } from './Logo';

interface HeaderProps {
  user?: { id: string; name: string; role: string } | null;
  unreadCount?: number;
}

export function Header({ user, unreadCount = 0 }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  if (!user) return null;

  const isDomestic = user.role === 'DOMESTIC';

  return (
    <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href={isDomestic ? '/profile' : '/dashboard'}>
          <LogoWithText />
        </Link>

        <div className="flex gap-6 items-center">
          {/* Buscar - solo para clientes */}
          {!isDomestic && (
            <Link href="/dashboard" className="text-white/70 hover:text-white transition text-sm">
              Buscar
            </Link>
          )}

          {/* Mensajes - para todos */}
          <Link href="/inbox" className="text-white/70 hover:text-white transition text-sm relative">
            💬 Mensajes
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Mi Perfil - para todos */}
          <Link href="/profile" className="text-white/70 hover:text-white transition text-sm">
            Mi Perfil
          </Link>

          {/* Nombre y Salir */}
          <span className="text-white/70 text-sm border-l border-white/20 pl-4">
            {user.name}
          </span>

          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition text-sm font-semibold"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
