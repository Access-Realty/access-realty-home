// ABOUTME: Sentry client-side initialization for the marketing site
// ABOUTME: Captures browser errors with breadcrumbs, filters extension noise

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

function getEnvironment(): string {
  if (typeof window === "undefined") return "unknown";
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") return "development";
  if (hostname.includes("vercel.app") || hostname.includes("preview")) return "preview";
  return "production";
}

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: getEnvironment(),

    // No performance tracing — just error capture
    tracesSampleRate: 0,

    beforeSend(event, hint) {
      const error = hint.originalException;

      // Don't send errors from browser extensions
      if (
        event.exception?.values?.[0]?.stacktrace?.frames?.some(
          (frame) => frame.filename?.includes("extension://"),
        )
      ) {
        return null;
      }

      // Don't send errors from analytics/tracking services
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
          message.includes("posthog") ||
          message.includes("analytics") ||
          message.includes("gtag")
        ) {
          return null;
        }
      }

      return event;
    },

    integrations: [
      Sentry.breadcrumbsIntegration({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        xhr: true,
      }),
    ],
  });
}
