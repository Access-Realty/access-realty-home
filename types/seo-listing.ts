// ABOUTME: Shared type for all SEO listing components (card, popup, map, grid)
// ABOUTME: Intentionally separate from MlsListing — stripped to SEO-relevant fields only

export interface SeoListingProps {
  listingId: string
  address: string
  city: string
  postalCode: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number | null
  status: string            // mls_status value (Active, Closed, Pending, Active Option Contract, etc.)
  date: string              // ISO date string (status_change_timestamp or listing_contract_date)
  photoUrl: string | null   // First photo URL only — not the full array
  latitude: number
  longitude: number
  concessions: number | null // Seller concessions amount (from bridge_raw_data->ConcessionsAmount)
  highlighted?: boolean     // True when corresponding map pin is active
}
