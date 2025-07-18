/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizeCss: false,
  },
  webpack: (config: import('webpack').Configuration, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.plugins = [...(config.plugins ?? [])]
    }
    return config
  },
}

export default nextConfig