import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true, // TEMPORARY FIX
  },
  /* config options here */
};

export default nextConfig;
