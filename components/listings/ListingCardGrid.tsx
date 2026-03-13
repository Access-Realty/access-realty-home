// ABOUTME: Viewport-synced grid of SeoListingCards below the map
// ABOUTME: Only shows listings visible in the current map viewport

'use client'

import { useRef, useEffect, useMemo } from 'react'
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

  const visibleListings = useMemo(() => {
    const visibleSet = new Set(visibleIds)
    return listings.filter((l) => visibleSet.has(l.listingId))
  }, [listings, visibleIds])

  useEffect(() => {
    if (!highlightedId || !gridRef.current) return
    const card = gridRef.current.querySelector(`[data-listing-id="${highlightedId}"]`)
    if (card && typeof card.scrollIntoView === 'function') {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
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
