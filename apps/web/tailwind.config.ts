import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: withAlpha("--brand-50"),
          100: withAlpha("--brand-100"),
          200: withAlpha("--brand-200"),
          300: withAlpha("--brand-300"),
          400: withAlpha("--brand-400"),
          500: withAlpha("--brand-500"),
          600: withAlpha("--brand-600"),
          700: withAlpha("--brand-700"),
          800: withAlpha("--brand-800"),
          900: withAlpha("--brand-900")
        },
        accent: {
          50: withAlpha("--accent-50"),
          100: withAlpha("--accent-100"),
          200: withAlpha("--accent-200"),
          300: withAlpha("--accent-300"),
          400: withAlpha("--accent-400")
        }
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Archivo", "sans-serif"]
      },
      boxShadow: {
        card: "0 14px 30px -20px rgb(var(--brand-900) / 0.25)",
        glow: "0 0 0 1px rgb(var(--brand-900) / 0.06), 0 18px 36px rgb(var(--brand-900) / 0.18)"
      },
      backgroundImage: {
        "hero-blend": "radial-gradient(circle at 20% 20%, rgb(var(--accent-200) / 0.22), transparent 55%), radial-gradient(circle at 80% 0%, rgb(var(--accent-300) / 0.18), transparent 55%), linear-gradient(120deg, rgb(var(--brand-50)) 0%, rgb(var(--brand-100)) 55%, rgb(var(--brand-200)) 100%)"
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: false
  }
} satisfies Config;
