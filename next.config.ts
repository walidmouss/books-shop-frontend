import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Explicitly set the workspace root to avoid lockfile root inference
    root: process.cwd(),
  },
};

export default nextConfig;
