/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007BFF", // Bleu Sportif
        secondary: "#28C76F", // Vert Dynamique
        light: "#F8F9FA", // Gris Clair
        muted: "#E9ECEF", // Gris Doux
        dark: "#343A40", // Gris Anthracite
        danger: "#FF4D4F", // Rouge Alerte
      },
    },
  },
  plugins: [],
};
