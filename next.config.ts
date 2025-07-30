import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.1.13'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'musaclass.com.br',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'mcfilesdev.s3.amazonaws.com',
                pathname: '/**',
            },
        ],
      },
}

export default nextConfig;
