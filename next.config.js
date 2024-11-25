const withPWA = require("@ducanh2912/next-pwa").default({
 cacheOnFrontEndNav: true,
 display: "standalone",
 aggressiveFrontEndNavCaching: true,
 reloadOnOnline: true,
 swcMinify: true,
 dest: "public",
 fallbacks: {
  //   document: "/offline",
  //image: "/static/images/fallback.png",
  //   font: '/static/font/fallback.woff2',
  // audio: ...,
  // video: ...,
 },
 workboxOptions: {
  disableDevLogs: true,
 },
 // ... other options you like
});
/** @type {import('next').NextConfig} */
const nextConfig = {
 reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
