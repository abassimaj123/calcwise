/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1A6AFF',
        'primary-dark': '#1455CC',
        accent: '#00D4FF',
        dark: '#111827',
        'dark-hero': '#0F172A',
        dark2: '#1E293B',
        'dark-footer': '#060D1A',
        'border-subtle': '#334155',
        cw: { gray: '#8A9BB5', success: '#1D9E75', warning: '#F5C842' },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: { card: '12px', btn: '50px' },
    },
  },
  plugins: [],
}
