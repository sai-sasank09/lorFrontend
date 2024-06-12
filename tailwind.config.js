/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",


    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: ["light", "coffee", "pastel", "bumblebee"],
  },
  plugins: [require("daisyui")],
}