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
    clime: "#C8E52C",
    caqua: "#189877",
    cgreen: "#093631",
    csemigreen: "#09433c",
    clightgreen: "#0d4d4675",
    clightgray: "#202C33",
    cgray: "#111B21",
    cblack: "#0c0f14",
   },
   fontFamily: {
    satoshi: ["var(--font-satoshi)"],
    inter: ["Inter", "sans-serif"],
   },
  },
 },
 darkMode: "class",
 plugins: [],
};
export default config;
