import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          pink: "#EC4899",
          purple: "#8B5CF6",
          rose: "#F43F5E",
          violet: "#7C3AED",
          dark: "#09090D",
          surface: "#12121A",
          card: "#171722",
          border: "rgba(255, 255, 255, 0.08)",
        },
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(236, 72, 153, 0.25), rgba(139, 92, 246, 0.15), transparent 70%)",
        "card-gradient": "linear-gradient(180deg, rgba(23, 23, 34, 0.8) 0%, rgba(15, 15, 22, 0.95) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
