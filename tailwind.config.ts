import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./tests/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          950: "rgb(var(--brand-950) / <alpha-value>)"
        },
        surface: {
          base: "rgb(var(--surface-base) / <alpha-value>)",
          alt: "rgb(var(--surface-alt) / <alpha-value>)",
          card: "rgb(var(--surface-card) / <alpha-value>)"
        },
        border: {
          subtle: "rgb(var(--border-subtle) / <alpha-value>)"
        },
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)"
        }
      },
      boxShadow: {
        soft: "0 20px 40px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
