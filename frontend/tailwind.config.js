/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      animation: {
        'fade-bg': 'fade-bg 1s ease-in-out',
        'fall-spin': 'fall-spin 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-shape': 'floatShape 15s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        'fade-out': 'fadeOut 2s ease-out forwards',
      },
      keyframes: {
        'fade-bg': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fall-spin': {
          '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'floatShape': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'fadeOut': {
          '0%': { opacity: '0.5', transform: 'scale(1)', filter: 'blur(0px)' },
          '100%': { opacity: '0', transform: 'scale(1.4)', filter: 'blur(2px)' },
        },
      },
    },
  },
  plugins: [],
};
