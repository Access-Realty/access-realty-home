// ABOUTME: Service layer for fetching MLS listings from Supabase (SERVER-ONLY)
// ABOUTME: Uses indexed (mls_name, list_office_key) for efficient queries
//
// MLS KEY REFERENCE: See docs/MLS_KEYS_REFERENCE.md for full documentation
// Quick ref: staff.member_key stores human-readable "Agt ID" (e.g., "0549418")
//            We filter by list_agent_mls_id which uses the same format
//
// NOTE: For client-side formatting utilities, use @/lib/listing-utils instead

import "server-only";
import { supabase } from "./supabase";
import type { MlsListing, ListingsFilter, ListingsResponse } from "@/types/mls";

// Edge function URL for downloading photos
const PHOTO_DOWNLOAD_FUNCTION_URL =
  "https://hvbicnpvactgxzprnygc.supabase.co/functions/v1/download-listing-photos";

// Supabase anon key for edge function auth
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// MLS name for our market (North Texas)
const MLS_NAME = "ntreis2";

// Access Realty office keys - maps office_mls_id to list_office_key
// These are used with the (mls_name, list_office_key) index for fast queries
// Note: mls_offices table doesn't have these records, so we store keys directly
const ACCESS_REALTY_OFFICES: Record<string, string> = {
  PRSG01: "f9ade7bc6f5509b67ac0776d255d46dc",
};

// Default office MLS IDs to query
export const ACCESS_REALTY_OFFICE_MLS_IDS = Object.keys(ACCESS_REALTY_OFFICES);

// Minimal type for triggering photo downloads
interface ListingWithPhotos {
  id: string;
  photo_urls: string[] | null;
  photos_stored: boolean | null;
}

/**
 * Trigger photo downloads for listings that don't have photos stored locally.
 * Fires edge function calls asynchronously (fire-and-forget) to not block page load.
 * Photos will be available from our CDN on subsequent page loads.
 *
 * NOTE: Only runs at runtime, not during static build (SSG).
 */
function triggerPhotoDownloads(listings: ListingWithPhotos[]): void {
  // Skip during static generation (build time) - only run at runtime
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return;
  }

  // Filter to listings that need photos downloaded
  const needsDownload = listings.filter(
    (listing) => listing.photos_stored !== true && listing.photo_urls?.length
  );

  if (needsDownload.length === 0) return;

  console.log(`Triggering photo download for ${needsDownload.length} listings`);

  // Fire-and-forget: trigger downloads without awaiting
  for (const listing of needsDownload) {
    fetch(PHOTO_DOWNLOAD_FUNCTION_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mls_listing_id: listing.id }),
    }).catch((err) => {
      // Log but don't throw - this is background work
      console.error(`Failed to trigger photo download for ${listing.id}:`, err);
    });
  }
}

// Fields to select for listing queries (keeps response lean)
const LISTING_SELECT_FIELDS = `
  id,
  listing_id,
  listing_key,
  list_price,
  original_list_price,
  bedrooms_total,
  bathrooms_total_decimal,
  bathrooms_full,
  bathrooms_half,
  living_area,
  lot_size_acres,
  lot_size_sqft,
  year_built,
  stories,
  garage_spaces,
  parking_total,
  pool_private_yn,
  association_yn,
  fireplaces_total,
  county_or_parish,
  elementary_school,
  middle_or_junior_school,
  high_school,
  unparsed_address,
  street_number,
  street_name,
  street_suffix,
  city,
  state_or_province,
  postal_code,
  subdivision_name,
  standard_status,
  property_type,
  property_sub_type,
  photo_urls,
  thumbnail_urls,
  photos_count,
  photos_stored,
  public_remarks,
  list_agent_key,
  list_agent_mls_id,
  list_office_mls_id,
  latitude,
  longitude,
  on_market_date
`;

/**
 * Get office_keys from our static mapping
 * (mls_offices table doesn't have these records)
 */
function getOfficeKeys(officeMlsIds: string[]): string[] {
  return officeMlsIds
    .map((id) => ACCESS_REALTY_OFFICES[id])
    .filter((key): key is string => key !== undefined);
}

/**
 * Fetch listings with optional filters and pagination
 * Uses indexed (mls_name, list_office_key) for efficient queries
 */
export async function getListings(
  filter: ListingsFilter = {},
  limit = 12,
  offset = 0
): Promise<ListingsResponse> {
  const {
    officeIds = ACCESS_REALTY_OFFICE_MLS_IDS,
    agentKey,
    status = "Active",
    minPrice,
    maxPrice,
    minBeds,
    minBaths,
    propertyType,
  } = filter;

  // Get office_keys from our static mapping to use indexed query
  const officeKeys = getOfficeKeys(officeIds);

  if (officeKeys.length === 0) {
    console.error("No office keys found for:", officeIds);
    return { listings: [], total: 0, hasMore: false };
  }

  let query = supabase
    .from("mls_listings")
    .select(LISTING_SELECT_FIELDS, { count: "exact" })
    .eq("mls_name", MLS_NAME)
    .in("list_office_key", officeKeys)
    .in("standard_status", status === "Active" ? ["Active", "Pending", "Active Under Contract"] : [status])
    .neq("property_type", "Residential Lease") // Exclude rentals
    .order("list_price", { ascending: false });

  // Apply optional filters
  if (agentKey) {
    query = query.eq("list_agent_mls_id", agentKey);
  }
  if (minPrice !== undefined) {
    query = query.gte("list_price", minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte("list_price", maxPrice);
  }
  if (minBeds !== undefined) {
    query = query.gte("bedrooms_total", minBeds);
  }
  if (minBaths !== undefined) {
    query = query.gte("bathrooms_total_decimal", minBaths);
  }
  if (propertyType) {
    query = query.eq("property_type", propertyType);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], total: 0, hasMore: false };
  }

  const total = count ?? 0;
  const hasMore = offset + limit < total;

  const listings = (data as MlsListing[]) ?? [];

  // Trigger background photo downloads for listings without stored photos
  triggerPhotoDownloads(listings);

  return {
    listings,
    total,
    hasMore,
  };
}

/**
 * Fetch a single listing by listing_id (for detail pages)
 */
export async function getListingById(
  listingId: string
): Promise<MlsListing | null> {
  const { data, error } = await supabase
    .from("mls_listings")
    .select(LISTING_SELECT_FIELDS)
    .eq("mls_name", MLS_NAME)
    .eq("listing_id", listingId)
    .single();

  if (error) {
    console.error("Error fetching listing:", error);
    return null;
  }

  const listing = data as MlsListing;

  // Trigger background photo download if needed
  if (listing) {
    triggerPhotoDownloads([listing]);
  }

  return listing;
}

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

// Minimal fields for map markers (keeps response small)
const MAP_SELECT_FIELDS = `
  id,
  listing_id,
  list_price,
  unparsed_address,
  city,
  bedrooms_total,
  bathrooms_total_decimal,
  living_area,
  latitude,
  longitude,
  photo_urls,
  photos_stored
`;

export interface ClosedDeal {
  id: string;
  listing_id: string | null;
  list_price: number | null;
  unparsed_address: string | null;
  city: string | null;
  bedrooms_total: number | null;
  bathrooms_total_decimal: number | null;
  living_area: number | null;
  latitude: number | null;
  longitude: number | null;
  photo_urls: string[] | null;
  photos_stored: boolean | null;
  side: "listing" | "buyer";
}

/**
 * Look up an agent's member_key hash from their MLS ID
 */
async function getAgentMemberKey(agentMlsId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("mls_agents")
    .select("member_key")
    .eq("member_mls_id", agentMlsId)
    .single();

  if (error || !data) {
    console.error("Error fetching agent member_key:", error);
    return null;
  }

  return data.member_key;
}

/**
 * Fetch all closed deals for an agent (for map display)
 * Includes both listing-side (as seller's agent) and buyer-side deals
 */
export async function getClosedDeals(agentMlsId: string): Promise<ClosedDeal[]> {
  // Fetch listing-side deals (where agent represented the seller)
  const listingDealsPromise = supabase
    .from("mls_listings")
    .select(MAP_SELECT_FIELDS)
    .eq("mls_name", MLS_NAME)
    .eq("list_agent_mls_id", agentMlsId)
    .eq("standard_status", "Closed")
    .neq("property_type", "Residential Lease")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("list_price", { ascending: false });

  // Look up agent's member_key for buyer-side query
  const memberKey = await getAgentMemberKey(agentMlsId);

  // Fetch buyer-side deals (where agent represented the buyer)
  let buyerDeals: ClosedDeal[] = [];
  if (memberKey) {
    const { data: buyerData, error: buyerError } = await supabase
      .from("mls_listings")
      .select(MAP_SELECT_FIELDS)
      .eq("mls_name", MLS_NAME)
      .eq("buyer_agent_key", memberKey)
      .eq("standard_status", "Closed")
      .neq("property_type", "Residential Lease")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("list_price", { ascending: false });

    if (buyerError) {
      console.error("Error fetching buyer deals:", buyerError);
    } else if (buyerData) {
      buyerDeals = (buyerData as Omit<ClosedDeal, "side">[]).map((deal) => ({
        ...deal,
        side: "buyer" as const,
      }));
    }
  }

  const { data: listingData, error: listingError } = await listingDealsPromise;

  if (listingError) {
    console.error("Error fetching listing deals:", listingError);
  }

  const listingDeals: ClosedDeal[] = listingData
    ? (listingData as Omit<ClosedDeal, "side">[]).map((deal) => ({
        ...deal,
        side: "listing" as const,
      }))
    : [];

  // Combine and dedupe (in case agent was on both sides - rare but possible)
  const allDeals = [...listingDeals, ...buyerDeals];
  const uniqueDeals = allDeals.filter(
    (deal, index, self) =>
      index === self.findIndex((d) => d.id === deal.id)
  );

  // Sort by price descending
  const sortedDeals = uniqueDeals.sort((a, b) => (b.list_price || 0) - (a.list_price || 0));

  // Trigger background photo downloads for deals without stored photos
  triggerPhotoDownloads(sortedDeals);

  return sortedDeals;
}
