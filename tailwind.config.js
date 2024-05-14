/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  mode: "jit",
  content: [
    "./public/*.html",
    "./public/*.js",
    "./node_modules/flowbite/**/*.js"
],
theme: {
  fontFamily: {
    sans: ['"DM Sans"', 'sans-serif']
  },
  screens: {
    'min-size': '430px'
  },
  fontWeight: {
    'semibold': '600'
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
      'text-grey': '#484848',
      'like': '#FF4646',
      'onboarding-grey': 'rgba(14, 14, 14, 0.75)',
      'success': '#14AA3E'
    },
    fontSize: {
      'onboarding': '36px',
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
      '11': '11px',
      '23': '23px'
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
      '207': '207px',
      'image': '178px',
      'input-box': '377px',
      '100': '100px',
      '110': '110px',
      '180': '180px',
      '42': '42px',
      '58': '58px',
      '62': '62px',
      'popup': '398px',
      'request': '78px',
      '312': '312px',
      '166': '166px',
      '168': '168px',
      '82': '82px',
      '25': '25px',
      '43': '43px',
      '40': '40px',
      '265': '265px'
    },
    height: {
      '932': '932px',
      '230': '230px',
      '100': '100px',
      'header': '105px',
      '110': '110px',
      '27': '27px',
      '180': '180px',
      '42': '42px',
      '228':'228px',
      'image': '215px',
      'navbar': '85px',
      '400': '400px',
      '62': '62px',
      '415': '415px',
      '58': '58px',
      'request': '34px',
      '38': '38px',
      '45': '45px',
      '33': '33px',
      '84': '84px',
      '82': '82px',
      '25': '25px',
      '43': '43px',
      '40': '40px',
      '270': '270px'
    },
    boxShadow: {
      'background-shadow': 'inset 0 0 100px -30px rgba(0, 0, 0, 0.2)'
    },
    borderRadius: {
      '20': '20px',
      'input-box': '28px',
      'checkbox': '3px',
      '12.75': '12.75px',
      'popup': '15px'
    },
    borderWidth: {
      'circle': '0.75px',
    },
    margin: {
      '4': '4px',
      'header': '105px',
      '40': '40px',
      "neg12": "-12px"
    },
    outline: {
      '1': '1px'
    },
    spacing: {
      '22': '22px',
      '38': '38px',
      '200': '200px',
      'search': '7px'
    },
    padding: {
      '20': '20px'
    },
    textShadow: {
      sm: '0 1px 2px var(--tw-shadow-color)',
      DEFAULT: '0 1px 6px var(--tw-shadow-color)',
      lg: '0 8px 16px var(--tw-shadow-color)',
    },
  },
},
plugins: [
  require('@tailwindcss/forms'),
  require('flowbite/plugin'),
  plugin(function ({ matchUtilities, theme }) {
    matchUtilities(
      {
        'text-shadow': (value) => ({
          textShadow: value,
        }),
      },
      { values: theme('textShadow') }
    )
  })
],
}