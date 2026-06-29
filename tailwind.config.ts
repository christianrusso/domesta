import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        domesta: {
          50: '#f9f5ff',
          100: '#f3ebff',
          200: '#e9d5ff',
          300: '#d8b4ff',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(88, 28, 135) 50%, rgb(15, 23, 42) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-lg': '0 0 30px rgba(168, 85, 247, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
