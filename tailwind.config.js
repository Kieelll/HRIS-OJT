/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          ivory: '#FAF8F3',
          cream: '#F5F1E8',
          beige: '#E8DDD4',
          peach: '#F4D5C2',
          sand: '#E8D5B7',
          amber: '#E8C4A0',
        },
        dark: {
          bg: '#1a1a1a',
          surface: '#242424',
          surfaceHover: '#2d2d2d',
          border: '#3a3a3a',
          text: '#e5e5e5',
          textSecondary: '#a3a3a3',
          accent: '#8b5cf6',
          accentHover: '#7c3aed',
        }
      }
    },
  },
  plugins: [],
}

