import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only applies to `next dev`. Production (`next build` + `next start`) never shows this UI.
  devIndicators: false,
};

export default nextConfig;
