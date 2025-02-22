/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'tsa-pink': '#FF69B4',
        'dark-slate': '#111111',
        'darker-slate': '#0A0A0A',
        'light-slate': '#1A1A1A',
        'cyber-blue': '#0A1128',
        'neon-blue': '#00F6FF',
        'slate-850': '#1E293B',
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.neon-pink), 0 0 20px theme(colors.neon-pink.500)',
        'cyber': '0 0 10px rgba(255, 0, 128, 0.3)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(to bottom, #0A0A0A, #111111)',
      }
    },
  },
  plugins: [],
} 