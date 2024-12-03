import { text } from 'stream/consumers'
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(var(--primary-bg-color))',
        'primary-text': 'rgba(var(--primary-text-color))',
        'priamry-card': 'rgba(var(--primary-card-color))',
      }
    },
  },
  plugins: [],
} satisfies Config

