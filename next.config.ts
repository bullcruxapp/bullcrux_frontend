import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'test.bullcruxapp.com',
        port: '',
        pathname: '/uploads/**',
      },
            {
        protocol: 'https',
        hostname: 'api.bullcruxapp.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
       
      
    ],
  },
};

export default nextConfig;
