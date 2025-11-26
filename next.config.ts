import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "m.media-amazon.com",
        port: "",
        protocol: "https",
      },
      {
        hostname: "ik.imagekit.io",
        port: "",
        protocol: "https"
      }
    ]
  },
  env: {
    databaseUrl: process.env.DATABASE_URL,
  }
};

export default nextConfig;
