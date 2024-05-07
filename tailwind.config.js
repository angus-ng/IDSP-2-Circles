/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.ejs",
    "./src/public/*.js",
    "./node_modules/flowbite/**/*.js"
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
      'light-grey': '#D9D9D9',
      'medium-grey': '#565656',
      'dark-grey': '#737373',
      'text-grey': '#484848'
    },
    fontSize: {
      'h1': '29px',
      'h2': '22px',
      'body': '17px',
      'secondary': '12px',
      'tertiary': '10px',
      '26': '26px',
      '24': '24px',
      '20': '20px',
      '15': '15px',
      '14': '14px',
      '13': '13px',
      '11': '11px'
    },
    lineHeight: {
      'h1': '40px',
      'h2': '31px',
      'body': '24px',
      'secondary': '18px',
      'tertiary': '14px',
    },
    width: {
      '932': '932px',
      '430': '430px',
      '380': '380px',
      '325': '325px',
      '234': '234px',
      'input-box': '377px',
      '100': '100px',
      '110': '110px',
      '180': '180px',
    },
    height: {
      '932': '932px',
      '230': '230px',
      '100': '100px',
      'header': '105px',
      '110': '110px',
      'navbar': '85px',
      '27': '27px'
    },
    boxShadow: {
      'background-shadow': 'inset 0 0 100px -30px rgba(0, 0, 0, 0.2)'
    },
    borderRadius: {
      '20': '20px',
      'input-box': '28px',
      'checkbox': '3px',
      '12.75': '12.75px'
    },
    margin: {
      '4': '4px',
    },
    outline: {
      '1': '1px'
    },
    spacing: {
      '22': '22px'
    },
    padding: {
      '20': '20px'
    }
  },
},
plugins: [
  require('@tailwindcss/forms'),
  require('flowbite/plugin')
],
}