import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF6B00",
          hover: "#FF8533",
          dim: "rgba(255,107,0,0.10)",
          glow: "rgba(255,107,0,0.20)",
        },
        surface: {
          bg: "#0a0a0c",
          raised: "#111114",
          card: "#16181c",
          cardHover: "#1c1e22",
          element: "#1e2024",
        },
        border: {
          DEFAULT: "#2a2a2f",
          light: "#38383f",
        },
        text: {
          primary: "#e7e9ea",
          secondary: "#71767b",
          tertiary: "#536471",
        },
        status: {
          success: "#10b981",
          successDim: "rgba(16,185,129,0.10)",
          error: "#ef4444",
          errorDim: "rgba(239,68,68,0.10)",
          warning: "#f59e0b",
          warningDim: "rgba(245,158,11,0.10)",
          info: "#3b82f6",
          infoDim: "rgba(59,130,246,0.10)",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'SF Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
