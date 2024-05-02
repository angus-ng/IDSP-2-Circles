/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.ejs",
    "./src/public/*.js"
],
theme: {
  fontFamily: {
    sans: ['"DM Sans"', 'sans-serif']
  },
  extend: {
    colors: {
      'light-mode-bg': 'rgba(248, 244, 234, 0.86)',
      'light-mode': '#F8F4EA',
      'light-mode-accent': '#0044CC',
      'gradient-lighter-blue': 'rgba(0, 66, 200, 0.5)',
      'gradient-medium-blue': '#04318b',
      'gradient-darker-blue': 'rgba(12, 18, 28, 0.5)',
      'grey': '#3A3A3A',
      'overlay-bg': 'rgba(0, 0, 0, 0.6)',
      'dark-grey': '#737373',
    },
    fontSize: {
      'h1': '29px',
      'h2': '22px',
      'body': '17px',
      'secondary': '12px',
      'tertiary': '10px',
      '20': '20px',
      '15': '15px',
      '14': '14px',
      '13': '13px',
    },
    lineHeight: {
      'h1': '40px',
      'h2': '31px',
      'body': '24px',
      'secondary': '18px',
      'tertiary': '14px'
    },
    width: {
      '325': '325px',
      'input-box': '377px'
    },
    height: {
      '932': '932px'
    },
    boxShadow: {
      'background-shadow': 'inset 0 0 100px -30px rgba(0, 0, 0, 0.2)'
    },
    borderRadius: {
      '20': '20px',
      'input-box': '28px',
      'checkbox': '3px',
    },
    margin: {
      '4': '4px'
    },
    outline: {
      '1': '1px'
    },
    spacing: {
      '22': '22px'
    }
  },
},
plugins: [
  require('@tailwindcss/forms'),
],
}