/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react")
const themeLight = require('./src/theme/colors/light')
const themeDark = require('./src/theme/colors/dark')
import { Config } from 'tailwindcss'

const config: Config = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
      '2xl': '1536px'
    }
  },
  darkMode: 'class',
  plugins: [
    heroui({
      addCommonColors: true,
      themes: {
        light: themeLight,
        dark: themeDark
      }
    })
  ]
}

export default config
