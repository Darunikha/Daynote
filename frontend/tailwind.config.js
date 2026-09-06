/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Daynote palette. Each token also has a CSS-variable driven "surface"
        // counterpart below so dark mode swaps values rather than inverting.
        alabaster: '#F7F8F2',
        vanilla: '#FFF9F7',
        flamingo: {
          DEFAULT: '#E8B4B8',
          50: '#FBF1F1',
          100: '#F7E5E6',
          200: '#F0D2D4',
          300: '#E8B4B8',
          400: '#DC969B',
          500: '#CC7A80',
        },
        plum: {
          DEFAULT: '#6B4B5A',
          light: '#8A6675',
          dark: '#523946',
        },
        olive: {
          DEFAULT: '#8A9A7B',
          light: '#A8B59B',
          dark: '#6E7C62',
        },
        brandy: {
          DEFAULT: '#8B4636',
          light: '#A66353',
          soft: '#B98979',
        },
        // Warm dark-mode neutrals
        night: {
          bg: '#1F1D1D',
          card: '#292626',
          border: '#3B3535',
          text: '#F4EEEE',
          muted: '#B9ADAD',
          accent: '#D5A6A6',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', '"Fraunces"', 'cursive'],
      },
      boxShadow: {
        paper: '0 1px 2px rgba(107, 75, 90, 0.04), 0 6px 20px -12px rgba(107, 75, 90, 0.18)',
        'paper-lg': '0 2px 4px rgba(107, 75, 90, 0.05), 0 16px 40px -20px rgba(107, 75, 90, 0.28)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      borderRadius: {
        card: '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'slide-in-right': 'slide-in-right 0.28s ease-out both',
      },
    },
  },
  plugins: [],
};
