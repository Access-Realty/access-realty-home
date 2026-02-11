import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect old access.realty/direct-list URLs to direct-list.com
      {
        source: "/direct-list",
        has: [{ type: "host", value: "access.realty" }],
        destination: "https://direct-list.com",
        permanent: true,
      },
      {
        source: "/direct-list/:path*",
        has: [{ type: "host", value: "access.realty" }],
        destination: "https://direct-list.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
