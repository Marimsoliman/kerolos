import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-inter-tight)", "Inter Tight", "Inter", "system-ui", "sans-serif"], // ✅ Inter Tight
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      colors: {
        white: {
          DEFAULT: "#FFFFFF",
          50: "#FAFAFA",
          100: "#F5F5F5",
        },
        black: {
          DEFAULT: "#000000",
          100: "#111111",
          200: "#1A1A1A",
          300: "#2A2A2A",
        },
        gray: {
          DEFAULT: "#6B6B6B",
          light: "#9A9A9A",
          lighter: "#C5C5C5",
        },
      },
    },
  },
  plugins: [],
};

export default config;