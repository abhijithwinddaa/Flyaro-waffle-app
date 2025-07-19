module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a0522d',
          600: '#8b4513',
          700: '#6f3609',
          800: '#5d2f08',
          900: '#4a2606',
        },
        secondary: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fafafa',
          300: '#f7f7f7',
          400: '#f3f3f3',
          500: '#e5e5e5',
          600: '#d4d4d4',
          700: '#a3a3a3',
          800: '#737373',
          900: '#525252',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.3s ease-in-out',
        'scale-up': 'scale-up 0.2s ease-in-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'scale-up': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}