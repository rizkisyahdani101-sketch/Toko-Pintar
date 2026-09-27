/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b1fc',
          500: '#3394f6',
          600: '#1d76eb',
          700: '#1560d8',
          800: '#184eaf',
          900: '#1a438a',
          950: '#142b54',
        },
      },
    },
  },
  plugins: [],
}
