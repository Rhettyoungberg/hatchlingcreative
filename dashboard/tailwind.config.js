/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#08080f",
        panel: "#0f0f1a",
        line: "rgba(255,255,255,0.08)",
        accent: {
          indigo: "#818cf8",
          violet: "#c084fc",
          dim: "rgba(129,140,248,0.5)",
        },
        status: {
          new: "#818cf8",
          triaged: "#c084fc",
          progress: "#fbbf24",
          done: "#34d399",
          wont: "#6b7280",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
