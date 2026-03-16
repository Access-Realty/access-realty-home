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
  original_list_price,
  bedrooms_total,
  bathrooms_total_decimal,
  living_area,
  year_built,
  garage_spaces,
  parking_total,
  latitude,
  longitude,
  mls_status,
  status_change_timestamp,
  listing_contract_date,
  photo_urls,
  photos_count,
  bridge_raw_data->ConcessionsAmount
`

function computeDom(statusChangeTimestamp: string | null, listingContractDate: string | null): number | null {
  if (!listingContractDate) return null
  const end = statusChangeTimestamp ? new Date(statusChangeTimestamp) : new Date()
  const start = new Date(listingContractDate)
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return days >= 0 ? days : null
}

// Exported for testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformListings(data: any[]): SeoListingProps[] {
  return data.map((row) => ({
    listingId: row.listing_id,
    address: row.unparsed_address,
    city: row.city,
    postalCode: row.postal_code,
    price: Number(row.list_price),
    originalPrice: row.original_list_price ? Number(row.original_list_price) : null,
    bedrooms: row.bedrooms_total,
    bathrooms: Number(row.bathrooms_total_decimal),
    sqft: row.living_area,
    yearBuilt: row.year_built,
    parking: row.garage_spaces ?? row.parking_total ?? null,
    status: row.mls_status,
    date: row.status_change_timestamp || row.listing_contract_date,
    dom: computeDom(row.status_change_timestamp, row.listing_contract_date),
    photoUrl: row.photo_urls?.[0] ?? null,
    photosCount: row.photos_count ?? row.photo_urls?.length ?? 0,
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
 * 1. Query mls_listings linked to this parcel via parcel_id FK (the canonical association)
 *    - Prefer Active listings (current photos), then most recent with photos
 * 2. Fallback: Google Street View Static API
 *
 * NOTE: Does NOT match by coordinates — that produces false positives in dense neighborhoods.
 * The parcel_id FK is maintained by database triggers (queue_parcel_stub_for_listing).
 */
export async function getPropertyHeroImage(
  parcelId: string,
  lat: number,
  lng: number,
): Promise<{ url: string; source: 'mls' | 'streetview' }> {
  // Prefer Active listing photos (most current)
  const { data: activeData } = await supabase
    .from('mls_listings')
    .select('photo_urls')
    .eq('parcel_id', parcelId)
    .in('mls_status', ['Active', 'Active Option Contract', 'Active Contingent', 'Pending'])
    .not('photo_urls', 'is', null)
    .order('status_change_timestamp', { ascending: false })
    .limit(1)

  const activePhoto = activeData?.[0]?.photo_urls?.[0]
  if (activePhoto) {
    return { url: activePhoto, source: 'mls' }
  }

  // Fall back to most recent listing with photos for this parcel
  const { data } = await supabase
    .from('mls_listings')
    .select('photo_urls')
    .eq('parcel_id', parcelId)
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

const MIN_ACTIVE = 8
const MIN_CLOSED = 16
const MAX_RADIUS = 5 // miles
const STEP = 0.25    // mile increments when expanding

export interface NearbyListingsGroup {
  listings: SeoListingProps[]
  radiusMiles: number
}

export interface NearbyListingsResult {
  active: NearbyListingsGroup
  closed: NearbyListingsGroup
}

/**
 * Fetch nearby listings for a property page — two independent adaptive searches.
 * - Active: start 0.5mi, need 8+, expand in 0.25mi steps
 * - Closed (last 12 months): start 0.5mi, need 16+, expand in 0.25mi steps
 * Each search runs independently — active might stay at 0.5mi while closed expands to 2mi.
 * Both sorted by distance to subject property.
 */
export async function getListingsNearby(
  lat: number,
  lng: number,
): Promise<NearbyListingsResult> {
  const twelveMonthsAgo = new Date(
    Date.now() - 365 * 24 * 60 * 60 * 1000
  ).toISOString()

  // Run both adaptive searches in parallel
  const [active, closed] = await Promise.all([
    adaptiveSearch(lat, lng, 'active', MIN_ACTIVE, twelveMonthsAgo),
    adaptiveSearch(lat, lng, 'closed', MIN_CLOSED, twelveMonthsAgo),
  ])

  return { active, closed }
}

async function adaptiveSearch(
  lat: number,
  lng: number,
  type: 'active' | 'closed',
  minResults: number,
  twelveMonthsAgo: string,
): Promise<NearbyListingsGroup> {
  for (let radius = 0.5; radius <= MAX_RADIUS; radius += STEP) {
    const results = await fetchAtRadius(lat, lng, radius, type, twelveMonthsAgo)
    if (results.length >= minResults || radius + STEP > MAX_RADIUS) {
      return { listings: sortByDistance(results, lat, lng), radiusMiles: radius }
    }
  }
  return { listings: [], radiusMiles: MAX_RADIUS }
}

function sortByDistance(listings: SeoListingProps[], lat: number, lng: number): SeoListingProps[] {
  return listings.sort((a, b) => {
    const distA = (a.latitude - lat) ** 2 + (a.longitude - lng) ** 2
    const distB = (b.latitude - lat) ** 2 + (b.longitude - lng) ** 2
    return distA - distB
  })
}

async function fetchAtRadius(
  lat: number,
  lng: number,
  radiusMiles: number,
  type: 'active' | 'closed',
  twelveMonthsAgo: string,
): Promise<SeoListingProps[]> {
  const latDelta = radiusMiles / 69.0
  const lngDelta = radiusMiles / (69.0 * Math.cos(lat * Math.PI / 180))

  let query = supabase
    .from('mls_listings')
    .select(SEO_LISTING_FIELDS)
    .gte('latitude', lat - latDelta)
    .lte('latitude', lat + latDelta)
    .gte('longitude', lng - lngDelta)
    .lte('longitude', lng + lngDelta)
    .not('property_type', 'in', `(${LEASE_TYPES.join(',')})`)

  if (type === 'active') {
    query = query
      .in('mls_status', ACTIVE_STATUSES)
      .order('list_price', { ascending: false })
  } else {
    query = query
      .eq('mls_status', 'Closed')
      .gte('status_change_timestamp', twelveMonthsAgo)
      .order('status_change_timestamp', { ascending: false })
  }

  const { data, error } = await query.limit(50)

  if (error) {
    console.warn(`Error fetching nearby ${type} listings:`, error)
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
