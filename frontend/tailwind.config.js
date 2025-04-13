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
        'float-up-down': 'floatUpDown 3s ease-in-out infinite',
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
          '0%': { transform: 'translateY(0px) rotate(var(--initial-rotation))' },
          '50%': { transform: 'translateY(-20px) rotate(var(--initial-rotation))' },
          '100%': { transform: 'translateY(0px) rotate(var(--initial-rotation))' },
        },
        'fadeOut': {
          '0%': { opacity: '0.5', transform: 'scale(1)', filter: 'blur(0px)' },
          '100%': { opacity: '0', transform: 'scale(1.4)', filter: 'blur(2px)' },
        },
        'floatUpDown': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-404': 'linear-gradient(135deg,rgb(155, 155, 155),rgb(123, 123, 123),rgb(100, 100, 100))',
      },
      textShadow: {
        'behind': '4px 4px 8px rgba(45, 45, 45, 1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
};
