import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true, // TEMPORARY FIX
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  /* config options here */
};

export default nextConfig;
