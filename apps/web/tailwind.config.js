const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './apps/web/pages/**/*.{js,ts,jsx,tsx}',
    './apps/web/ui/**/*.{js,ts,jsx,tsx}',
    './apps/web/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.625rem', { lineHeight: '0.75rem' }],
        sm: ['0.75rem', { lineHeight: '1rem' }],
        base: ['0.875rem', { lineHeight: '1.25rem' }],
        lg: ['1rem', { lineHeight: '1.5rem' }],
        xl: ['1.125rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '3xl': ['1.5rem', { lineHeight: '2rem' }],
        '4xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '5xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '6xl': ['3rem', { lineHeight: '1' }],
        '7xl': ['3.75rem', { lineHeight: '1' }],
        '8xl': ['4.5rem', { lineHeight: '1' }],
      },
      animation: {
        spin: 'spin 3s linear infinite',
      },
      keyframes: {
        spin: {
          to: {
            transform: 'rotate(360deg)',
          },
        },
        bounce: {
          '50%': {
            transform: 'translateY(-10%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '0%, 100%': {
            transform: 'translateY(10%)',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        modtree: {
          50: '#FFCAB8',
          100: '#FFBAA3',
          200: '#FF9C7A',
          300: '#FF7D52',
          400: '#FF5F29',
          500: '#FF4000',
          600: '#C73200',
          700: '#8F2400',
          800: '#571600',
          900: '#1F0800',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
}
