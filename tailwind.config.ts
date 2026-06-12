import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steel: "#10161d", steel2: "#1a232e", panel: "#222d3a",
        line: "#313e4d", safety: "#ff7a00", "safety-d": "#e05f00",
        paint: "#1b4965",
      },
      fontFamily: {
        disp: ['"Saira Condensed"', "sans-serif"],
        body: ['Inter', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
