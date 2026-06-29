'use client';

import { useState } from 'react';

function Logo1() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <path d="M 25 15 L 45 15 Q 65 15 65 50 Q 65 85 45 85 L 25 85 Z" fill="url(#g1)" />
      <ellipse cx="48" cy="50" rx="16" ry="28" fill="white" />
    </svg>
  );
}

function Logo2() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <path d="M 30 20 Q 20 20 20 50 Q 20 80 30 80 Q 50 80 60 70 Q 70 60 70 50 Q 70 40 60 30 Q 50 20 30 20 Z" fill="url(#g2)" />
      <path d="M 50 50 Q 45 50 45 50 Q 45 55 50 58 Q 55 55 55 50 Q 55 45 50 45 Z" fill="white" />
    </svg>
  );
}

function Logo3() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="15" height="60" rx="4" fill="url(#g3)" />
      <path d="M 35 30 Q 55 30 60 50 Q 55 70 35 70 L 35 60 Q 50 60 53 50 Q 50 40 35 40 Z" fill="url(#g3)" />
    </svg>
  );
}

function Logo4() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="35" fill="url(#g4)" />
      <path d="M 35 30 Q 30 30 30 50 Q 30 70 35 70 Q 50 70 65 55 L 65 30 Z" fill="white" />
    </svg>
  );
}

export default function LogoPreview() {
  const [selected, setSelected] = useState<number | null>(null);

  const logos = [
    {
      id: 1,
      name: 'D Estilizada (Actual)',
      description: 'Geométrica con hueco circular',
      Component: Logo1,
    },
    {
      id: 2,
      name: 'D Redondeada',
      description: 'Más suave y amigable',
      Component: Logo2,
    },
    {
      id: 3,
      name: 'D Modern Bold',
      description: 'Trazo grueso y profesional',
      Component: Logo3,
    },
    {
      id: 4,
      name: 'D Circular',
      description: 'Dentro de un círculo',
      Component: Logo4,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">🎨 Logo Preview</h1>
        <p className="text-gray-300 mb-12">Selecciona la D que más te guste</p>

        {/* Grid de logos */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {logos.map((logo) => {
            const Component = logo.Component;
            return (
              <button
                key={logo.id}
                onClick={() => setSelected(logo.id)}
                className={`group bg-white/5 border-2 rounded-2xl p-12 transition ${
                  selected === logo.id
                    ? 'border-purple-400 bg-purple-500/10'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-6 group-hover:scale-110 transition">
                    <Component />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{logo.name}</h3>
                  <p className="text-gray-400 text-sm">{logo.description}</p>
                  {selected === logo.id && (
                    <div className="mt-4 px-3 py-1 bg-purple-500 rounded-full text-xs text-white">
                      ✓ Seleccionada
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview grande */}
        {selected && (
          <div className="bg-white/5 border border-white/20 rounded-2xl p-12 mb-8">
            <h2 className="text-xl font-semibold text-white mb-8">Preview Grande</h2>
            <div className="flex gap-12 items-center">
              <div className="w-40 h-40">
                {logos.find((l) => l.id === selected)?.Component && (
                  <>
                    {selected === 1 && <Logo1 />}
                    {selected === 2 && <Logo2 />}
                    {selected === 3 && <Logo3 />}
                    {selected === 4 && <Logo4 />}
                  </>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {logos.find((l) => l.id === selected)?.name}
                </h3>
                <p className="text-gray-400">{logos.find((l) => l.id === selected)?.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-6 text-blue-100 text-sm">
          <p>
            💡 Mira los 4 logos. Si alguno te gusta, dime cuál (1, 2, 3 ó 4).
            <br />
            Si ninguno te gusta, dime cómo debería ser y lo ajusto.
          </p>
        </div>
      </div>
    </div>
  );
}
