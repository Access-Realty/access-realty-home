// ABOUTME: Next.js configuration with Sentry integration and cross-project rewrites
// ABOUTME: Wraps config with withSentryConfig for source maps and auto-instrumentation

import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Build-time env var set per Vercel environment scope (Production vs Preview).
// Determines which app project deployment receives cross-project rewrites.
// Missing in deployed environments → fail loud so staging never silently proxies production.
const appOrigin = process.env.APP_REWRITE_ORIGIN;
if (!appOrigin && process.env.VERCEL) {
  throw new Error(
    "APP_REWRITE_ORIGIN is required on Vercel. " +
      "Set it in Project Settings → Environment Variables for each scope (Production, Preview)."
  );
}

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
    if (!appOrigin) return [];
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

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
});
