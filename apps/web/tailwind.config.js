const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './apps/web/pages/**/*.{js,ts,jsx,tsx}',
    './apps/web/ui/**/*.{js,ts,jsx,tsx}',
    './apps/web/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
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
      backgroundImage: {
        logo: "url('/logo.svg')",
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
