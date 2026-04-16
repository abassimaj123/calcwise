/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1A6AFF',
        'primary-dark': '#1455CC',
        'primary-light': '#EFF6FF',
        accent: '#00D4FF',
        // Light theme
        dark: '#0F172A',      // text-primary, used for footer bg
        dark2: '#FFFFFF',     // card bg (white)
        'dark-hero': '#F8FAFC',
        'dark-footer': '#0F172A',
        'border-subtle': '#E2E8F0',
        'border-hover': '#CBD5E1',
        cw: {
          gray: '#64748B',    // text-secondary
          muted: '#94A3B8',
          success: '#059669',
          warning: '#D97706',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: { card: '12px', btn: '8px' },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
        'card-lg': '0 8px 24px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
