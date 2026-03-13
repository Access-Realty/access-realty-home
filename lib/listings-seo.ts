// ABOUTME: Supabase query functions for SEO property pages
// ABOUTME: Queries mls_listings by geography (zip, city, county, bounding box)
// NOTE: Uses the lazy supabase proxy — safe during build (returns empty data)

import 'server-only'
import { supabase } from './supabase'
import type { SeoListingProps } from '@/types/seo-listing'

const MLS_NAME = 'ntreis2'

const SEO_LISTING_FIELDS = `
  listing_id,
  unparsed_address,
  city,
  postal_code,
  list_price,
  bedrooms_total,
  bathrooms_total_decimal,
  living_area,
  latitude,
  longitude,
  standard_status,
  status_change_timestamp,
  listing_contract_date,
  photo_urls
`

// Exported for testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformListings(data: any[]): SeoListingProps[] {
  return data.map((row) => ({
    listingId: row.listing_id,
    address: row.unparsed_address,
    city: row.city,
    postalCode: row.postal_code,
    price: Number(row.list_price),
    bedrooms: row.bedrooms_total,
    bathrooms: Number(row.bathrooms_total_decimal),
    sqft: row.living_area,
    status: row.standard_status,
    date: row.status_change_timestamp || row.listing_contract_date,
    photoUrl: row.photo_urls?.[0] ?? null,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
  }))
}

function baseQuery() {
  const twelveMonthsAgo = new Date(
    Date.now() - 365 * 24 * 60 * 60 * 1000
  ).toISOString()

  return supabase
    .from('mls_listings')
    .select(SEO_LISTING_FIELDS)
    .eq('mls_name', MLS_NAME)
    .eq('standard_status', 'Closed')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .gte('status_change_timestamp', twelveMonthsAgo)
    .order('status_change_timestamp', { ascending: false })
}

export async function getClosedListingsByZip(zip: string): Promise<SeoListingProps[]> {
  const { data, error } = await baseQuery().eq('postal_code', zip).limit(2000)
  if (error) {
    console.warn('Error fetching listings by zip:', error)
    return []
  }
  return transformListings(data ?? [])
}

export async function getClosedListingsByCity(city: string): Promise<SeoListingProps[]> {
  const { data, error } = await baseQuery().eq('city', city).limit(5000)
  if (error) {
    console.warn('Error fetching listings by city:', error)
    return []
  }
  return transformListings(data ?? [])
}

export async function getClosedListingsByCounty(county: string): Promise<SeoListingProps[]> {
  const { data, error } = await baseQuery()
    .eq('county_or_parish', county)
    .limit(5000)
  if (error) {
    console.warn('Error fetching listings by county:', error)
    return []
  }
  return transformListings(data ?? [])
}

export async function getClosedListingsNearby(
  lat: number,
  lng: number,
  radiusMiles = 15,
  maxResults = 200
): Promise<SeoListingProps[]> {
  const { data, error } = await supabase
    .rpc('get_nearby_closed_listings', {
      center_lat: lat,
      center_lng: lng,
      radius_miles: radiusMiles,
      max_results: maxResults,
    })

  if (error) {
    console.warn('Error fetching nearby listings:', error)
    return []
  }
  return transformListings(data ?? [])
}

export async function getClosedListingsByBoundingBox(
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  limit = 5000
): Promise<SeoListingProps[]> {
  const { data, error } = await baseQuery()
    .gte('latitude', bounds.minLat)
    .lte('latitude', bounds.maxLat)
    .gte('longitude', bounds.minLng)
    .lte('longitude', bounds.maxLng)
    .limit(limit)
  if (error) {
    console.warn('Error fetching listings by bounding box:', error)
    return []
  }
  return transformListings(data ?? [])
}
