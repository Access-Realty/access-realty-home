import type { NextConfig } from "next";

// Build-time env var set per Vercel environment scope (Production vs Preview).
// Determines which app project deployment receives cross-project rewrites.
const appOrigin =
  process.env.APP_REWRITE_ORIGIN ??
  "https://access-realty-app-brets-projects-ea090dc4.vercel.app";

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
  async rewrites() {
    return [
      { source: "/app/:path*", destination: `${appOrigin}/app/:path*` },
      { source: "/crm/:path*", destination: `${appOrigin}/crm/:path*` },
      { source: "/buyers/:path*", destination: `${appOrigin}/buyers/:path*` },
      { source: "/api/:path*", destination: `${appOrigin}/api/:path*` },
      { source: "/photos/:path*", destination: `${appOrigin}/photos/:path*` },
      { source: "/assets/:path*", destination: `${appOrigin}/assets/:path*` },
      {
        source: "/favicons/:path*",
        destination: `${appOrigin}/favicons/:path*`,
      },
      {
        source: "/watermarks/:path*",
        destination: `${appOrigin}/watermarks/:path*`,
      },
    ];
  },
};

export default nextConfig;
