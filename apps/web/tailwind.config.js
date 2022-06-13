const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './apps/web/pages/**/*.{js,ts,jsx,tsx}',
    './apps/web/ui/**/*.{js,ts,jsx,tsx}',
    './apps/web/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
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
