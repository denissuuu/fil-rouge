/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#dbe4ff',
          500: '#3b5bdb',
          600: '#3451c7',
          700: '#2c44b0',
        },
      },
    },
  },
  plugins: [],
}
