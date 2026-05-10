/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'zen-blue': '#f0f7ff', // Une couleur douce pour ton thème santé mentale
      },
    },
  },
  plugins: [],
};