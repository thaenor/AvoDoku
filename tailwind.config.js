/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#FFFFFF',
        'text-primary': '#000000',
        'grid-thick': '#000000',
        'grid-thin': '#374151',
        'cell-selected': '#1E40AF',
        'cell-selected-text': '#FFFFFF',
        'cell-related': '#DBEAFE',
        'text-user': '#2563EB',
        'text-given': '#000000',
        'error-bg': '#FEE2E2',
        'error-text': '#991B1B',
      },
      fontFamily: {
        handwriting: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}