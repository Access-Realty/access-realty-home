// ABOUTME: Sentry server-side initialization for Next.js API routes and server components
// ABOUTME: Captures server errors with environment detection from VERCEL_ENV

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.VERCEL_ENV || "development",

    // No performance tracing for serverless
    tracesSampleRate: 0,

    beforeSend(event) {
      // Filter expected errors
      if (event.exception?.values?.[0]?.type === "AbortError") {
        return null;
      }
      return event;
    },
  });
}
