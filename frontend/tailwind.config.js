/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          100: '#0b1220',
          200: '#0f172a',
          300: '#111c2a',
          400: '#131f2f',
        },
        accent: '#3366FF',
        success: '#22c55e',
      },
      boxShadow: {
        card: '0 16px 40px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
}

