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
      },
      fontFamily: {
        sfPro: ['"SF Pro Display"', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config

