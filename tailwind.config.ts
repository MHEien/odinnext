import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf6f3",
          100: "#f8e8e1",
          200: "#f2d0c4",
          300: "#e7af9c",
          400: "#dc846c",
          500: "#cb5a3e",
          600: "#b84b2f",
          700: "#983527",
          800: "#7c2d24",
          900: "#652821",
          950: "#351210",
        },
        secondary: {
          50: "#fbf7f1",
          100: "#f5ebdc",
          200: "#e9d3b8",
          300: "#dbb68d",
          400: "#c19a6b",
          500: "#b48654",
          600: "#a37447",
          700: "#87593b",
          800: "#6e4834",
          900: "#5b3c2d",
          950: "#311e16",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-cinzel)"],
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
};

export default config;
