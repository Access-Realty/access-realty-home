// ABOUTME: Service layer for fetching MLS listings from Supabase (SERVER-ONLY)
// ABOUTME: Uses indexed (mls_name, list_office_key) for efficient queries
//
// MLS KEY REFERENCE: See docs/MLS_KEYS_REFERENCE.md for full documentation
// Quick ref: staff.member_key stores the Bridge API hash (e.g., "f0f41567d56826d793512e7742f46dbe")
//            We filter by list_agent_key which uses the same hash format
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
 * When agentKey is provided, includes listings where agent is primary OR co-listing agent
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

  // Apply agent filter (primary listing agent OR co-listing agent)
  // agentKey is the member_key hash from staff table
  if (agentKey) {
    query = query.or(`list_agent_key.eq.${agentKey},co_list_agent_key.eq.${agentKey}`);
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
 * Format volume for display, rounded to nearest 100K (e.g., "$12.4M")
 */
export function formatVolume(amount: number | null): string {
  if (amount === null || amount === 0) return "$0";

  // Round to nearest 100K
  const rounded = Math.round(amount / 100000) * 100000;

  if (rounded >= 1000000) {
    const millions = rounded / 1000000;
    // Always show one decimal for consistency ($1.0M, $11.4M)
    return `$${millions.toFixed(1)}M`;
  }

  // Under 1M, show in K
  const thousands = rounded / 1000;
  return `$${thousands.toFixed(0)}K`;
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
  state_or_province,
  postal_code,
  bedrooms_total,
  bathrooms_total_decimal,
  living_area,
  latitude,
  longitude,
  photo_urls,
  photos_stored
`;

export interface ClosedListing {
  id: string;
  listing_id: string | null;
  list_price: number | null;
  unparsed_address: string | null;
  city: string | null;
  state_or_province: string | null;
  postal_code: string | null;
  bedrooms_total: number | null;
  bathrooms_total_decimal: number | null;
  living_area: number | null;
  latitude: number | null;
  longitude: number | null;
  photo_urls: string[] | null;
  photos_stored: boolean | null;
  side: "listing" | "buyer" | "off_market";
}

/**
 * Fetch all closed listings for a staff member (for map display)
 * Combines MLS data (via member_key) and imported historical deals (via staff_id)
 * @param staffId - The staff UUID from staff table
 */
export async function getClosedListings(staffId: string): Promise<ClosedListing[]> {
  // First, get member_key for MLS queries
  const { data: staffData } = await supabase
    .from("staff")
    .select("member_key")
    .eq("id", staffId)
    .single();

  const memberKey = staffData?.member_key;

  // Fetch MLS deals (only if staff has a member_key)
  let mlsDeals: ClosedListing[] = [];
  if (memberKey) {
    mlsDeals = await getMlsClosedListings(memberKey);
  }

  // Fetch imported historical deals with parcel coordinates
  // Note: Supabase defaults to 1000 row limit, so we explicitly set higher
  const { data: importedData, error: importedError } = await supabase
    .from("staff_imported_listings")
    .select(`
      id,
      listing_id,
      close_price,
      raw_address,
      raw_city,
      side,
      parcels(latitude, longitude)
    `)
    .eq("staff_id", staffId)
    .not("parcel_id", "is", null)
    .limit(10000);

  let importedDeals: ClosedListing[] = [];
  if (importedError) {
    console.error("Error fetching imported deals:", importedError);
  } else if (importedData) {
    // Type for the joined parcel data (single object from FK relationship)
    type ParcelData = { latitude: number | null; longitude: number | null } | null;

    importedDeals = importedData
      .filter((deal) => {
        // Supabase returns single object for FK joins (not array)
        const parcel = deal.parcels as unknown as ParcelData;
        return parcel?.latitude && parcel?.longitude;
      })
      .map((deal) => {
        const parcel = deal.parcels as unknown as { latitude: number; longitude: number };
        return {
          id: deal.id,
          listing_id: deal.listing_id,
          list_price: deal.close_price,
          unparsed_address: deal.raw_address,
          city: deal.raw_city,
          state_or_province: "TX", // Imported deals are all Texas
          postal_code: null,
          bedrooms_total: null,
          bathrooms_total_decimal: null,
          living_area: null,
          latitude: parcel.latitude,
          longitude: parcel.longitude,
          photo_urls: null,
          photos_stored: null,
          side: deal.side as "listing" | "buyer" | "off_market",
        };
      });
  }

  // Combine MLS and imported deals
  const allDeals = [...mlsDeals, ...importedDeals];

  // Dedupe by listing_id (imported deals may overlap with MLS data)
  const seenListingIds = new Set<string>();
  const uniqueDeals = allDeals.filter((deal) => {
    if (!deal.listing_id) return true; // Keep deals without listing_id
    if (seenListingIds.has(deal.listing_id)) return false;
    seenListingIds.add(deal.listing_id);
    return true;
  });

  // Sort by price descending
  const sortedDeals = uniqueDeals.sort((a, b) => (b.list_price || 0) - (a.list_price || 0));

  // Trigger background photo downloads for MLS deals without stored photos
  triggerPhotoDownloads(sortedDeals.filter((d) => d.photo_urls !== null));

  return sortedDeals;
}

/**
 * Fetch closed listings from MLS data (internal helper)
 */
async function getMlsClosedListings(agentMemberKey: string): Promise<ClosedListing[]> {
  // Fetch listing-side deals (where agent was primary listing agent)
  const listingDealsPromise = supabase
    .from("mls_listings")
    .select(MAP_SELECT_FIELDS)
    .eq("mls_name", MLS_NAME)
    .eq("list_agent_key", agentMemberKey)
    .eq("standard_status", "Closed")
    .neq("property_type", "Residential Lease")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("list_price", { ascending: false });

  // Fetch co-listing deals (where agent was co-listing agent)
  const { data: coListData, error: coListError } = await supabase
    .from("mls_listings")
    .select(MAP_SELECT_FIELDS)
    .eq("mls_name", MLS_NAME)
    .eq("co_list_agent_key", agentMemberKey)
    .eq("standard_status", "Closed")
    .neq("property_type", "Residential Lease")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("list_price", { ascending: false });

  let coListingDeals: ClosedListing[] = [];
  if (coListError) {
    console.error("Error fetching co-listing deals:", coListError);
  } else if (coListData) {
    // Co-listing is still listing-side (representing seller)
    coListingDeals = (coListData as Omit<ClosedListing, "side">[]).map((deal) => ({
      ...deal,
      side: "listing" as const,
    }));
  }

  // Fetch buyer-side deals (where agent represented the buyer)
  const { data: buyerData, error: buyerError } = await supabase
    .from("mls_listings")
    .select(MAP_SELECT_FIELDS)
    .eq("mls_name", MLS_NAME)
    .eq("buyer_agent_key", agentMemberKey)
    .eq("standard_status", "Closed")
    .neq("property_type", "Residential Lease")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("list_price", { ascending: false });

  let buyerDeals: ClosedListing[] = [];
  if (buyerError) {
    console.error("Error fetching buyer deals:", buyerError);
  } else if (buyerData) {
    buyerDeals = (buyerData as Omit<ClosedListing, "side">[]).map((deal) => ({
      ...deal,
      side: "buyer" as const,
    }));
  }

  const { data: listingData, error: listingError } = await listingDealsPromise;

  if (listingError) {
    console.error("Error fetching listing deals:", listingError);
  }

  const listingDeals: ClosedListing[] = listingData
    ? (listingData as Omit<ClosedListing, "side">[]).map((deal) => ({
        ...deal,
        side: "listing" as const,
      }))
    : [];

  // Combine and dedupe (agent may appear in multiple roles on same listing)
  const allDeals = [...listingDeals, ...coListingDeals, ...buyerDeals];
  const uniqueDeals = allDeals.filter(
    (deal, index, self) =>
      index === self.findIndex((d) => d.id === deal.id)
  );

  return uniqueDeals;
}

/**
 * Fetch all closed listings for the entire company (all staff members)
 * Used for the company-wide track record map on /our-team
 */
export async function getCompanyClosedListings(): Promise<ClosedListing[]> {
  // TODO: May need to filter by is_active flag in the future
  // Get all staff with their member_keys
  const { data: staffData, error: staffError } = await supabase
    .from("staff")
    .select("id, member_key");

  if (staffError || !staffData) {
    console.error("Error fetching staff:", staffError);
    return [];
  }

  // Separate staff with and without member_keys
  const staffWithMemberKey = staffData.filter((s) => s.member_key);
  const memberKeys = staffWithMemberKey.map((s) => s.member_key!);
  const allStaffIds = staffData.map((s) => s.id);

  // Batch query: MLS listings where any staff member was involved
  let mlsDeals: ClosedListing[] = [];
  if (memberKeys.length > 0) {
    // Listing-side deals
    const { data: listingData } = await supabase
      .from("mls_listings")
      .select(MAP_SELECT_FIELDS)
      .eq("mls_name", MLS_NAME)
      .in("list_agent_key", memberKeys)
      .eq("standard_status", "Closed")
      .neq("property_type", "Residential Lease")
      .not("latitude", "is", null)
      .not("longitude", "is", null);

    // Co-listing deals
    const { data: coListData } = await supabase
      .from("mls_listings")
      .select(MAP_SELECT_FIELDS)
      .eq("mls_name", MLS_NAME)
      .in("co_list_agent_key", memberKeys)
      .eq("standard_status", "Closed")
      .neq("property_type", "Residential Lease")
      .not("latitude", "is", null)
      .not("longitude", "is", null);

    // Buyer-side deals
    const { data: buyerData } = await supabase
      .from("mls_listings")
      .select(MAP_SELECT_FIELDS)
      .eq("mls_name", MLS_NAME)
      .in("buyer_agent_key", memberKeys)
      .eq("standard_status", "Closed")
      .neq("property_type", "Residential Lease")
      .not("latitude", "is", null)
      .not("longitude", "is", null);

    const listingDeals: ClosedListing[] = (listingData || []).map((d) => ({
      ...(d as Omit<ClosedListing, "side">),
      side: "listing" as const,
    }));

    const coListingDeals: ClosedListing[] = (coListData || []).map((d) => ({
      ...(d as Omit<ClosedListing, "side">),
      side: "listing" as const,
    }));

    const buyerDeals: ClosedListing[] = (buyerData || []).map((d) => ({
      ...(d as Omit<ClosedListing, "side">),
      side: "buyer" as const,
    }));

    // Dedupe by id (same listing shouldn't appear multiple times)
    const allMls = [...listingDeals, ...coListingDeals, ...buyerDeals];
    mlsDeals = allMls.filter(
      (deal, index, self) => index === self.findIndex((d) => d.id === deal.id)
    );
  }

  // Batch query: Imported historical deals for all staff
  // Note: Supabase defaults to 1000 row limit, so we explicitly set higher
  const { data: importedData } = await supabase
    .from("staff_imported_listings")
    .select(`
      id,
      listing_id,
      close_price,
      raw_address,
      raw_city,
      side,
      parcels(latitude, longitude)
    `)
    .in("staff_id", allStaffIds)
    .not("parcel_id", "is", null)
    .limit(10000);

  type ParcelData = { latitude: number | null; longitude: number | null } | null;

  const importedDeals: ClosedListing[] = (importedData || [])
    .filter((deal) => {
      const parcel = deal.parcels as unknown as ParcelData;
      return parcel?.latitude && parcel?.longitude;
    })
    .map((deal) => {
      const parcel = deal.parcels as unknown as { latitude: number; longitude: number };
      return {
        id: deal.id as string,
        listing_id: deal.listing_id,
        list_price: deal.close_price,
        unparsed_address: deal.raw_address,
        city: deal.raw_city,
        state_or_province: "TX",
        postal_code: null,
        bedrooms_total: null,
        bathrooms_total_decimal: null,
        living_area: null,
        latitude: parcel.latitude,
        longitude: parcel.longitude,
        photo_urls: null,
        photos_stored: null,
        side: deal.side as "listing" | "buyer" | "off_market",
      };
    });

  // Combine MLS and imported - dedupe imported that overlap with MLS
  const allDeals = [...mlsDeals, ...importedDeals];
  const seenListingIds = new Set<string>();
  const uniqueDeals = allDeals.filter((deal) => {
    if (!deal.listing_id) return true;
    if (seenListingIds.has(deal.listing_id)) return false;
    seenListingIds.add(deal.listing_id);
    return true;
  });

  return uniqueDeals;
}
