# MLS Data + Mapbox Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded listing data and emoji map placeholders in all 5 prototype page types under `/home-values/` with live MLS queries and interactive Mapbox GL JS maps.

**Architecture:** Server components fetch closed listings from `mls_listings` via Supabase (SSR for SEO). Data passes to a `ListingsMapSection` client component that renders a Mapbox GL JS map (via `react-map-gl`) with clustered markers and a viewport-synced card grid below it. Bottom-up build order: card → popup → map → grid → section wrapper → data layer → page wiring.

**Tech Stack:** Next.js 16, Supabase (mls_listings), Mapbox GL JS via react-map-gl, Tailwind CSS v4, Vitest

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `types/seo-listing.ts` | `SeoListingProps` interface — the atomic data shape for all SEO listing components |
| `components/listings/SeoListingCard.tsx` | Static listing card for SEO pages (photo, price, specs, status badge) |
| `components/listings/ListingPopup.tsx` | Lightweight popup content for map pin clicks |
| `components/listings/ListingsMap.tsx` | Mapbox GL JS map client component (clustering, pins, popups, viewport tracking) |
| `components/listings/ListingCardGrid.tsx` | Viewport-synced grid of SeoListingCards below the map |
| `components/listings/ListingsMapSection.tsx` | Composed wrapper managing shared state between map + grid |
| `lib/listings-seo.ts` | Supabase query functions for SEO pages (by zip, city, county, bounding box) |
| `lib/__tests__/listings-seo.test.ts` | Unit tests for transform logic and query builders |
| `components/listings/__tests__/SeoListingCard.test.tsx` | Unit tests for card rendering |
| `components/listings/__tests__/ListingCardGrid.test.tsx` | Unit tests for grid filtering |

### Modified Files
| File | Change |
|------|--------|
| `package.json` | Add `mapbox-gl`, remove deck.gl + maplibre-gl |
| `.env.local.example` | Add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` |
| `app/(prototypes)/home-values/76017/4605-brentgate-ct/page.tsx` | Wire real MLS comps + map |
| `app/(prototypes)/home-values/76017/page.tsx` | Wire real MLS data + map |
| `app/(prototypes)/home-values/arlington/page.tsx` | Wire real MLS data + map |
| `app/(prototypes)/home-values/tarrant-county/page.tsx` | Wire real MLS data + map |
| `app/(prototypes)/home-values/page.tsx` | Wire real MLS data + map |

### Unchanged Files
| File | Why |
|------|-----|
| `components/listings/ListingCard.tsx` | Different interface, used elsewhere in marketing site |
| `components/listings/DeckGLListingsMap.tsx` | Used by staff/team pages — will be migrated separately |
| `components/listings/ClosedListingsSection.tsx` | Staff-page specific — not part of this work |
| `lib/listings.ts` | Office-keyed queries — SEO pages use different query patterns |

---

## Chunk 1: Foundation — Types, Dependencies, Environment

### Task 1: Define SeoListingProps type

**Files:**
- Create: `types/seo-listing.ts`

- [ ] **Step 1: Create the type file**

```typescript
// types/seo-listing.ts
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
  status: 'Closed' | 'Active' | 'Pending'
  date: string              // ISO date string (status_change_timestamp or listing_contract_date)
  photoUrl: string | null   // First photo URL only — not the full array
  latitude: number
  longitude: number
  highlighted?: boolean     // True when corresponding map pin is active
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to `types/seo-listing.ts`

- [ ] **Step 3: Commit**

```bash
git add types/seo-listing.ts
git commit -m "feat(seo): add SeoListingProps type for SEO page components"
```

---

### Task 2: Swap dependencies — add mapbox-gl, remove deck.gl + maplibre-gl

**Files:**
- Modify: `package.json`

**Context:** The spec calls for replacing the deck.gl/maplibre stack with Mapbox GL JS. `react-map-gl` stays — it supports both backends. The existing `DeckGLListingsMap.tsx` (used on staff pages) will break after this removal. We'll keep the file but it won't be imported by any SEO page. Staff page migration is out of scope for this plan.

**IMPORTANT:** The deck.gl removal will break `components/listings/DeckGLListingsMap.tsx` and any pages importing it. We need to also update those imports. Check which pages use DeckGLListingsMap before removing.

- [ ] **Step 1: Check what imports DeckGLListingsMap**

Run: `grep -r "DeckGLListingsMap\|deck.gl\|@deck.gl" --include="*.tsx" --include="*.ts" -l`

This tells us which files will break. We expect: `DeckGLListingsMap.tsx` itself, `ClosedListingsSection.tsx`, and `CompanyClosedListingsSection.tsx`.

- [ ] **Step 2: Install mapbox-gl**

Run: `npm install mapbox-gl`

- [ ] **Step 3: Remove deck.gl and maplibre-gl packages**

Run: `npm uninstall deck.gl @deck.gl/aggregation-layers @deck.gl/core @deck.gl/layers @deck.gl/react maplibre-gl supercluster use-supercluster`

- [ ] **Step 3b: Install test dependencies**

Run: `npm install -D @testing-library/react @testing-library/jest-dom`

These are required for component tests (Tasks 3, 6) but are not currently in `devDependencies`.

- [ ] **Step 4: Update DeckGLListingsMap to a placeholder**

Replace the contents of `components/listings/DeckGLListingsMap.tsx` with a simple placeholder that preserves the interface but doesn't import deck.gl:

```typescript
// ABOUTME: TEMPORARY PLACEHOLDER — deck.gl removed in favor of Mapbox GL JS
// ABOUTME: Staff page map migration is tracked separately
// TODO: Migrate to Mapbox GL JS (separate task from SEO map work)

"use client";

import type { ClosedListing } from "@/lib/listings";

interface DeckGLListingsMapProps {
  listings: ClosedListing[];
}

export default function DeckGLListingsMap({ listings }: DeckGLListingsMapProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <div className="relative h-[400px] flex items-center justify-center bg-muted">
        <div className="text-center text-muted-foreground">
          <p className="text-sm font-medium">Map temporarily unavailable</p>
          <p className="text-xs mt-1">{listings.length} closed deals</p>
          <p className="text-xs mt-1">Mapbox migration in progress</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local.example**

Add this line after the Google Maps key entry:

```
# Mapbox — for interactive maps on SEO property pages
# Public token (domain-restricted in Mapbox dashboard)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxxx
```

- [ ] **Step 6: Verify build succeeds**

Run: `npm run build 2>&1 | tail -30`
Expected: Build succeeds. No deck.gl import errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json .env.local.example components/listings/DeckGLListingsMap.tsx
git commit -m "chore: swap deck.gl/maplibre for mapbox-gl, placeholder staff map"
```

---

## Chunk 2: SeoListingCard + ListingPopup Components

### Task 3: Build SeoListingCard component

**Files:**
- Create: `components/listings/SeoListingCard.tsx`
- Create: `components/listings/__tests__/SeoListingCard.test.tsx`

- [ ] **Step 1: Write failing tests for SeoListingCard**

```typescript
// components/listings/__tests__/SeoListingCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SeoListingCard from '../SeoListingCard'
import type { SeoListingProps } from '@/types/seo-listing'

const baseListing: SeoListingProps = {
  listingId: '20976128',
  address: '4605 Brentgate Ct',
  city: 'Arlington',
  postalCode: '76017',
  price: 415000,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 2555,
  status: 'Closed',
  date: '2026-02-14T00:00:00Z',
  photoUrl: 'https://example.com/photo.jpg',
  latitude: 32.6716,
  longitude: -97.1426,
}

describe('SeoListingCard', () => {
  it('renders address, price, and specs', () => {
    render(<SeoListingCard {...baseListing} />)
    expect(screen.getByText('4605 Brentgate Ct')).toBeDefined()
    expect(screen.getByText('$415,000')).toBeDefined()
    expect(screen.getByText(/3/)).toBeDefined()
    expect(screen.getByText(/2,555/)).toBeDefined()
  })

  it('renders status badge with correct text', () => {
    render(<SeoListingCard {...baseListing} />)
    expect(screen.getByText('Closed')).toBeDefined()
  })

  it('renders highlighted ring when highlighted', () => {
    const { container } = render(<SeoListingCard {...baseListing} highlighted />)
    const card = container.firstElementChild
    expect(card?.className).toContain('ring-2')
  })

  it('renders placeholder when no photo', () => {
    render(<SeoListingCard {...baseListing} photoUrl={null} />)
    // Should render without crashing — placeholder visible
    expect(screen.getByText('4605 Brentgate Ct')).toBeDefined()
  })

  it('formats date for Closed status', () => {
    render(<SeoListingCard {...baseListing} />)
    // "Sold Feb 2026" or similar
    expect(screen.getByText(/Sold/)).toBeDefined()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run components/listings/__tests__/SeoListingCard.test.tsx 2>&1 | tail -20`
Expected: FAIL — module not found

- [ ] **Step 3: Implement SeoListingCard**

```typescript
// components/listings/SeoListingCard.tsx
// ABOUTME: Atomic listing card for SEO property pages — photo, price, specs, status badge
// ABOUTME: No navigation/links — informational only. Separate from ListingCard.tsx

import Image from 'next/image'
import type { SeoListingProps } from '@/types/seo-listing'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateStr: string, status: string): string {
  const date = new Date(dateStr)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.getFullYear()

  if (status === 'Closed') return `Sold ${month} ${year}`
  if (status === 'Pending') return `Pending`

  // Active: relative if recent
  const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (daysAgo <= 30) return `Listed ${daysAgo} days ago`
  return `Listed ${month} ${year}`
}

const STATUS_COLORS: Record<string, string> = {
  Closed: 'bg-primary text-primary-foreground',
  Active: 'bg-green-600 text-white',
  Pending: 'bg-amber-500 text-white',
}

export default function SeoListingCard(props: SeoListingProps) {
  const {
    address, city, postalCode, price, bedrooms, bathrooms,
    sqft, status, date, photoUrl, highlighted,
  } = props

  const specsLine = [
    `${bedrooms} bd`,
    `${bathrooms} ba`,
    sqft ? `${sqft.toLocaleString()} sqft` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div
      data-listing-id={props.listingId}
      className={`bg-card rounded-xl overflow-hidden border transition-all ${
        highlighted
          ? 'ring-2 ring-primary border-primary shadow-lg'
          : 'border-border hover:shadow-md'
      }`}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-muted">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={address}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7z" />
            </svg>
          </div>
        )}

        {/* Status badge */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[status] || 'bg-gray-500 text-white'}`}>
          {status}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-lg font-bold text-foreground">{formatPrice(price)}</p>
        <p className="text-sm text-foreground mt-0.5 font-medium">{specsLine}</p>
        <p className="text-sm text-muted-foreground mt-1.5 truncate">{address}</p>
        <p className="text-sm text-muted-foreground">{city}, TX {postalCode}</p>
        <p className="text-xs text-muted-foreground mt-1.5">{formatDate(date, status)}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/listings/__tests__/SeoListingCard.test.tsx 2>&1 | tail -20`
Expected: All 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add components/listings/SeoListingCard.tsx components/listings/__tests__/SeoListingCard.test.tsx
git commit -m "feat(seo): add SeoListingCard component with tests"
```

---

### Task 4: Build ListingPopup component

**Files:**
- Create: `components/listings/ListingPopup.tsx`

- [ ] **Step 1: Implement ListingPopup**

This is a lightweight component rendered inside `react-map-gl`'s `<Popup>`. Minimal — just photo, address, price, specs.

```typescript
// components/listings/ListingPopup.tsx
// ABOUTME: Lightweight listing popup for Mapbox map pin clicks
// ABOUTME: Rendered inside react-map-gl <Popup> — must be compact

import type { SeoListingProps } from '@/types/seo-listing'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

interface ListingPopupProps {
  listing: SeoListingProps
  onClose: () => void
}

export default function ListingPopup({ listing, onClose }: ListingPopupProps) {
  const specsLine = [
    `${listing.bedrooms} bd`,
    `${listing.bathrooms} ba`,
    listing.sqft ? `${listing.sqft.toLocaleString()} sqft` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="w-[260px]">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-1 right-1 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        aria-label="Close popup"
      >
        ×
      </button>

      {/* Photo */}
      {listing.photoUrl && (
        <img
          src={listing.photoUrl}
          alt={listing.address}
          className="w-full h-32 object-cover rounded-t"
        />
      )}

      {/* Content */}
      <div className="p-2.5">
        <p className="font-bold text-sm text-gray-900">{formatPrice(listing.price)}</p>
        <p className="text-xs text-gray-600 mt-0.5">{specsLine}</p>
        <p className="text-xs text-gray-500 mt-1 truncate">{listing.address}</p>
        <p className="text-xs text-gray-500">{listing.city}, TX {listing.postalCode}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/listings/ListingPopup.tsx
git commit -m "feat(seo): add ListingPopup component for map popups"
```

---

## Chunk 3: ListingsMap — Mapbox GL JS Client Component

### Task 5: Build ListingsMap with Mapbox GL JS

**Files:**
- Create: `components/listings/ListingsMap.tsx`

**Context:** This is the core map component. Uses `react-map-gl/mapbox` (not `/maplibre`). Renders listings as a GeoJSON source with native Mapbox clustering. Handles pin clicks (popup), pin hover (highlight), and viewport tracking (onMoveEnd → visible listing IDs).

- [ ] **Step 1: Create ListingsMap component**

```typescript
// components/listings/ListingsMap.tsx
// ABOUTME: Interactive Mapbox GL JS map for SEO property pages
// ABOUTME: Clustering, pin popups, viewport tracking via react-map-gl

'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl/mapbox'
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/mapbox'
import type { GeoJSONSource } from 'mapbox-gl'
import type { SeoListingProps } from '@/types/seo-listing'
import ListingPopup from './ListingPopup'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface ListingsMapProps {
  listings: SeoListingProps[]
  initialCenter: [number, number] // [lng, lat]
  initialZoom: number
  onVisibleListingsChange: (visibleIds: string[]) => void
  onHighlightChange?: (listingId: string | null) => void
  clusteringEnabled?: boolean
}

// Mapbox layer styles
const clusterLayer = {
  id: 'clusters',
  type: 'circle' as const,
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#284b70',
    'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 50, 32],
    'circle-opacity': 0.85,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
  },
}

const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol' as const,
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 13,
  },
  paint: {
    'text-color': '#ffffff',
  },
}

const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle' as const,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#284b70',
    'circle-radius': 7,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
    'circle-opacity': 0.9,
  },
}

function listingsToGeoJSON(listings: SeoListingProps[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: listings.map((l) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [l.longitude, l.latitude],
      },
      properties: {
        listingId: l.listingId,
      },
    })),
  }
}

export default function ListingsMap({
  listings,
  initialCenter,
  initialZoom,
  onVisibleListingsChange,
  onHighlightChange,
  clusteringEnabled = true,
}: ListingsMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [selectedListing, setSelectedListing] = useState<SeoListingProps | null>(null)

  // Build a lookup map for quick access
  const listingMap = useMemo(
    () => new Map(listings.map((l) => [l.listingId, l])),
    [listings]
  )

  const geojson = useMemo(() => listingsToGeoJSON(listings), [listings])

  // Compute visible listings from current map bounds
  const updateVisibleListings = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const bounds = map.getBounds()
    if (!bounds) return

    const visibleIds = listings
      .filter((l) =>
        l.longitude >= bounds.getWest() &&
        l.longitude <= bounds.getEast() &&
        l.latitude >= bounds.getSouth() &&
        l.latitude <= bounds.getNorth()
      )
      .map((l) => l.listingId)

    onVisibleListingsChange(visibleIds)
  }, [listings, onVisibleListingsChange])

  const handleMapLoad = useCallback(() => {
    // Initial visible listings calculation
    updateVisibleListings()
  }, [updateVisibleListings])

  const handleMoveEnd = useCallback(() => {
    updateVisibleListings()
  }, [updateVisibleListings])

  const handleClick = useCallback(
    async (e: MapLayerMouseEvent) => {
      const map = mapRef.current?.getMap()
      if (!map) return

      // Check for cluster click
      const clusterFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      })
      if (clusterFeatures.length > 0) {
        const feature = clusterFeatures[0]
        const clusterId = feature.properties?.cluster_id
        const source = map.getSource('listings') as GeoJSONSource
        try {
          // mapbox-gl v3+ uses Promise-based API
          const zoom = await source.getClusterExpansionZoom(clusterId)
          const geometry = feature.geometry as GeoJSON.Point
          map.easeTo({
            center: geometry.coordinates as [number, number],
            zoom,
          })
        } catch {
          // Ignore cluster expansion errors
        }
        return
      }

      // Check for point click
      const pointFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point'],
      })
      if (pointFeatures.length > 0) {
        const listingId = pointFeatures[0].properties?.listingId
        const listing = listingMap.get(listingId)
        if (listing) {
          setSelectedListing(listing)
          onHighlightChange?.(listing.listingId)
        }
      } else {
        setSelectedListing(null)
        onHighlightChange?.(null)
      }
    },
    [listingMap, onHighlightChange]
  )

  const handleMouseEnter = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (map) map.getCanvas().style.cursor = 'pointer'
  }, [])

  const handleMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (map) map.getCanvas().style.cursor = ''
  }, [])

  if (!MAPBOX_TOKEN) {
    // Graceful degradation: no token → no map
    return null
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border" style={{ height: 450 }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: initialCenter[0],
          latitude: initialCenter[1],
          zoom: initialZoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={handleMapLoad}
        onMoveEnd={handleMoveEnd}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        <Source
          id="listings"
          type="geojson"
          data={geojson}
          cluster={clusteringEnabled}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>

        {selectedListing && (
          <Popup
            longitude={selectedListing.longitude}
            latitude={selectedListing.latitude}
            anchor="bottom"
            onClose={() => {
              setSelectedListing(null)
              onHighlightChange?.(null)
            }}
            closeButton={false}
            maxWidth="280px"
          >
            <ListingPopup
              listing={selectedListing}
              onClose={() => {
                setSelectedListing(null)
                onHighlightChange?.(null)
              }}
            />
          </Popup>
        )}
      </Map>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors (may have warnings about mapbox-gl types — OK)

- [ ] **Step 3: Commit**

```bash
git add components/listings/ListingsMap.tsx
git commit -m "feat(seo): add ListingsMap component with Mapbox GL JS clustering"
```

---

## Chunk 4: ListingCardGrid + ListingsMapSection

### Task 6: Build ListingCardGrid component

**Files:**
- Create: `components/listings/ListingCardGrid.tsx`
- Create: `components/listings/__tests__/ListingCardGrid.test.tsx`

- [ ] **Step 1: Write failing tests for ListingCardGrid**

```typescript
// components/listings/__tests__/ListingCardGrid.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListingCardGrid from '../ListingCardGrid'
import type { SeoListingProps } from '@/types/seo-listing'

const makeListing = (id: string, address: string): SeoListingProps => ({
  listingId: id,
  address,
  city: 'Arlington',
  postalCode: '76017',
  price: 400000,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 2000,
  status: 'Closed',
  date: '2026-02-14T00:00:00Z',
  photoUrl: null,
  latitude: 32.67,
  longitude: -97.14,
})

const listings = [
  makeListing('1', '100 Main St'),
  makeListing('2', '200 Oak Ave'),
  makeListing('3', '300 Elm Dr'),
]

describe('ListingCardGrid', () => {
  it('renders only visible listings', () => {
    render(
      <ListingCardGrid
        listings={listings}
        visibleIds={['1', '3']}
        highlightedId={null}
      />
    )
    expect(screen.getByText('100 Main St')).toBeDefined()
    expect(screen.getByText('300 Elm Dr')).toBeDefined()
    expect(screen.queryByText('200 Oak Ave')).toBeNull()
  })

  it('shows count of visible vs total', () => {
    render(
      <ListingCardGrid
        listings={listings}
        visibleIds={['1', '2']}
        highlightedId={null}
      />
    )
    expect(screen.getByText(/Showing 2 of 3/)).toBeDefined()
  })

  it('highlights the correct card', () => {
    const { container } = render(
      <ListingCardGrid
        listings={listings}
        visibleIds={['1', '2', '3']}
        highlightedId="2"
      />
    )
    const highlighted = container.querySelector('[data-listing-id="2"]')
    expect(highlighted?.className).toContain('ring-2')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run components/listings/__tests__/ListingCardGrid.test.tsx 2>&1 | tail -15`
Expected: FAIL

- [ ] **Step 3: Implement ListingCardGrid**

```typescript
// components/listings/ListingCardGrid.tsx
// ABOUTME: Viewport-synced grid of SeoListingCards below the map
// ABOUTME: Only shows listings visible in the current map viewport

'use client'

import { useRef, useEffect } from 'react'
import SeoListingCard from './SeoListingCard'
import type { SeoListingProps } from '@/types/seo-listing'

interface ListingCardGridProps {
  listings: SeoListingProps[]
  visibleIds: string[]
  highlightedId: string | null
}

export default function ListingCardGrid({
  listings,
  visibleIds,
  highlightedId,
}: ListingCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const visibleSet = new Set(visibleIds)

  const visibleListings = listings.filter((l) => visibleSet.has(l.listingId))

  // Scroll highlighted card into view
  useEffect(() => {
    if (!highlightedId || !gridRef.current) return
    const card = gridRef.current.querySelector(`[data-listing-id="${highlightedId}"]`)
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [highlightedId])

  return (
    <div ref={gridRef}>
      <p className="text-sm text-muted-foreground mb-4">
        Showing {visibleListings.length} of {listings.length} closed sales
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleListings.map((listing) => (
          <SeoListingCard
            key={listing.listingId}
            {...listing}
            highlighted={listing.listingId === highlightedId}
          />
        ))}
      </div>

      {visibleListings.length === 0 && listings.length > 0 && (
        <p className="text-center text-muted-foreground py-8">
          Pan or zoom the map to see listings in this area.
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/listings/__tests__/ListingCardGrid.test.tsx 2>&1 | tail -15`
Expected: All 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add components/listings/ListingCardGrid.tsx components/listings/__tests__/ListingCardGrid.test.tsx
git commit -m "feat(seo): add ListingCardGrid viewport-synced grid with tests"
```

---

### Task 7: Build ListingsMapSection wrapper

**Files:**
- Create: `components/listings/ListingsMapSection.tsx`

- [ ] **Step 1: Implement ListingsMapSection**

```typescript
// components/listings/ListingsMapSection.tsx
// ABOUTME: Composed wrapper for ListingsMap + ListingCardGrid
// ABOUTME: Manages shared state (visible IDs, highlighted ID) between map and grid

'use client'

import { useState, useCallback } from 'react'
import ListingsMap from './ListingsMap'
import ListingCardGrid from './ListingCardGrid'
import type { SeoListingProps } from '@/types/seo-listing'

interface ListingsMapSectionProps {
  listings: SeoListingProps[]
  initialCenter: [number, number]
  initialZoom: number
  clusteringEnabled?: boolean
  title?: string
}

export default function ListingsMapSection({
  listings,
  initialCenter,
  initialZoom,
  clusteringEnabled,
  title,
}: ListingsMapSectionProps) {
  // All listings visible initially (before map hydrates)
  const [visibleIds, setVisibleIds] = useState<string[]>(
    () => listings.map((l) => l.listingId)
  )
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  const handleVisibleListingsChange = useCallback((ids: string[]) => {
    setVisibleIds(ids)
  }, [])

  const handleHighlightChange = useCallback((id: string | null) => {
    setHighlightedId(id)
  }, [])

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      )}

      <ListingsMap
        listings={listings}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        onVisibleListingsChange={handleVisibleListingsChange}
        onHighlightChange={handleHighlightChange}
        clusteringEnabled={clusteringEnabled}
      />

      <div className="mt-6">
        <ListingCardGrid
          listings={listings}
          visibleIds={visibleIds}
          highlightedId={highlightedId}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/listings/ListingsMapSection.tsx
git commit -m "feat(seo): add ListingsMapSection composed map+grid wrapper"
```

---

## Chunk 5: Data Layer — lib/listings-seo.ts

### Task 8: Build Supabase query functions for SEO pages

**Files:**
- Create: `lib/listings-seo.ts`
- Create: `lib/__tests__/listings-seo.test.ts`

- [ ] **Step 1: Write tests for transform logic**

```typescript
// lib/__tests__/listings-seo.test.ts
import { describe, it, expect, vi } from 'vitest'

// lib/listings-seo.ts imports 'server-only' which throws outside RSC.
// Mock it so the module can be imported in Vitest's jsdom environment.
vi.mock('server-only', () => ({}))

import { transformListings } from '../listings-seo'

describe('transformListings', () => {
  it('maps MLS row fields to SeoListingProps', () => {
    const row = {
      listing_id: '20976128',
      unparsed_address: '4605 Brentgate Ct',
      city: 'Arlington',
      postal_code: '76017',
      list_price: 415000,
      bedrooms_total: 3,
      bathrooms_total_decimal: 2.0,
      living_area: 2555,
      latitude: 32.6716,
      longitude: -97.1426,
      standard_status: 'Closed',
      status_change_timestamp: '2026-02-14T00:00:00Z',
      listing_contract_date: '2026-01-20',
      photo_urls: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
    }

    const result = transformListings([row])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      listingId: '20976128',
      address: '4605 Brentgate Ct',
      city: 'Arlington',
      postalCode: '76017',
      price: 415000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2555,
      status: 'Closed',
      date: '2026-02-14T00:00:00Z',
      photoUrl: 'https://example.com/1.jpg',  // Only first photo
      latitude: 32.6716,
      longitude: -97.1426,
    })
  })

  it('handles null photo_urls', () => {
    const row = {
      listing_id: '123',
      unparsed_address: '100 Main St',
      city: 'Dallas',
      postal_code: '75001',
      list_price: 300000,
      bedrooms_total: 2,
      bathrooms_total_decimal: 1,
      living_area: null,
      latitude: 32.7,
      longitude: -96.8,
      standard_status: 'Closed',
      status_change_timestamp: null,
      listing_contract_date: '2026-01-01',
      photo_urls: null,
    }

    const result = transformListings([row])
    expect(result[0].photoUrl).toBeNull()
    expect(result[0].sqft).toBeNull()
    expect(result[0].date).toBe('2026-01-01') // Falls back to listing_contract_date
  })

  it('returns empty array for empty input', () => {
    expect(transformListings([])).toEqual([])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/__tests__/listings-seo.test.ts 2>&1 | tail -15`
Expected: FAIL — module not found

- [ ] **Step 3: Implement lib/listings-seo.ts**

```typescript
// lib/listings-seo.ts
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

const TWELVE_MONTHS_AGO = new Date(
  Date.now() - 365 * 24 * 60 * 60 * 1000
).toISOString()

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
  return supabase
    .from('mls_listings')
    .select(SEO_LISTING_FIELDS)
    .eq('mls_name', MLS_NAME)
    .eq('standard_status', 'Closed')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .gte('status_change_timestamp', TWELVE_MONTHS_AGO)
    .order('status_change_timestamp', { ascending: false })
}

export async function getClosedListingsByZip(zip: string): Promise<SeoListingProps[]> {
  const { data, error } = await baseQuery().eq('postal_code', zip)

  if (error) {
    console.error('Error fetching listings by zip:', error)
    return []
  }
  return transformListings(data ?? [])
}

export async function getClosedListingsByCity(city: string): Promise<SeoListingProps[]> {
  const { data, error } = await baseQuery().eq('city', city)

  if (error) {
    console.error('Error fetching listings by city:', error)
    return []
  }
  return transformListings(data ?? [])
}

export async function getClosedListingsByCounty(county: string): Promise<SeoListingProps[]> {
  const { data, error } = await baseQuery()
    .eq('county_or_parish', county)
    .limit(5000)

  if (error) {
    console.error('Error fetching listings by county:', error)
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
    console.error('Error fetching listings by bounding box:', error)
    return []
  }
  return transformListings(data ?? [])
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/__tests__/listings-seo.test.ts 2>&1 | tail -15`
Expected: All 3 tests PASS

- [ ] **Step 5: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add lib/listings-seo.ts lib/__tests__/listings-seo.test.ts
git commit -m "feat(seo): add Supabase query functions for SEO pages with tests"
```

---

## Chunk 6: Wire Up Prototype Pages (Bottom-Up)

### Task 9: Wire property page — 76017/4605-brentgate-ct

**Files:**
- Modify: `app/(prototypes)/home-values/76017/4605-brentgate-ct/page.tsx`

**Context:** The property page keeps its hardcoded parcel data (AVM, tax assessment, etc. — those come from BatchData/parcels, which is out of scope). We replace:
1. The hardcoded COMPS array with real MLS data from `getClosedListingsByZip('76017')`
2. The emoji map placeholder with `ListingsMapSection`

The page becomes an `async` server component. Market stats stay hardcoded (pending team feedback per spec).

- [ ] **Step 1: Convert to async server component with real MLS comps**

Key changes to `app/(prototypes)/home-values/76017/4605-brentgate-ct/page.tsx`:

1. Add imports at top:
```typescript
import { getClosedListingsByZip } from '@/lib/listings-seo'
import ListingsMapSection from '@/components/listings/ListingsMapSection'
```

2. Convert `export default function PropertyPage()` to `export default async function PropertyPage()`

3. Add data fetch at start of function:
```typescript
const listings = await getClosedListingsByZip('76017')
```

4. Replace the `COMPS` constant and its hardcoded table with the ListingsMapSection. Replace the "Our Track Record" emoji placeholder section (section 8) with:
```tsx
<Section variant="content" maxWidth="5xl">
  <h2 className="text-2xl font-bold text-foreground mb-4">Recently Sold Near You</h2>
  <ListingsMapSection
    listings={listings}
    initialCenter={[-97.142574, 32.671639]}
    initialZoom={14}
    clusteringEnabled={false}
    title=""
  />
</Section>
```

5. Remove the old `COMPS` constant and the old comp table `<Section>`.
6. Remove the old "Our Track Record" emoji placeholder section.
7. Keep everything else unchanged (parcel data, AVM, tax assessment, calculator, CTA, etc.)

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 3: Visual review**

Start dev server if not running: `npm run dev &`
Screenshot the page:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/review-property.png --window-size=1400,2000 "http://localhost:4000/home-values/76017/4605-brentgate-ct"
```

Verify: Map section renders (or graceful degradation if no token), listing cards appear below.

- [ ] **Step 4: Commit**

```bash
git add app/(prototypes)/home-values/76017/4605-brentgate-ct/page.tsx
git commit -m "feat(seo): wire property page with real MLS comps and Mapbox map"
```

---

### Task 10: Wire zip page — 76017

**Files:**
- Modify: `app/(prototypes)/home-values/76017/page.tsx`

- [ ] **Step 1: Convert to async server component with real MLS data**

Key changes:

1. Add imports:
```typescript
import { getClosedListingsByZip } from '@/lib/listings-seo'
import ListingsMapSection from '@/components/listings/ListingsMapSection'
```

2. Convert to `export default async function ZipHubPage()`

3. Fetch data:
```typescript
const listings = await getClosedListingsByZip('76017')
```

4. Replace the emoji map placeholder section with:
```tsx
<Section variant="content" maxWidth="5xl">
  <ListingsMapSection
    listings={listings}
    initialCenter={[-97.14, 32.67]}
    initialZoom={13}
    clusteringEnabled={false}
    title="Recent Sales Map"
  />
</Section>
```

5. Replace the hardcoded `RECENT_SALES` table with the map section (which includes the card grid). Remove the `RECENT_SALES` constant.

6. Keep: STATS (hardcoded), editorial content, PROPERTY_PAGES links, email signup, DirectListCTA.

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/(prototypes)/home-values/76017/page.tsx
git commit -m "feat(seo): wire zip page 76017 with real MLS data and Mapbox map"
```

---

### Task 11: Wire city page — arlington

**Files:**
- Modify: `app/(prototypes)/home-values/arlington/page.tsx`

- [ ] **Step 1: Convert to async server component**

Key changes:

1. Add imports:
```typescript
import { getClosedListingsByCity } from '@/lib/listings-seo'
import ListingsMapSection from '@/components/listings/ListingsMapSection'
```

2. Convert to `export default async function CityHubPage()`

3. Fetch data:
```typescript
const listings = await getClosedListingsByCity('Arlington')
```

4. Replace emoji map placeholder with:
```tsx
<Section variant="content" maxWidth="5xl">
  <ListingsMapSection
    listings={listings}
    initialCenter={[-97.11, 32.74]}
    initialZoom={11}
    clusteringEnabled={true}
    title="Arlington Sales Activity"
  />
</Section>
```

5. Keep everything else: CITY_STATS, ZIP_BREAKDOWNS table, editorial, school districts, CTA.

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`

- [ ] **Step 3: Commit**

```bash
git add app/(prototypes)/home-values/arlington/page.tsx
git commit -m "feat(seo): wire Arlington city page with real MLS data and Mapbox map"
```

---

### Task 12: Wire county page — tarrant-county

**Files:**
- Modify: `app/(prototypes)/home-values/tarrant-county/page.tsx`

- [ ] **Step 1: Convert to async server component**

Key changes:

1. Add imports:
```typescript
import { getClosedListingsByCounty } from '@/lib/listings-seo'
import ListingsMapSection from '@/components/listings/ListingsMapSection'
```

2. Convert to `export default async function CountyHubPage()`

3. Fetch data:
```typescript
const listings = await getClosedListingsByCounty('Tarrant')
```

4. Replace emoji map placeholder with:
```tsx
<Section variant="content" maxWidth="5xl">
  <ListingsMapSection
    listings={listings}
    initialCenter={[-97.30, 32.76]}
    initialZoom={10}
    clusteringEnabled={true}
    title="Tarrant County Sales Activity"
  />
</Section>
```

5. Keep everything else: COUNTY_STATS, CITIES table, editorial, tax context, CTA.

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`

- [ ] **Step 3: Commit**

```bash
git add app/(prototypes)/home-values/tarrant-county/page.tsx
git commit -m "feat(seo): wire Tarrant County page with real MLS data and Mapbox map"
```

---

### Task 13: Wire DFW hub page

**Files:**
- Modify: `app/(prototypes)/home-values/page.tsx`

- [ ] **Step 1: Convert to async server component**

Key changes:

1. Add imports:
```typescript
import { getClosedListingsByBoundingBox } from '@/lib/listings-seo'
import ListingsMapSection from '@/components/listings/ListingsMapSection'
```

2. Convert to `export default async function DFWOverviewPage()`

3. Fetch data:
```typescript
const listings = await getClosedListingsByBoundingBox({
  minLat: 32.2,
  maxLat: 33.5,
  minLng: -97.8,
  maxLng: -96.3,
})
```

4. Replace emoji map placeholder with:
```tsx
<Section variant="content" maxWidth="5xl">
  <ListingsMapSection
    listings={listings}
    initialCenter={[-96.8, 32.8]}
    initialZoom={9}
    clusteringEnabled={true}
    title="DFW Market Activity"
  />
</Section>
```

5. Keep everything else: DFW_STATS, COUNTIES cards, editorial, email signup, educational links, CTA.

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`

- [ ] **Step 3: Commit**

```bash
git add app/(prototypes)/home-values/page.tsx
git commit -m "feat(seo): wire DFW hub page with real MLS data and Mapbox map"
```

---

## Chunk 7: Final Verification

### Task 14: Run full test suite and build

- [ ] **Step 1: Run all tests**

Run: `npx vitest run 2>&1 | tail -30`
Expected: All tests pass

- [ ] **Step 2: Run linter**

Run: `npm run lint 2>&1 | tail -20`
Expected: No errors (warnings OK)

- [ ] **Step 3: Run production build**

Run: `npm run build 2>&1 | tail -30`
Expected: Build succeeds

- [ ] **Step 4: Visual review of all pages**

Start dev server, then screenshot each page:
```bash
for page in "" "tarrant-county" "arlington" "76017" "76017/4605-brentgate-ct"; do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot="/tmp/review-${page//\//-}.png" --window-size=1400,2000 "http://localhost:4000/home-values/$page"
done
```

Review each screenshot for:
- Map renders (or graceful placeholder if no Mapbox token)
- Cards appear below map
- No double headers, broken layouts
- Colors match brand (navy hero, cream content)

- [ ] **Step 5: Commit any final fixes if needed**

---

## Notes for the Implementer

### Mapbox Token
You need a `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` in `.env.local`. Get one from the Mapbox dashboard (free tier: 50K map loads/month). Without it, the map section gracefully hides and cards render in a static grid.

### react-map-gl Import Path
The spec says `import Map from 'react-map-gl/mapbox'` — this is the correct path for Mapbox GL JS backend with react-map-gl v8+. Do NOT use `'react-map-gl/maplibre'` or plain `'react-map-gl'`.

### Build-Time Behavior
The Supabase proxy in `lib/supabase.ts` returns empty data during build. This means SSG pages will have empty listings at build time. At runtime (ISR/SSR), they'll fetch real data. This is the existing pattern — don't fight it.

### DeckGLListingsMap Placeholder
The staff pages (`/our-team`, agent detail pages) currently use `DeckGLListingsMap`. After removing deck.gl, those pages will show the placeholder. This is a known, accepted trade-off — staff page map migration is a separate task.

### Other Property Pages
After completing Task 9 (4605-brentgate-ct), wire up the remaining 3 property pages using the identical pattern — each just needs a different zip code for the query and different coordinates for the map center:
- `76111/2113-bird-st/page.tsx` → `getClosedListingsByZip('76111')`
- `75009/716-corner-post-path/page.tsx` → `getClosedListingsByZip('75009')`
- `76053/4821-weyland-dr/page.tsx` → `getClosedListingsByZip('76053')`

These are mechanical copies of the Task 9 pattern. Do them after Task 9 is verified working.

### Out of Scope
- Market stats remain hardcoded (pending `market_stats` table design)
- Active/Pending listing display (Closed only)
- Database index optimization for bounding box queries
- Photo download triggering (SEO pages don't need CDN-stored photos yet)
