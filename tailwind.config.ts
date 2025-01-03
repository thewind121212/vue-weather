import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#060C1A',
        secondary: '#0E1421',
        'primary-h-color': '#7068FF',
        'primary-text': 'rgba(var(--primary-text-color))',
        'priamry-card': 'rgba(var(--primary-card-color))',
      },
      fontFamily: {
        sfPro: ['"SF Pro Display"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
      }
    },
  },
  plugins: [],
} satisfies Config

