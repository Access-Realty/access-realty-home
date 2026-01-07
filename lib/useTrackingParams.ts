// ABOUTME: React hook for forms to consume stored tracking data
// ABOUTME: Returns original_touch, latest_touch for multi-touch attribution

"use client";

import { useState, useEffect } from "react";
import {
  StoredTracking,
  TrackingParams,
  getStoredTracking,
  captureFromUrl,
} from "./tracking";

export interface UseTrackingResult {
  // Attribution touches from localStorage
  originalTouch: TrackingParams | undefined;
  latestTouch: TrackingParams | undefined;
  // Current URL params (for converting touch at form submit)
  currentParams: TrackingParams;
  // Loading state (localStorage is async in useEffect)
  isReady: boolean;
}

/**
 * Hook for lead forms to get stored tracking attribution.
 *
 * Usage:
 * ```tsx
 * const { originalTouch, latestTouch, currentParams, isReady } = useTrackingParams();
 *
 * // When submitting form:
 * await fetch('/api/leads', {
 *   body: JSON.stringify({
 *     ...formData,
 *     originalTouch,
 *     latestTouch,
 *     convertingTouch: currentParams,
 *   })
 * });
 * ```
 */
export function useTrackingParams(): UseTrackingResult {
  const [stored, setStored] = useState<StoredTracking>({});
  const [currentParams, setCurrentParams] = useState<TrackingParams>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Get stored attribution from localStorage
    const storedData = getStoredTracking();
    setStored(storedData);

    // Capture current URL params for converting touch
    const urlParams = captureFromUrl();
    setCurrentParams(urlParams);

    setIsReady(true);
  }, []);

  return {
    originalTouch: stored.original_touch,
    latestTouch: stored.latest_touch,
    currentParams,
    isReady,
  };
}
