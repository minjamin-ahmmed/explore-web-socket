import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "0.9rem",
        md: "0.7rem",
        sm: "0.5rem",
      },
      boxShadow: {
        "soft-elevated":
          "0 18px 45px rgba(15, 15, 15, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.02)",
      },
    },
  },
  plugins: [],
};

export default config;


