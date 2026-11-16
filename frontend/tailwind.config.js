/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'siri-gradient': 'siri 8s ease infinite',
        'expand': 'expand 0.3s ease-out forwards',
      },
      keyframes: {
        siri: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        expand: {
          '0%': { minHeight: '80px' },
          '100%': { minHeight: '160px' },
        }
      },
      colors: {
        siri: {
          pink: '#ff2e93',
          purple: '#8a2be2',
          blue: '#00bfff',
          dark: '#0a0a0a',
        }
      }
    },
  },
  plugins: [],
}
