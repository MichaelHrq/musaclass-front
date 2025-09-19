import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev", "192.168.1.13"],
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "musaclass.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev.musaclass.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.musaclass.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mcfilesdev.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
