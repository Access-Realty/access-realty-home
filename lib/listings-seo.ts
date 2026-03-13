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
  mls_status,
  status_change_timestamp,
  listing_contract_date,
  photo_urls,
  bridge_raw_data->ConcessionsAmount
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
    status: row.mls_status,
    date: row.status_change_timestamp || row.listing_contract_date,
    photoUrl: row.photo_urls?.[0] ?? null,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    concessions: row.ConcessionsAmount ? Number(row.ConcessionsAmount) : null,
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

// Status categories — matches app repo's useCompetitiveListings pattern (NTREIS mls_status values)
const ACTIVE_STATUSES = ['Active', 'Active Option Contract', 'Active Contingent', 'Pending']
// Lease property types to exclude from all SEO queries
const LEASE_TYPES = ['Residential Lease', 'Commercial Lease']

/**
 * Fetch nearby listings for a property page: active + recent closed within radius.
 * Mirrors the app repo's useCompetitiveListings query pattern:
 * - Active statuses (no date constraint) + Closed (last 12 months via status_change_timestamp)
 * - Uses mls_status for NTREIS-specific granularity
 * - Excludes leases (Residential Lease, Commercial Lease)
 * - Two parallel bbox queries for performance on 1.4M row table
 * - At 1mi radius, bbox is ~0.015° lat — small enough that timestamp filters are fast
 */
export async function getListingsNearby(
  lat: number,
  lng: number,
  radiusMiles = 1,
  maxResults = 50
): Promise<SeoListingProps[]> {
  const latDelta = radiusMiles / 69.0
  const lngDelta = radiusMiles / (69.0 * Math.cos(lat * Math.PI / 180))
  const twelveMonthsAgo = new Date(
    Date.now() - 365 * 24 * 60 * 60 * 1000
  ).toISOString()

  // Active statuses — no date limit, exclude leases
  const activeQuery = supabase
    .from('mls_listings')
    .select(SEO_LISTING_FIELDS)
    .gte('latitude', lat - latDelta)
    .lte('latitude', lat + latDelta)
    .gte('longitude', lng - lngDelta)
    .lte('longitude', lng + lngDelta)
    .in('mls_status', ACTIVE_STATUSES)
    .not('property_type', 'in', `(${LEASE_TYPES.join(',')})`)
    .order('list_price', { ascending: false })
    .limit(maxResults)

  // Closed within last 12 months, exclude leases, most recent first
  // status_change_timestamp = best proxy for close date (close_date not in our table)
  const closedQuery = supabase
    .from('mls_listings')
    .select(SEO_LISTING_FIELDS)
    .gte('latitude', lat - latDelta)
    .lte('latitude', lat + latDelta)
    .gte('longitude', lng - lngDelta)
    .lte('longitude', lng + lngDelta)
    .eq('mls_status', 'Closed')
    .gte('status_change_timestamp', twelveMonthsAgo)
    .not('property_type', 'in', `(${LEASE_TYPES.join(',')})`)
    .order('status_change_timestamp', { ascending: false })
    .limit(maxResults)

  const [activeResult, closedResult] = await Promise.all([activeQuery, closedQuery])

  if (activeResult.error) console.warn('Error fetching active listings:', activeResult.error)
  if (closedResult.error) console.warn('Error fetching closed listings:', closedResult.error)

  return [
    ...transformListings(activeResult.data ?? []),
    ...transformListings(closedResult.data ?? []),
  ]
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
