/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.ejs",
],
  theme: {
    fontFamily: {
      sans: ['"DM Sans"', 'sans-serif']
    },
    extend: {
      colors: {
        'light-mode-bg': '#F8F4EA'
      }
    },
  },
  plugins: [],
}

