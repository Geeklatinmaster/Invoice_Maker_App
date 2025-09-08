import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      borderRadius: { xl: '20px', '3xl': '28px' },
      boxShadow: { glass: '0 10px 30px rgba(2,8,23,.08)' },
    },
  },
  plugins: [],
} satisfies Config