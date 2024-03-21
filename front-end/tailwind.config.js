/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
    'node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        bevietnampro: ['"Be Vietnam Pro"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        barlow: ['"Barlow Condensed"', 'san-serif'],
        roboto: ['"Roboto"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        plusjakartasans: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      colors: {
        primary_henry: '#16405B',
        dark_color: '#2c343e',
        light_sid: '#dafff6',
        dark_sid: '#006b6c',
        light_explore: '#ffdfe9',
        dark_explore: '#c32f00',
        // gray_input: '#efefef',
        gray_text: '#767676',
        gray_input: '#e9e9e9',
        purple_btn: '#6366f1',
        purple_textl: '#818cf8',
        purple_textd: '#4f46e5',
        dark_blue: '#0f172a',
        light_blue: '#1e293b',
        hover_dark: '#384454'
      }
    }
  },
  plugins: [require('flowbite/plugin')]
}
