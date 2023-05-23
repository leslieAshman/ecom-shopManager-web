/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withMT = require('@material-tailwind/react/utils/withMT');
module.exports = withMT({
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      transparent: 'transparent',
      vine: '#1D4854',
      vineHover: '#1C1C20',
      orange: '#FF906D',
      orangeHover: '#FF7449',
      orangeHighlight: '#FFF4F0',
      accent_orange: '#F7E1DA',
      black: '#000000',
      white: '#FFFFFF',
      muted: '#B3B3B3',
      gray: {
        DEFAULT: '#CCCCCC',
        50: '#FCFCFC',
        100: '#F2F2F2',
        200: '#E6E6E6',
        300: '#CCCCCC',
        400: '#B3B3B3',
        500: '#999999',
        600: '#808080',
        700: '#666666',
        800: '#4D4D4D',
        900: '#333333',
        1000: '#1A1A1A',
      },
      glass: '#B1DED8',
      seed: '#F6D46B',
      stone: '#F0EBE6',
      accent_stone: '#F7F5F2',
      grape: '#CACBFB',
      ripe: '#1C2450',
      aqua: '#55A2A7',
      steely: '#727285',
      oak: '#94642C',
      harvest: '#65B45C',
      burgundy: '#BF2E00',
      italy: '#A1A3F9',
      red: '#FF3939',
      amber: '#FFC043',
      green: '#05944F',
      trendup: '#68CA5D',
      trenddown: '#E93940',
      champagne: '#EDCC66',
    },

    fontSize: {
      xs: ['10px', '16px'],
      sm: ['12px', '16px'],
      14: ['14px', '24px'],
      base: ['16px', '24px'],
      20: ['20px', '28px'],
      md: ['24px', '32px'],
      lg: ['32px', '40px'],
      xl: ['40px', '48px'],
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    fontFamily: {
      sans: ["'GTFlexa'"],
    },
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
        xs: '10px',
        sm: '16px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
    },
  },

  plugins: [require('@tailwindcss/line-clamp')],
});
