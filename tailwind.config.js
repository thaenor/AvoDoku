/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#FEFEFE',
        'text-primary': '#1A1A1A',
        'grid-thick': '#1A1A1A',
        'grid-thin': '#9CA3AF',
        'cell-selected': '#E3F2FD',
        'cell-related': '#F3F4F6',
        'text-user': '#1976D2',
        'text-given': '#424242',
        'error-soft': '#FEE2E2',
      },
    },
  },
  plugins: [],
}