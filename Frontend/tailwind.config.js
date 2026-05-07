/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", 
  theme: {
    extend: {
      colors : {
        primary: {
          400: "#8C1007",
          500: "#660B05",
          600: "#3E0703",
        },
        secondary : {
          200: "#FFF9E7",
          300: "#FFF0C4",
          400: "#F2E8C6",
          500: "#eddca1",
        },
        third : {
          500: "#10b981",
        },
        // Themed Dark Mode Colors
        background: {
          dark: "#1A0A0A",
          darker: "#120505",
        },
        surface: {
          dark: "#2D1110",
          darker: "#240C0B",
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