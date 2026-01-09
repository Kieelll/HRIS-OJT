/** @type {import('tailwindcss').Config} */
export default {
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
        }
      }
    },
  },
  plugins: [],
}

