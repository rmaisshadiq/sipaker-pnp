import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    databaseUrl: process.env.DATABASE_URL,
  }
};

export default nextConfig;
