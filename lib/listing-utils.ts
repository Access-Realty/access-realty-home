// ABOUTME: Pure utility functions for formatting MLS listing data
// ABOUTME: Safe for client-side use - no Supabase or server dependencies

import type { MlsListing } from "@/types/mls";

/**
 * Format price for display (e.g., "$425,000")
 */
export function formatPrice(price: number | null): string {
  if (price === null) return "Price TBD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format beds/baths for display (e.g., "3 bd | 2 ba")
 */
export function formatBedsBaths(
  beds: number | null,
  baths: number | null
): string {
  const bedStr = beds !== null ? `${beds} bd` : null;
  const bathStr = baths !== null ? `${baths} ba` : null;

  if (bedStr && bathStr) return `${bedStr} | ${bathStr}`;
  if (bedStr) return bedStr;
  if (bathStr) return bathStr;
  return "";
}

/**
 * Format square footage for display (e.g., "2,450 sqft")
 */
export function formatSqft(sqft: number | null): string {
  if (sqft === null) return "";
  return `${sqft.toLocaleString()} sqft`;
}

/**
 * Format address for display, preferring unparsed_address
 */
export function formatAddress(listing: MlsListing): string {
  if (listing.unparsed_address) {
    return listing.unparsed_address;
  }

  // Fallback to constructing from parts
  const parts = [
    listing.street_number,
    listing.street_name,
    listing.street_suffix,
  ].filter(Boolean);

  return parts.join(" ") || "Address Not Available";
}

/**
 * Format city, state for display (e.g., "Austin, TX")
 */
export function formatCityState(listing: MlsListing): string {
  const parts = [listing.city, listing.state_or_province].filter(Boolean);
  return parts.join(", ");
}

/**
 * Get the primary photo URL with fallback
 */
export function getPrimaryPhoto(listing: MlsListing): string {
  if (listing.photo_urls && listing.photo_urls.length > 0) {
    return listing.photo_urls[0];
  }
  // Fallback placeholder
  return "/placeholder-home.jpg";
}

/**
 * Format property type for display badge
 */
export function formatPropertyType(type: string | null): string {
  if (!type) return "";

  // Common property type mappings
  const typeMap: Record<string, string> = {
    Residential: "Home",
    "Residential Lease": "For Rent",
    Land: "Land",
    Commercial: "Commercial",
    "Multi-Family": "Multi-Family",
  };

  return typeMap[type] || type;
}
