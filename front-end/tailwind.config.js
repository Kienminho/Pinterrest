/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        bevietnampro: ['"Be Vietnam Pro"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        barlow: ['"Barlow Condensed"', 'san-serif'],
        roboto: ['"Roboto"', 'sans-serif']
      },
      colors: {
        primary_henry: '#16405B',
        dark_color: '#333333',
        light_sid: '#dafff6',
        dark_sid: '#006b6c',
        light_explore: '#ffdfe9',
        dark_explore: '#c32f00',
        gray_input: '#efefef'
      }
    }
  },
  plugins: [require('flowbite/plugin')]
}
