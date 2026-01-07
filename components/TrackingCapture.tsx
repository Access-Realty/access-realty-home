// ABOUTME: Site-wide component that captures UTM params on every page load
// ABOUTME: Placed in root layout to run on all pages

"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAndSave } from "@/lib/tracking";

/**
 * Invisible component that captures UTM tracking params on every page.
 * Place in root layout to ensure tracking works across all pages.
 *
 * Uses useSearchParams to re-run when URL params change (e.g., client-side nav).
 */
export function TrackingCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Capture and save tracking params with attribution logic
    captureAndSave();
  }, [pathname, searchParams]);

  // No UI - this component only handles side effects
  return null;
}
