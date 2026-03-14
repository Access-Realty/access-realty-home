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

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

/**
 * Get the hero image URL for a subject property.
 * 1. Try Active listing first (current photos), then most recent with photos
 * 2. Excludes leases (low prices like $2,995 are rental listings)
 * 3. Fallback: Google Street View Static API
 */
export async function getPropertyHeroImage(
  lat: number,
  lng: number,
): Promise<{ url: string; source: 'mls' | 'streetview' }> {
  // Tiny bbox (~0.001° ≈ 350ft) to find listings at this exact property
  const delta = 0.001

  // Prefer Active listing (current photos are most relevant)
  const { data: activeData } = await supabase
    .from('mls_listings')
    .select('photo_urls')
    .gte('latitude', lat - delta)
    .lte('latitude', lat + delta)
    .gte('longitude', lng - delta)
    .lte('longitude', lng + delta)
    .in('mls_status', ['Active', 'Active Option Contract', 'Active Contingent', 'Pending'])
    .not('property_type', 'in', '(Residential Lease,Commercial Lease)')
    .not('photo_urls', 'is', null)
    .order('status_change_timestamp', { ascending: false })
    .limit(1)

  const activePhoto = activeData?.[0]?.photo_urls?.[0]
  if (activePhoto) {
    return { url: activePhoto, source: 'mls' }
  }

  // Fall back to most recent listing with photos (any non-lease status)
  const { data } = await supabase
    .from('mls_listings')
    .select('photo_urls')
    .gte('latitude', lat - delta)
    .lte('latitude', lat + delta)
    .gte('longitude', lng - delta)
    .lte('longitude', lng + delta)
    .not('property_type', 'in', '(Residential Lease,Commercial Lease)')
    .not('photo_urls', 'is', null)
    .order('status_change_timestamp', { ascending: false })
    .limit(1)

  const firstPhoto = data?.[0]?.photo_urls?.[0]
  if (firstPhoto) {
    return { url: firstPhoto, source: 'mls' }
  }

  // Fallback: Google Street View
  const streetViewUrl = GOOGLE_MAPS_KEY
    ? `https://maps.googleapis.com/maps/api/streetview?size=1400x400&location=${lat},${lng}&key=${GOOGLE_MAPS_KEY}`
    : ''

  return { url: streetViewUrl, source: 'streetview' }
}

// Status categories — matches app repo's useCompetitiveListings pattern (NTREIS mls_status values)
const ACTIVE_STATUSES = ['Active', 'Active Option Contract', 'Active Contingent', 'Pending']
// Lease property types to exclude from all SEO queries
const LEASE_TYPES = ['Residential Lease', 'Commercial Lease']

const MIN_RESULTS = 20
const RADIUS_STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] // miles — 0.5mi steps

/**
 * Fetch nearby listings for a property page: active + recent closed within radius.
 * Starts at 1 mile, expands to 2mi then 5mi if fewer than 20 results.
 * - Active statuses (no date constraint) + Closed (last 12 months)
 * - Uses mls_status for NTREIS-specific granularity
 * - Excludes leases
 * - Two parallel bbox queries per radius step
 */
export async function getListingsNearby(
  lat: number,
  lng: number,
  maxResults = 50
): Promise<SeoListingProps[]> {
  const twelveMonthsAgo = new Date(
    Date.now() - 365 * 24 * 60 * 60 * 1000
  ).toISOString()

  for (const radiusMiles of RADIUS_STEPS) {
    const results = await fetchNearbyAtRadius(lat, lng, radiusMiles, twelveMonthsAgo, maxResults)
    if (results.length >= MIN_RESULTS || radiusMiles === RADIUS_STEPS[RADIUS_STEPS.length - 1]) {
      // Sort by distance to subject property (closest first)
      return results.sort((a, b) => {
        const distA = (a.latitude - lat) ** 2 + (a.longitude - lng) ** 2
        const distB = (b.latitude - lat) ** 2 + (b.longitude - lng) ** 2
        return distA - distB
      })
    }
  }
  return []
}

async function fetchNearbyAtRadius(
  lat: number,
  lng: number,
  radiusMiles: number,
  twelveMonthsAgo: string,
  maxResults: number
): Promise<SeoListingProps[]> {
  const latDelta = radiusMiles / 69.0
  const lngDelta = radiusMiles / (69.0 * Math.cos(lat * Math.PI / 180))

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

  if (activeResult.error) console.warn('Error fetching nearby listings (active):', activeResult.error)
  if (closedResult.error) console.warn('Error fetching nearby listings (closed):', closedResult.error)

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
