// ABOUTME: Next.js instrumentation hook for Sentry server/edge initialization
// ABOUTME: Called by Next.js on startup to register monitoring

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
