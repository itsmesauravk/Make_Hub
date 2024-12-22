/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
   
      colors: {
        primary: "#F3043A",
        secondary: "#2E2265",
        background: "#FBFBFB",
        'primary-dark': '#D22D3D',
      },
    },
  },
  plugins: [],
}
