// Colores de Domesta - Tema moderno
export const theme = {
  // Colores principales
  primary: {
    light: '#4F46E5', // Indigo
    DEFAULT: '#4F46E5',
    dark: '#312E81',
    accent: '#7C3AED', // Purple
  },

  // Colores secundarios
  secondary: {
    light: '#10B981', // Emerald
    DEFAULT: '#059669',
    dark: '#047857',
  },

  // Gradientes
  gradients: {
    hero: 'from-slate-950 via-purple-900 to-slate-900',
    card: 'from-indigo-600 to-purple-600',
    text: 'from-indigo-400 to-purple-400',
  },

  // Sombras
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-2xl shadow-purple-500/20',
  },
};

export const buttonStyles = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl transition font-semibold px-6 py-3 rounded-lg',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 transition font-semibold px-6 py-3 rounded-lg',
  outline:
    'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition font-semibold px-6 py-3 rounded-lg',
  danger: 'bg-red-600 text-white hover:bg-red-700 transition font-semibold px-6 py-3 rounded-lg',
};

export const cardStyles = {
  base: 'bg-white rounded-lg shadow-md hover:shadow-lg transition',
  darkBase: 'bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition',
};
