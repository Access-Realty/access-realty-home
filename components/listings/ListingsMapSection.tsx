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
