/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
};

module.exports = config;
