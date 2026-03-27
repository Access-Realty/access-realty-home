// ABOUTME: Unit tests for pure MLS listing formatting utilities
// ABOUTME: Tests formatPrice, formatBedsBaths, formatSqft, formatAddress, etc.

import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatBedsBaths,
  formatSqft,
  formatSpecsLine,
  formatAddress,
  formatCityState,
  getPrimaryPhoto,
  formatPropertyType,
} from "../listing-utils";
import type { MlsListing } from "@/types/mls";

// Helper to build a partial MlsListing with required fields
function makeListing(overrides: Partial<MlsListing> = {}): MlsListing {
  return {
    id: "test-id",
    listing_id: "12345",
    listing_key: "key-abc",
    list_price: null,
    original_list_price: null,
    bedrooms_total: null,
    bathrooms_total_decimal: null,
    bathrooms_full: null,
    bathrooms_half: null,
    living_area: null,
    lot_size_acres: null,
    lot_size_sqft: null,
    year_built: null,
    stories: null,
    garage_spaces: null,
    parking_total: null,
    pool_private_yn: null,
    association_yn: null,
    fireplaces_total: null,
    county_or_parish: null,
    elementary_school: null,
    middle_or_junior_school: null,
    high_school: null,
    unparsed_address: null,
    street_number: null,
    street_name: null,
    street_suffix: null,
    city: null,
    state_or_province: null,
    postal_code: null,
    subdivision_name: null,
    standard_status: null,
    property_type: null,
    property_sub_type: null,
    photo_urls: null,
    thumbnail_urls: null,
    photos_count: null,
    photos_stored: null,
    public_remarks: null,
    list_agent_key: null,
    list_agent_mls_id: null,
    list_office_mls_id: null,
    latitude: null,
    longitude: null,
    on_market_date: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// formatPrice
// ---------------------------------------------------------------------------
describe("formatPrice", () => {
  it('returns "Price TBD" for null', () => {
    expect(formatPrice(null)).toBe("Price TBD");
  });

  it("formats 425000 as $425,000", () => {
    expect(formatPrice(425000)).toBe("$425,000");
  });

  it("formats 0 as $0", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("formats large prices with commas", () => {
    expect(formatPrice(1250000)).toBe("$1,250,000");
  });
});

// ---------------------------------------------------------------------------
// formatBedsBaths
// ---------------------------------------------------------------------------
describe("formatBedsBaths", () => {
  it('formats 3 beds and 2 baths as "3 bd | 2 ba"', () => {
    expect(formatBedsBaths(3, 2)).toBe("3 bd | 2 ba");
  });

  it("returns only beds when baths is null", () => {
    expect(formatBedsBaths(3, null)).toBe("3 bd");
  });

  it("returns only baths when beds is null", () => {
    expect(formatBedsBaths(null, 2)).toBe("2 ba");
  });

  it("returns empty string when both are null", () => {
    expect(formatBedsBaths(null, null)).toBe("");
  });

  it("handles decimal baths", () => {
    expect(formatBedsBaths(4, 2.5)).toBe("4 bd | 2.5 ba");
  });
});

// ---------------------------------------------------------------------------
// formatSqft
// ---------------------------------------------------------------------------
describe("formatSqft", () => {
  it('formats 2450 as "2,450 sqft"', () => {
    expect(formatSqft(2450)).toBe("2,450 sqft");
  });

  it("returns empty string for null", () => {
    expect(formatSqft(null)).toBe("");
  });

  it("handles small values", () => {
    expect(formatSqft(800)).toBe("800 sqft");
  });
});

// ---------------------------------------------------------------------------
// formatSpecsLine
// ---------------------------------------------------------------------------
describe("formatSpecsLine", () => {
  it("joins beds, baths, sqft with middle dots", () => {
    expect(formatSpecsLine(3, 2, 2450)).toBe("3 bd \u00b7 2 ba \u00b7 2,450 sqft");
  });

  it("omits null values", () => {
    expect(formatSpecsLine(3, null, 2450)).toBe("3 bd \u00b7 2,450 sqft");
  });

  it("returns empty string when all null", () => {
    expect(formatSpecsLine(null, null, null)).toBe("");
  });

  it("returns single value when only one provided", () => {
    expect(formatSpecsLine(null, 2, null)).toBe("2 ba");
  });
});

// ---------------------------------------------------------------------------
// formatAddress
// ---------------------------------------------------------------------------
describe("formatAddress", () => {
  it("prefers unparsed_address when present", () => {
    const listing = makeListing({
      unparsed_address: "1234 Elm St",
      street_number: "1234",
      street_name: "Elm",
      street_suffix: "St",
    });
    expect(formatAddress(listing)).toBe("1234 Elm St");
  });

  it("falls back to constructed address from parts", () => {
    const listing = makeListing({
      street_number: "5678",
      street_name: "Oak",
      street_suffix: "Ave",
    });
    expect(formatAddress(listing)).toBe("5678 Oak Ave");
  });

  it("handles partial address parts", () => {
    const listing = makeListing({
      street_number: "100",
      street_name: "Main",
    });
    expect(formatAddress(listing)).toBe("100 Main");
  });

  it('returns "Address Not Available" when no parts exist', () => {
    const listing = makeListing({});
    expect(formatAddress(listing)).toBe("Address Not Available");
  });
});

// ---------------------------------------------------------------------------
// formatCityState
// ---------------------------------------------------------------------------
describe("formatCityState", () => {
  it('formats "Arlington, TX"', () => {
    const listing = makeListing({
      city: "Arlington",
      state_or_province: "TX",
    });
    expect(formatCityState(listing)).toBe("Arlington, TX");
  });

  it("returns only city when state is null", () => {
    const listing = makeListing({ city: "Dallas" });
    expect(formatCityState(listing)).toBe("Dallas");
  });

  it("returns only state when city is null", () => {
    const listing = makeListing({ state_or_province: "TX" });
    expect(formatCityState(listing)).toBe("TX");
  });

  it("returns empty string when both are null", () => {
    const listing = makeListing({});
    expect(formatCityState(listing)).toBe("");
  });
});

// ---------------------------------------------------------------------------
// getPrimaryPhoto
// ---------------------------------------------------------------------------
describe("getPrimaryPhoto", () => {
  it("returns the first photo URL", () => {
    const listing = makeListing({
      photo_urls: [
        "https://photos.example.com/1.jpg",
        "https://photos.example.com/2.jpg",
      ],
    });
    expect(getPrimaryPhoto(listing)).toBe("https://photos.example.com/1.jpg");
  });

  it("returns placeholder when photo_urls is null", () => {
    const listing = makeListing({ photo_urls: null });
    expect(getPrimaryPhoto(listing)).toBe("/placeholder-home.jpg");
  });

  it("returns placeholder when photo_urls is empty", () => {
    const listing = makeListing({ photo_urls: [] });
    expect(getPrimaryPhoto(listing)).toBe("/placeholder-home.jpg");
  });
});

// ---------------------------------------------------------------------------
// formatPropertyType
// ---------------------------------------------------------------------------
describe("formatPropertyType", () => {
  it('maps "Residential" to "Home"', () => {
    expect(formatPropertyType("Residential")).toBe("Home");
  });

  it('maps "Residential Lease" to "For Rent"', () => {
    expect(formatPropertyType("Residential Lease")).toBe("For Rent");
  });

  it('maps "Land" to "Land"', () => {
    expect(formatPropertyType("Land")).toBe("Land");
  });

  it('maps "Commercial" to "Commercial"', () => {
    expect(formatPropertyType("Commercial")).toBe("Commercial");
  });

  it('maps "Multi-Family" to "Multi-Family"', () => {
    expect(formatPropertyType("Multi-Family")).toBe("Multi-Family");
  });

  it("returns the original type when no mapping exists", () => {
    expect(formatPropertyType("Farm")).toBe("Farm");
  });

  it("returns empty string for null", () => {
    expect(formatPropertyType(null)).toBe("");
  });
});
