/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#3b82f6', // blue
          light: '#60a5fa',
          dark: '#1d4ed8',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          dark: '#0891b2',
        },
        purple: {
          DEFAULT: '#a855f7',
          light: '#c084fc',
          dark: '#7e22ce',
        },
        indigo: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4338ca',
        },
        electric: '#00d2ff',
        neonCyan: '#00f2fe',
        softWhite: '#f8fafc',
        spaceBlack: '#030712',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'blob': 'blob 7s infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: 0.6,
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
          },
          '50%': {
            opacity: 1,
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.8)',
          },
        },
      },
    },
  },
  plugins: [],
}
