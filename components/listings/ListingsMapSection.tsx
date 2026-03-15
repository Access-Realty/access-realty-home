// ABOUTME: Composed wrapper for ListingsMap + ListingCardGrids
// ABOUTME: Manages shared state between map and two card grids (active + closed)

'use client'

import { useState, useMemo } from 'react'
import ListingsMap from './ListingsMap'
import ListingCardGrid from './ListingCardGrid'
import type { SeoListingProps } from '@/types/seo-listing'

interface ListingsMapSectionProps {
  activeListings: SeoListingProps[]
  closedListings: SeoListingProps[]
  initialCenter: [number, number]
  initialZoom: number
  clusteringEnabled?: boolean
  title?: string
}

export default function ListingsMapSection({
  activeListings,
  closedListings,
  initialCenter,
  initialZoom,
  clusteringEnabled,
  title,
}: ListingsMapSectionProps) {
  // Combine for the map (one map, two colors)
  const allListings = useMemo(
    () => [...activeListings, ...closedListings],
    [activeListings, closedListings]
  )

  const [visibleIds, setVisibleIds] = useState<string[]>(
    () => allListings.map((l) => l.listingId)
  )
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      )}

      <ListingsMap
        listings={allListings}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        onVisibleListingsChange={setVisibleIds}
        onHighlightChange={setHighlightedId}
        clusteringEnabled={clusteringEnabled}
      />

      {/* Active listings */}
      {activeListings.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-foreground mb-3">Active Listings</h3>
          <ListingCardGrid
            listings={activeListings}
            visibleIds={visibleIds}
            highlightedId={highlightedId}
          />
        </div>
      )}

      {/* Closed / sold listings */}
      {closedListings.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-foreground mb-3">Recent Sales</h3>
          <ListingCardGrid
            listings={closedListings}
            visibleIds={visibleIds}
            highlightedId={highlightedId}
          />
        </div>
      )}
    </div>
  )
}
