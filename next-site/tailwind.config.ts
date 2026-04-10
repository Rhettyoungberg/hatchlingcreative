import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#08080f",
        accent: {
          indigo: "#818cf8",
          violet: "#c084fc",
          dim: "rgba(129,140,248,0.5)",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
