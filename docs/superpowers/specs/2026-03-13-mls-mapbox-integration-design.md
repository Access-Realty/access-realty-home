# MLS Data + Mapbox Integration for SEO Property Page Prototypes

**Date:** 2026-03-13
**Status:** Draft
**Scope:** Wire real MLS listing data and interactive Mapbox GL JS maps into all 5 prototype page types under `/home-values/`

---

## 1. Goals

- Replace hardcoded listing/comp data in prototypes with live `mls_listings` queries
- Replace emoji map placeholders with interactive Mapbox GL JS maps
- Keep aggregate market stats hardcoded (pending team feedback on `market_stats` table design)
- Maintain `noindex` + prototype status — this is still for team review, not production SEO

## 2. Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Map renderer | Mapbox GL JS (replacing MapLibre) | Superior default tile styles, satellite imagery, built-in clustering |
| Data source for listings | `mls_listings` only — no `parcels` join | MLS data has address, price, beds/baths/sqft, photos, lat/lng. Avoids paying for parcel data. |
| Price field | `list_price` for all statuses | For Closed listings, `list_price` reflects the final sale price (confirmed). No separate `close_price` column exists. |
| MLS filter | Always filter `mls_name = 'ntreis2'` | Matches existing query patterns in `lib/listings.ts`. Required for index usage on 1.4M row table. |
| Map rendering layer | `react-map-gl` wrapping Mapbox GL JS | Use `react-map-gl` `<Map>`, `<Source>`, `<Layer>`, `<Popup>` components — not raw `mapboxgl.*` APIs. Already installed. |
| Listing recency | Last 12 months (Closed status) | Older listings aren't useful context for home values |
| Map interaction model | Map-First, exploratory (no cross-navigation) | Pin clicks open popups on the map. Visitor stays on the page. |
| Listing cards below map | Viewport-synced | Pan/zoom the map → cards update to show what's visible |
| Agent info on cards | Excluded | Not relevant for home value context |
| Build order | Bottom-up: card → map → property page → zip → city → county → DFW | Each layer composes the previous |

## 3. Architecture

### 3.1 Component Hierarchy

```
ListingsMapSection (per-page wrapper)
├── ListingsMap (Mapbox GL JS, client component)
│   ├── Clustered markers (at high geographic levels)
│   ├── Individual pins (at neighborhood level)
│   └── ListingPopup (on pin click: photo, price, beds/baths/sqft, address)
└── ListingCardGrid (below map, viewport-synced)
    └── SeoListingCard[] (hero photo, address, price, beds/baths/sqft, status, date)
```

### 3.2 Data Flow

```
Server Component (page.tsx)
  │
  ├── Query mls_listings via Supabase (SSR)
  │   └── Filter: standard_status = 'Closed'
  │         AND status_change_timestamp > 12 months ago
  │         AND latitude/longitude IS NOT NULL
  │         AND geographic filter (zip, city, county, or bounding box)
  │
  ├── Render listing data in HTML (SEO-crawlable)
  │
  └── Pass listings[] to client component
        │
        ListingsMapSection (client component, 'use client')
          ├── Initialize Mapbox GL JS map
          ├── Add listings as GeoJSON source
          ├── Render clustered/individual markers
          ├── Track map viewport bounds (onMoveEnd)
          └── Filter ListingCardGrid to visible listings
```

### 3.3 SSR + Client Hydration Strategy

The page server component fetches all listings for the geography and renders them as static HTML (listing cards in a grid). This ensures Google can crawl the content. The `ListingsMapSection` client component then hydrates, initializing the Mapbox map and adding interactivity (viewport filtering, pin popups).

On initial load, all listings are visible in the card grid. Once the map hydrates, the cards sync to the map viewport.

## 4. Components

### 4.1 `SeoListingCard`

The atomic unit for SEO pages. Named `SeoListingCard` to avoid collision with the existing `components/listings/ListingCard.tsx` (which has a different interface, includes navigation, and is used elsewhere in the marketing site).

**Props:**
```typescript
interface SeoListingProps {
  listingId: string
  address: string
  city: string
  postalCode: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number | null
  status: 'Closed' | 'Active' | 'Pending'
  date: string              // status_change_timestamp or listing_contract_date
  photoUrl: string | null   // first entry from photo_urls array (strip array to single URL before passing)
  latitude: number
  longitude: number
  highlighted?: boolean     // true when corresponding map pin is active
}
```

**Display:**
- Hero photo (first from `photo_urls`, fallback placeholder if null)
- Address (street + city + zip)
- Price (formatted with `Intl.NumberFormat`)
- Beds · Baths · Sqft (compact line)
- Status badge (color-coded: Closed = navy, Active = green, Pending = amber)
- Date (relative or absolute, e.g., "Sold Mar 2026" or "Listed 12 days ago")

**Behavior:**
- No click navigation — informational only
- `highlighted` prop adds a visual ring/border when the corresponding map pin is hovered or clicked
- Scrolls into view when its pin is clicked on the map
- When no photo available: show a neutral placeholder (e.g., house silhouette on cream background matching brand colors)

### 4.2 `ListingPopup`

Lightweight version of the card that renders inside a `react-map-gl` `<Popup>` on pin click.

**Contents:**
- Photo thumbnail
- Address
- Price
- Beds / baths / sqft (single line)

**Behavior:**
- Rendered as a React component inside `react-map-gl`'s `<Popup>` component (not raw `mapboxgl.Popup`)
- Closes when clicking elsewhere on the map or clicking another pin
- No navigation — stays on page

### 4.3 `ListingsMap`

Interactive Mapbox GL JS map. Client component (`'use client'`).

**Props:**
```typescript
interface ListingsMapProps {
  listings: SeoListingProps[]
  initialCenter: [number, number]  // [lng, lat]
  initialZoom: number
  onVisibleListingsChange: (visibleIds: string[]) => void
  clusteringEnabled?: boolean      // default true for county+ levels
}
```

**Mapbox Configuration:**
- Style: `mapbox://styles/mapbox/streets-v12` (clean, labeled — good for real estate context)
- Access token: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` env var
- Listings loaded as a GeoJSON source
- Clustering: Mapbox GL JS native clustering (`cluster: true` on the source) when `clusteringEnabled` is true
  - Cluster circles with count labels
  - Click cluster → zoom to expand
- Individual pins: custom marker style (navy dot matching brand)
- Pin click → `ListingPopup`
- Pin hover → highlight corresponding `SeoListingCard`
- `onMoveEnd` → compute visible listings from current bounds → call `onVisibleListingsChange`

**Map Bounds by Page Type:**

| Page Type | Initial Bounds Strategy |
|-----------|------------------------|
| DFW Hub | Hardcoded DFW metroplex bounding box |
| County | Hardcoded county bounding box (Tarrant prototype) |
| City | `fitBounds` to the listing points for that city |
| Zip | `fitBounds` to the listing points for that zip |
| Property | Center on subject property, zoom 15, comps = same zip code |

### 4.4 `ListingCardGrid`

Grid of `SeoListingCard` components below the map, filtered to the current map viewport.

**Props:**
```typescript
interface ListingCardGridProps {
  listings: SeoListingProps[]
  visibleIds: string[]         // from map viewport
  highlightedId: string | null // from map pin hover
}
```

**Behavior:**
- Shows only listings whose IDs are in `visibleIds`
- Shows count: "Showing 24 of 156 closed sales"
- Responsive grid: 1 col mobile, 2 cols tablet, 3-4 cols desktop
- When `highlightedId` changes, that card gets `highlighted={true}` and scrolls into view

### 4.5 `ListingsMapSection`

Wrapper that composes `ListingsMap` + `ListingCardGrid` and manages shared state.

**Props:**
```typescript
interface ListingsMapSectionProps {
  listings: SeoListingProps[]
  initialCenter: [number, number]
  initialZoom: number
  clusteringEnabled?: boolean
  title?: string  // e.g., "Recent Sales in 76017"
}
```

**State managed:**
- `visibleIds: string[]` — updated by map viewport changes
- `highlightedId: string | null` — updated by pin hover/click

## 5. Data Queries

### 5.1 Shared Query Shape

All pages use the same base query with different geographic filters:

```sql
SELECT
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
FROM mls_listings
WHERE mls_name = 'ntreis2'
  AND standard_status = 'Closed'
  AND status_change_timestamp > NOW() - INTERVAL '12 months'
  AND latitude IS NOT NULL
  AND longitude IS NOT NULL
  AND {geographic_filter}
ORDER BY status_change_timestamp DESC
```

### 5.2 Geographic Filters by Page Type

| Page Type | Filter | Expected Volume |
|-----------|--------|-----------------|
| DFW Hub | Bounding box: `latitude BETWEEN 32.2 AND 33.5 AND longitude BETWEEN -97.8 AND -96.3` | 10,000+ |
| County (Tarrant) | `county_or_parish = 'Tarrant'` | 2,000-5,000 |
| City (Arlington) | `city = 'Arlington'` | 500-2,000 |
| Zip (76017) | `postal_code = '76017'` | 50-200 |
| Property | `postal_code = '{zip}'` (same zip as subject) | 50-200 |

### 5.3 Volume Management

For DFW Hub and County pages where volume exceeds thousands:
- Server-side: fetch all listings for the geography (needed for clustering)
- If volume exceeds 5,000: fetch only the most recent 5,000 (`LIMIT 5000`)
- Client-side: Mapbox GL JS clustering handles visual density
- Card grid: only renders listings in current viewport (virtual-scroll not needed at ~50-200 visible at a time)

### 5.4 Supabase Query Implementation

```typescript
// lib/listings-seo.ts
// Follow existing pattern: import `supabase` (proxy-based, non-null) not `getSupabase()` (returns null during build)
import { supabase } from '@/lib/supabase'

const MLS_NAME = 'ntreis2'

// Select only first photo URL server-side to keep payload small.
// Full photo_urls array can be 40+ entries per listing — at 5,000 listings
// that's megabytes of serialized JSON in the HTML payload.
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

const TWELVE_MONTHS_AGO = new Date(
  Date.now() - 365 * 24 * 60 * 60 * 1000
).toISOString()

// Transform: strip photo_urls to first entry, cast types
function transformListings(data: any[]): SeoListingProps[] {
  return data.map(row => ({
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

export async function getClosedListingsByZip(zip: string) {
  const { data, error } = await supabase
    .from('mls_listings')
    .select(SEO_LISTING_FIELDS)
    .eq('mls_name', MLS_NAME)
    .eq('standard_status', 'Closed')
    .eq('postal_code', zip)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .gte('status_change_timestamp', TWELVE_MONTHS_AGO)
    .order('status_change_timestamp', { ascending: false })

  if (error) throw error
  return transformListings(data ?? [])
}

export async function getClosedListingsByCity(city: string) {
  // Same pattern, .eq('city', city)
}

export async function getClosedListingsByCounty(county: string) {
  // Same pattern, .eq('county_or_parish', county), .limit(5000)
}

export async function getClosedListingsByBoundingBox(
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  limit = 5000
) {
  // Same pattern with .gte/.lte for lat/lng, .limit(limit)
}
```

## 6. Dependency Changes

### Add:
- `mapbox-gl` — Mapbox GL JS renderer

### Remove:
- `deck.gl`
- `@deck.gl/aggregation-layers`
- `@deck.gl/core`
- `@deck.gl/layers`
- `@deck.gl/react`
- `maplibre-gl`

### Keep:
- `react-map-gl` — works with Mapbox GL JS (import `Map` from `react-map-gl/mapbox`)

### Environment Variables:
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` — Mapbox public access token (safe for client-side, domain-restricted in Mapbox dashboard)

## 7. File Structure

```
components/
  listings/
    ListingCard.tsx          # EXISTING — do not modify
    SeoListingCard.tsx       # New atomic listing card for SEO pages
    ListingPopup.tsx         # Map popup content
    ListingsMap.tsx          # Mapbox GL JS map (client component)
    ListingCardGrid.tsx      # Viewport-synced card grid
    ListingsMapSection.tsx   # Composed wrapper (client component)
lib/
  listings-seo.ts            # Supabase queries for SEO pages
app/(prototypes)/home-values/
  page.tsx                   # DFW Hub — updated to use real data + map
  tarrant-county/page.tsx    # County — updated
  arlington/page.tsx         # City — updated
  76017/page.tsx             # Zip — updated
  76017/*/page.tsx           # Property pages — updated
  ...other prototype pages
```

## 8. Build Order

Bottom-up implementation sequence:

1. **SeoListingCard** — static component, no dependencies
2. **ListingPopup** — lightweight variant of card for map popups
3. **ListingsMap** — Mapbox GL JS with clustering, pins, popups
4. **ListingCardGrid** — viewport-filtered grid
5. **ListingsMapSection** — compose map + grid with shared state
6. **`lib/listings-seo.ts`** — Supabase query functions
7. **Property page** (`76017/4605-brentgate-ct`) — first page wired up, simplest geography
8. **Zip page** (`76017`) — next level up, same zip query
9. **City page** (`arlington`) — city-level query, clustering kicks in
10. **County page** (`tarrant-county`) — county-level, heavier clustering
11. **DFW Hub page** — bounding box query, max clustering, volume cap

## 9. Error and Empty States

- **Zero listings for a geography:** Show the map centered on the area with no pins. Below the map, display "No recent sales found in {area} in the last 12 months." The page still renders its other content (stats, text).
- **Supabase query failure:** Log the error server-side. Render the page without the map section (graceful degradation). The hardcoded stats and content still display.
- **Missing Mapbox token:** Map section does not render. No client-side error. Listing cards still render below in a static grid.

## 10. Out of Scope

- Aggregate market stats (median price, DOM, appreciation %) — pending team feedback
- `market_stats` table creation
- Active/Pending listing display (Closed only for now)
- Property detail pages with full specs (these stay as-is with hardcoded BatchData)
- `parcels` table integration
- SEO content blocks / spin syntax
- Production deployment (pages remain noindex prototypes)
- Database index optimization (may be needed for DFW bounding box queries on 1.4M rows — evaluate during implementation)

## 11. Open Questions

1. ~~**County column** — does `mls_listings` have a `county` column?~~ **Resolved:** `county_or_parish` column exists.
2. **Mapbox plan** — which Mapbox pricing tier? Free tier allows 50,000 map loads/month. Need a Mapbox account + access token.
3. **Photo fallback** — what should the card show when `photo_urls` is empty or null? A branded placeholder? A generic house icon?
