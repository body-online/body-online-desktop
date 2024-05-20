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
    clime: "#D7FB05",
    caqua: "#189877",
    cgreen: "#093631",
   },
   fontFamily: {
    satoshi: ["var(--font-satoshi)"],
    inter: ["Inter", "sans-serif"],
   },
  },
 },
 plugins: [],
};
export default config;
