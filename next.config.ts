import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: false,
  },
  images: {
    domains: ['i.imgur.com', 'lh3.googleusercontent.com'],
  },
};
export default nextConfig;
