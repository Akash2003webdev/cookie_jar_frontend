/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Pacifico', 'cursive'],
      },
      colors: {
        primary: {
          DEFAULT: '#2d6a4f',
          light: '#40916c',
          dark: '#1b4332',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0,0,0,0.06)',
        card: '0 8px 30px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
