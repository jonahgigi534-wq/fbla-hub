/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0a2e7f',
        blue: '#1d52bc',
        cobalt: '#226add',
        gold: '#f4ab19',
        white: '#ffffff',
        black: '#2d2b2b',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"DM Serif Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(10,46,127,0.06)',
      }
    },
  },
  plugins: [],
}
