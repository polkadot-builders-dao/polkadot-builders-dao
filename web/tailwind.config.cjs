const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        initial: "initial",
        inherit: "inherit",
        transparent: "transparent",
        current: "currentColor",
        white: "#fafafa",
        black: "#171717",
        // polkadot shade, base color is #E6007A
        polkadot: {
          50: "#FFE6F0",
          100: "#FFCCE1",
          200: "#FF99C3",
          300: "#FF66A4",
          400: "#FF3386",
          500: "#E6007A",
          600: "#B30066",
          700: "#800053",
          800: "#4D002F",
          900: "#1A001C",
          DEFAULT: "#E6007A",
        },
        primary: "#E6007A",
      },
      fontFamily: {
        sans: ["'Unbounded'", "cursive", ...defaultTheme.fontFamily.sans],
        mono: ["'Anonymous Pro'", "monospace", ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "spin": "spin 2s linear infinite",
      },
    },
  },
  plugins: [],
}
