// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // Ensure all JS, JSX, TS, and TSX files are included
  ],
  theme: {
    extend: {
      // Pulse for loading animation
      keyframes: {
        pulse1: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
        },
        pulse2: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
        },
        pulse3: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
        },
      },
      animation: {
        pulse1: 'pulse1 1s ease-in-out infinite',
        pulse2: 'pulse2 1s ease-in-out infinite 0.2s',
        pulse3: 'pulse3 1s ease-in-out infinite 0.4s',
      },
    },
  },
  plugins: [],
  plugins: [],
}
