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
        'light-mode-bg': 'rgba(248, 244, 234, 0.92)',
        'gradient-lighter-blue': 'rgba(0, 66, 200, 0.5)',
        'gradient-medium-blue': '#04318b',
        'gradient-darker-blue': 'rgba(12, 18, 28, 0.5)',
        'grey': '#3A3A3A'
      },
      fontSize: {
        'h1': '29px',
        'h2': '22px',
        'body': '17px',
        'secondary': '12px',
        'tertiary': '10px',
        '15': '15px',
        '13': '13px'
      },
      lineHeight: {
        'h1': '40px',
        'h2': '31px',
        'body': '24px',
        'secondary': '18px',
        'tertiary': '14px'
      },
      width: {
        '325': '325px'
      },
      boxShadow: {
        'background-shadow': 'inset 0 0 100px -30px rgba(0, 0, 0, 0.2)'
      },
      borderRadius: {
        '20': '20px'
      }
    },
  },
  plugins: [],
}

