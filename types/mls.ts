// ABOUTME: TypeScript types for MLS listing display on the marketing site
// ABOUTME: Focused subset of full mls_listings table for frontend use

export interface MlsListing {
  id: string;
  listing_id: string | null;
  listing_key: string;

  // Pricing
  list_price: number | null;
  original_list_price: number | null;

  // Property details
  bedrooms_total: number | null;
  bathrooms_total_decimal: number | null;
  bathrooms_full: number | null;
  bathrooms_half: number | null;
  living_area: number | null;
  lot_size_acres: number | null;
  lot_size_sqft: number | null;
  year_built: number | null;
  stories: number | null;
  garage_spaces: number | null;
  parking_total: number | null;
  pool_private_yn: boolean | null;
  association_yn: boolean | null;
  fireplaces_total: number | null;
  county_or_parish: string | null;

  // Schools
  elementary_school: string | null;
  middle_or_junior_school: string | null;
  high_school: string | null;

  // Address
  unparsed_address: string | null;
  street_number: string | null;
  street_name: string | null;
  street_suffix: string | null;
  city: string | null;
  state_or_province: string | null;
  postal_code: string | null;
  subdivision_name: string | null;

  // Status & type
  standard_status: string | null;
  property_type: string | null;
  property_sub_type: string | null;

  // Media
  photo_urls: string[] | null;
  thumbnail_urls: string[] | null;
  photos_count: number | null;
  photos_stored: boolean | null;

  // Description
  public_remarks: string | null;

  // Agent/Office
  list_agent_key: string | null;
  list_agent_mls_id: string | null;
  list_office_mls_id: string | null;

  // Location
  latitude: number | null;
  longitude: number | null;

  // Dates
  on_market_date: string | null;
}

// Filter options for listings queries
export interface ListingsFilter {
  officeIds?: string[];
  agentKey?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  propertyType?: string;
}

// Paginated response
export interface ListingsResponse {
  listings: MlsListing[];
  total: number;
  hasMore: boolean;
}
