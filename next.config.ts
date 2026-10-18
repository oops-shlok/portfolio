import type { NextConfig } from "next";

// Static export: `npm run build` writes a plain HTML site to out/,
// deployable to Vercel, Netlify, Cloudflare Pages or GitHub Pages.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
