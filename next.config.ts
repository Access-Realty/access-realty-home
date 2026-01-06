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
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "direct-list.com" }],
        destination: "https://access.realty/direct-list",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.direct-list.com" }],
        destination: "https://access.realty/direct-list",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
