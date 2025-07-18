/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
    experimental: {
    optimizeCss: false, // Disable Lightning CSS
  },
  typescript: {
    ignoreBuildErrors: true, // Also ignore TypeScript errors if needed
  },
}

module.exports = nextConfig



