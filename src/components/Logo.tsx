export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* D Circular - moderna y profesional */}
      <defs>
        <linearGradient id="dGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366F1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Círculo de fondo */}
      <circle cx="50" cy="50" r="35" fill="url(#dGradient)" />

      {/* D dentro del círculo */}
      <path
        d="M 35 30 Q 30 30 30 50 Q 30 70 35 70 Q 50 70 65 55 L 65 30 Z"
        fill="white"
      />
    </svg>
  );
}

export function LogoWithText() {
  return (
    <div className="flex items-center gap-2">
      <Logo className="w-8 h-8" />
      <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Domesta
      </span>
    </div>
  );
}
