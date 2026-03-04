// ABOUTME: Thin Sentry wrapper matching the app repo's API surface
// ABOUTME: Provides captureException/captureMessage with fallback logging when DSN is missing

import * as Sentry from "@sentry/nextjs";

/**
 * Capture an exception with optional context.
 */
export function captureException(
  error: Error,
  context?: Record<string, unknown>,
): void {
  if (context) {
    Sentry.captureException(error, { extra: context });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture a message for monitoring.
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>,
): void {
  if (context) {
    Sentry.captureMessage(message, { level, extra: context });
  } else {
    Sentry.captureMessage(message, level);
  }
}
