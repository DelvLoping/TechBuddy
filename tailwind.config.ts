import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#B2CDFC",
        secondary: "#B7BBC0",
        success: "#AAE8BF",
        info: "#A4E2EE",
        warning: "#F8E1A7",
        danger: "#F9B6B5",
        light: "#FAFBFB",
        dark: "#A0A3A8",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
