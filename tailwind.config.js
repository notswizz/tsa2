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
        'tsa-black': '#000000',
        'tsa-dark': '#111111',
        'tsa-gray': '#333333',
        'tsa-light': '#666666',
        'tsa-white': '#FFFFFF',
        'tsa-accent': '#CCCCCC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'elegant': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'hover': '0 10px 15px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-elegant': 'linear-gradient(to bottom, #000000, #111111)',
      }
    },
  },
  plugins: [],
} 