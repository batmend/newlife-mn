import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette from the logo (public site and portal). forest-700 = wordmark #056839,
        // forest-500 → sprout-500 = leaf gradient, clay-400 = cross #C49A6C.
        // On white, use forest-600+ / clay-600+ / sage-500+ for text (AA contrast);
        // lighter shades are for fills, borders and decoration only.
        forest: {
          50: "#eef7f1",
          100: "#d6ecdd",
          200: "#acd8bb",
          300: "#79bd90",
          400: "#3fa262",
          500: "#209947",
          600: "#0e7f40",
          700: "#056839",
          800: "#05532e",
          900: "#054326",
          950: "#022515",
        },
        sprout: {
          100: "#eef7e1",
          200: "#d9eebc",
          300: "#bde08c",
          400: "#a3d364",
          500: "#8bc542",
          600: "#6ea42f",
          700: "#557f25",
        },
        clay: {
          50: "#fbf7f2",
          100: "#f5ecdf",
          200: "#ead7bf",
          300: "#dcbd97",
          400: "#c49a6c",
          500: "#ad8052",
          600: "#8f6641",
          700: "#704f33",
          800: "#553c28",
        },
        sage: {
          50: "#f6f8f6",
          100: "#edf1ee",
          200: "#dce3de",
          300: "#c2ccc5",
          400: "#96a39a",
          500: "#6b7a70",
          600: "#526057",
          700: "#3c4841",
          800: "#27312b",
          900: "#17201b",
          950: "#0c120e",
        },
      },
      fontFamily: {
        // Variables come from app/fonts.ts (next/font), set on each layout's <html>.
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "ui-sans-serif", "system-ui"],
        // Condensed face echoing the logo wordmark: eyebrows, labels, numbers.
        brand: ["var(--font-roboto-condensed)", "var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.9s ease-out forwards",
        "slow-zoom": "slowZoom 20s ease-in-out infinite alternate",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slowZoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
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
