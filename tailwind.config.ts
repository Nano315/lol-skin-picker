import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,css}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#09090b",
        panel: "rgba(20, 20, 25, 0.4)",
        ink: "#f8fafc",
        muted: "#9ca3af",
        accent: {
          DEFAULT: "#8b5cf6",
          strong: "#a855f7",
          soft: "rgba(139, 92, 246, 0.5)",
        },
        glass: {
          surface: "rgba(20, 20, 25, 0.4)",
          border: "rgba(255, 255, 255, 0.1)",
          highlight: "rgba(255, 255, 255, 0.15)",
          shine: "rgba(255, 255, 255, 0.05)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-dim":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "glow-radial":
          "radial-gradient(ellipse at top, rgba(139,92,246,0.18) 0%, transparent 55%)",
      },
      boxShadow: {
        glass: "0 20px 70px rgba(0, 0, 0, 0.55)",
        "glass-hover": "0 25px 90px rgba(0, 0, 0, 0.7)",
        "accent-glow": "0 10px 50px -10px rgba(139, 92, 246, 0.6)",
        "accent-glow-strong": "0 15px 60px -8px rgba(168, 85, 247, 0.75)",
        "hero-frame": "0 30px 120px -20px rgba(139, 92, 246, 0.5)",
      },
      animation: {
        "float-slow": "float 14s ease-in-out infinite",
        "pulse-slow": "pulseSoft 6s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.85" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
