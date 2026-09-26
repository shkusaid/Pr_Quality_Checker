import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gh-bg": "#0d1117",
        "gh-surface": "#161b22",
        "gh-border": "#30363d",
        "gh-text": "#e6edf3",
        "gh-muted": "#8b949e",
        "gh-accent": "#7c5cd8",
        "gh-accent-hover": "#9370f0",
        "gh-blue": "#58a6ff",
        "gh-green": "#3fb950",
        "gh-red": "#f85149",
        "gh-yellow": "#e3b341",
        "gh-orange": "#d29922",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
