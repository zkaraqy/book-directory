/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.{html, js}"],
  theme: {
    extend: {
      keyframes: {
        shows: {
          "0%, 100%": { bottom: "-100%" },
          "10%": { bottom: "16px" },
          "90%": { bottom: "16px" },
        },
      },
      animation: {
        shows: "shows 5s ease-in-out 1",
      },
      fontFamily: {
        arial: ["Arial", "sans-serif"],
      },
      colors: {
        "dark-theme-primary": "#BB86FC",
        "dark-theme-primary-variant": "#3700B3",
        "dark-theme-secondary": "#03DAC6",
        "dark-theme-background": "#121212",
        "dark-theme-surface": "#121212",
        "dark-theme-error": "#CF6679",
        "dark-theme-on-primary": "#000",
        "dark-theme-on-secondary": "#000",
        "dark-theme-on-background": "#FFF",
        "dark-theme-on-surface": "#FFF",
        "dark-theme-on-error": "#000",
        "light-theme-primary": "#6200EE",
        "light-theme-primary-variant": "#3700B3",
        "light-theme-secondary": "#03DAC6",
        "light-theme-secondary-variant": "#018786",
        "light-theme-background": "#FFF",
        "light-theme-surface": "#FFF",
        "light-theme-error": "#B00020",
        "light-theme-on-primary": "#FFF",
        "light-theme-on-secondary": "#000",
        "light-theme-on-background": "#000",
        "light-theme-on-surface": "#000",
        "light-theme-on-error": "#FFF",
      },
    },
  },
  plugins: [require("daisyui")],
};
