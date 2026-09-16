import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://backend:8000/api/:path*",
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
