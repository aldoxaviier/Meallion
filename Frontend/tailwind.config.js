/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors : {
        primary: {
          400: "#8C1007",
          500: "#660B05",
          600: "#3E0703",
        },
        secondary : {
          300: "#FFF0C4",
          400: "#F2E8C6",
          500: "#DAD4B5",
        },
        third : {
          500: "#056066",
        }
      },
      fontFamily: {
        fogsta: ['Fogsta'],
        "brsegma-600": ['BRSegma-600'],
        "brsegma-500": ['BRSegma-500'],
        "brsegma-300": ['BRSegma-300'],
      },
    },
  },
  plugins: [],
}