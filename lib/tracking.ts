// ABOUTME: UTM attribution tracking with first-touch protection
// ABOUTME: Persists tracking data in localStorage for cross-page/session attribution

const STORAGE_KEY = "access_tracking";

// UTM and click ID parameters we track
export interface TrackingParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_url?: string;
  captured_at?: string;
}

// Stored tracking data with first and latest touch
export interface StoredTracking {
  first_touch?: TrackingParams;
  latest_touch?: TrackingParams;
}

// Campaign types that are NOT eligible for first-touch attribution
// These campaigns target existing visitors/leads, so credit goes to original source
const NON_FIRST_TOUCH_TERMS = ["nurture", "remarketing"];

/**
 * Check if tracking params are eligible to set first-touch attribution.
 * Only prospecting (cold traffic) campaigns can set first-touch.
 */
export function isFirstTouchEligible(params: TrackingParams): boolean {
  const term = params.utm_term?.toLowerCase();
  if (!term) return true; // No term = default to prospecting behavior
  return !NON_FIRST_TOUCH_TERMS.includes(term);
}

/**
 * Check if params contain any UTM or click ID data worth storing
 */
export function hasTrackingParams(params: TrackingParams): boolean {
  return !!(
    params.utm_source ||
    params.utm_medium ||
    params.utm_campaign ||
    params.utm_term ||
    params.utm_content ||
    params.gclid ||
    params.fbclid
  );
}

/**
 * Extract tracking parameters from current URL
 */
export function captureFromUrl(): TrackingParams {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);

  return {
    utm_source: searchParams.get("utm_source") || undefined,
    utm_medium: searchParams.get("utm_medium") || undefined,
    utm_campaign: searchParams.get("utm_campaign") || undefined,
    utm_term: searchParams.get("utm_term") || undefined,
    utm_content: searchParams.get("utm_content") || undefined,
    gclid: searchParams.get("gclid") || undefined,
    fbclid: searchParams.get("fbclid") || undefined,
    landing_url: window.location.href,
  };
}

/**
 * Get stored tracking data from localStorage
 */
export function getStoredTracking(): StoredTracking {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as StoredTracking;
  } catch {
    return {};
  }
}

/**
 * Save tracking params to localStorage with attribution logic:
 * - First touch: Only set if eligible (prospecting) AND not already set
 * - Latest touch: Always updated when we have tracking params
 */
export function saveToStorage(params: TrackingParams): void {
  if (typeof window === "undefined") return;
  if (!hasTrackingParams(params)) return;

  const now = new Date().toISOString();
  const paramsWithTimestamp = { ...params, captured_at: now };

  const stored = getStoredTracking();

  // First touch: only set if eligible AND not already set
  if (isFirstTouchEligible(params) && !stored.first_touch) {
    stored.first_touch = paramsWithTimestamp;
  }

  // Latest touch: always update when we have tracking params
  stored.latest_touch = paramsWithTimestamp;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // localStorage might be full or disabled - fail silently
  }
}

/**
 * Capture tracking params from URL and save with attribution logic.
 * Call this on every page load.
 */
export function captureAndSave(): void {
  const params = captureFromUrl();
  saveToStorage(params);
}

/**
 * Clear all stored tracking data.
 * Useful for testing or when a lead converts.
 */
export function clearTracking(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently
  }
}
