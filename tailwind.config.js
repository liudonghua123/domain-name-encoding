/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#fdfbfb',
          100: '#ebedee',
          200: '#f5e6d3',
          300: '#ffab91',
          400: '#ffcc80',
          500: '#ff8a65',
          600: '#ffa726',
          700: '#8d6e63',
          800: '#5d4037',
        },
        // Light theme colors
        light: {
          bg: '#fdfbfb',
          bgSecondary: '#ebedee',
          bgTertiary: '#f5e6d3',
          card: 'rgba(255, 255, 255, 0.7)',
          cardBorder: 'rgba(255, 255, 255, 0.8)',
          text: '#5d4037',
          textSecondary: '#8d6e63',
        },
        // Dark theme colors
        dark: {
          bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          card: 'rgba(30, 30, 50, 0.8)',
          cardBorder: 'rgba(100, 100, 150, 0.3)',
          text: '#e8e8e8',
          textSecondary: '#a0a0a0',
        },
        success: {
          400: '#a5d6a7',
          500: '#81c784',
        },
        error: {
          400: '#ef9a9a',
          500: '#e57373',
        }
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 50%, #f5e6d3 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}