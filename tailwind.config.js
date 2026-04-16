/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1A6AFF',
        'primary-dark': '#1455CC',
        accent: '#00D4FF',
        dark: '#0A1628',
        dark2: '#0F2040',
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
