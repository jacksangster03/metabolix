/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          0: "#05080d",
          1: "#0a0f17",
          2: "#0f1722",
        },
        accent: {
          cyan: "#5fe3ff",
          green: "#4ade80",
          amber: "#fbbf24",
          rose: "#fb7185",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(95, 227, 255, 0.15)",
      },
    },
  },
  plugins: [],
};
