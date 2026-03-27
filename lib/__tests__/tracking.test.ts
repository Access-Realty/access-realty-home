// ABOUTME: Unit tests for UTM attribution tracking with first-touch protection
// ABOUTME: Tests isFirstTouchEligible, hasTrackingParams, captureFromUrl, saveToStorage

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  isFirstTouchEligible,
  hasTrackingParams,
  captureFromUrl,
  saveToStorage,
  getStoredTracking,
  clearTracking,
  type TrackingParams,
} from "../tracking";

// ---------------------------------------------------------------------------
// localStorage mock
// ---------------------------------------------------------------------------
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((_i: number) => null),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

// ---------------------------------------------------------------------------
// window.location helper
// ---------------------------------------------------------------------------
function setLocation(url: string) {
  const parsed = new URL(url);
  Object.defineProperty(window, "location", {
    value: {
      href: parsed.href,
      search: parsed.search,
      origin: parsed.origin,
      pathname: parsed.pathname,
    },
    writable: true,
    configurable: true,
  });
}

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
  setLocation("https://access.realty/");
});

// ---------------------------------------------------------------------------
// isFirstTouchEligible
// ---------------------------------------------------------------------------
describe("isFirstTouchEligible", () => {
  it("returns true when no utm_term is present", () => {
    expect(isFirstTouchEligible({ utm_source: "google" })).toBe(true);
  });

  it("returns true for a prospecting campaign term", () => {
    expect(isFirstTouchEligible({ utm_term: "sell_house_fast" })).toBe(true);
  });

  it("returns false for a nurture campaign", () => {
    expect(isFirstTouchEligible({ utm_term: "nurture" })).toBe(false);
  });

  it("returns false for a remarketing campaign", () => {
    expect(isFirstTouchEligible({ utm_term: "remarketing" })).toBe(false);
  });

  it("is case-insensitive (NURTURE)", () => {
    expect(isFirstTouchEligible({ utm_term: "NURTURE" })).toBe(false);
  });

  it("is case-insensitive (Remarketing)", () => {
    expect(isFirstTouchEligible({ utm_term: "Remarketing" })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// hasTrackingParams
// ---------------------------------------------------------------------------
describe("hasTrackingParams", () => {
  it("returns false for empty params", () => {
    expect(hasTrackingParams({})).toBe(false);
  });

  it("returns true when utm_source is present", () => {
    expect(hasTrackingParams({ utm_source: "google" })).toBe(true);
  });

  it("returns true when utm_medium is present", () => {
    expect(hasTrackingParams({ utm_medium: "cpc" })).toBe(true);
  });

  it("returns true when utm_campaign is present", () => {
    expect(hasTrackingParams({ utm_campaign: "spring_sale" })).toBe(true);
  });

  it("returns true when gclid is present", () => {
    expect(hasTrackingParams({ gclid: "abc123" })).toBe(true);
  });

  it("returns true when fbclid is present", () => {
    expect(hasTrackingParams({ fbclid: "fb_xyz" })).toBe(true);
  });

  it("returns false when only landing_url or captured_at is present", () => {
    expect(
      hasTrackingParams({
        landing_url: "https://access.realty",
        captured_at: "2026-01-01",
      }),
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// captureFromUrl
// ---------------------------------------------------------------------------
describe("captureFromUrl", () => {
  it("extracts UTM params from the URL", () => {
    setLocation(
      "https://access.realty/?utm_source=google&utm_medium=cpc&utm_campaign=spring",
    );
    const params = captureFromUrl();
    expect(params.utm_source).toBe("google");
    expect(params.utm_medium).toBe("cpc");
    expect(params.utm_campaign).toBe("spring");
    expect(params.landing_url).toBe(
      "https://access.realty/?utm_source=google&utm_medium=cpc&utm_campaign=spring",
    );
  });

  it("extracts gclid and fbclid", () => {
    setLocation("https://access.realty/?gclid=gc123&fbclid=fb456");
    const params = captureFromUrl();
    expect(params.gclid).toBe("gc123");
    expect(params.fbclid).toBe("fb456");
  });

  it("returns undefined for missing params (not empty string)", () => {
    setLocation("https://access.realty/");
    const params = captureFromUrl();
    expect(params.utm_source).toBeUndefined();
    expect(params.gclid).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// saveToStorage + getStoredTracking + clearTracking
// ---------------------------------------------------------------------------
describe("saveToStorage", () => {
  it("does nothing when params have no tracking data", () => {
    saveToStorage({});
    expect(getStoredTracking()).toEqual({});
  });

  it("sets original_touch on first eligible save", () => {
    const params: TrackingParams = {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "brand",
    };
    saveToStorage(params);

    const stored = getStoredTracking();
    expect(stored.original_touch).toBeDefined();
    expect(stored.original_touch!.utm_source).toBe("google");
    expect(stored.original_touch!.captured_at).toBeDefined();
  });

  it("sets latest_touch on every save", () => {
    saveToStorage({ utm_source: "google" });
    saveToStorage({ utm_source: "facebook" });

    const stored = getStoredTracking();
    expect(stored.latest_touch!.utm_source).toBe("facebook");
  });

  it("does NOT overwrite original_touch on second eligible visit", () => {
    saveToStorage({ utm_source: "google", utm_medium: "cpc" });
    saveToStorage({ utm_source: "bing", utm_medium: "organic" });

    const stored = getStoredTracking();
    expect(stored.original_touch!.utm_source).toBe("google");
    expect(stored.latest_touch!.utm_source).toBe("bing");
  });

  describe("first-touch protection", () => {
    it("nurture campaign does NOT set original_touch", () => {
      saveToStorage({ utm_source: "email", utm_term: "nurture" });

      const stored = getStoredTracking();
      expect(stored.original_touch).toBeUndefined();
      expect(stored.latest_touch!.utm_source).toBe("email");
    });

    it("remarketing campaign does NOT set original_touch", () => {
      saveToStorage({ utm_source: "facebook", utm_term: "remarketing" });

      const stored = getStoredTracking();
      expect(stored.original_touch).toBeUndefined();
      expect(stored.latest_touch!.utm_source).toBe("facebook");
    });

    it("nurture campaign does NOT overwrite existing original_touch", () => {
      // First: prospecting visit sets original
      saveToStorage({ utm_source: "google", utm_medium: "cpc" });
      // Second: nurture visit should NOT overwrite original
      saveToStorage({
        utm_source: "email",
        utm_term: "nurture",
        utm_campaign: "drip_3",
      });

      const stored = getStoredTracking();
      expect(stored.original_touch!.utm_source).toBe("google");
      expect(stored.latest_touch!.utm_source).toBe("email");
      expect(stored.latest_touch!.utm_campaign).toBe("drip_3");
    });

    it("latest touch always updates regardless of eligibility", () => {
      saveToStorage({ utm_source: "google" });
      saveToStorage({ utm_source: "email", utm_term: "nurture" });
      saveToStorage({ utm_source: "facebook", utm_term: "remarketing" });

      const stored = getStoredTracking();
      expect(stored.latest_touch!.utm_source).toBe("facebook");
      expect(stored.latest_touch!.utm_term).toBe("remarketing");
    });
  });
});

describe("clearTracking", () => {
  it("removes all stored tracking data", () => {
    saveToStorage({ utm_source: "google" });
    expect(getStoredTracking().original_touch).toBeDefined();

    clearTracking();
    expect(getStoredTracking()).toEqual({});
  });
});
