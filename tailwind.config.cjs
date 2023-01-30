const colors = require('tailwindcss/colors')
const theme = require('./tailwind.theme.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'my-',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      // quasar colors
      ...theme.colors
    },
    extend: {},
  },
  plugins: [],
}
