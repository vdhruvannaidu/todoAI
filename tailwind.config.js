/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          '50': '#f2f6fc',
          '100': '#e2eaf7',
          '200': '#cbdaf2',
          '300': '#a8c3e8',
          '400': '#7ea4dc',
          '500': '#5f86d2',
          '600': '#4a6bc4',
          '700': '#415ab4',
          '800': '#3a4b93',
          '900': '#334175',
          '950': '#232948',
        }
      }
    },
  },
  plugins: [],
}

