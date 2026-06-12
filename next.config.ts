import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  devIndicators: isDev ? { position: "bottom-left" } : false,
};

export default nextConfig;
