export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zorvyn: {
          slate: '#0F172A',
          navy: '#001F3F',
          emerald: '#10B981',
          light: '#F8FAFC',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
