import { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,jsx,md,mdx,ts,tsx}", "index.html"],
  theme: {
    colors: {
      ...colors,
      dark: '#f6f7f8',
      darkBlack: '#19212c',
      slate: '#1d1f20',
      tinkoff: '#ffdd2d'
    },
    fontFamily: {
      rem: ['REM', 'Arial', 'sans-serif'],
    }
  }
} as Config