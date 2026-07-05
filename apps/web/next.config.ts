import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

function r2PublicHostname(): string | undefined {
  const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

const r2Hostname = r2PublicHostname();

const nextConfig: NextConfig = {
  devIndicators: isDev ? { position: "bottom-left" } : false,
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      ...(r2Hostname
        ? [
            {
              protocol: "https" as const,
              hostname: r2Hostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
