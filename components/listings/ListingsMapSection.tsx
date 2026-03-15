// ABOUTME: Composed wrapper for ListingsMap + two collapsible card grids (active + closed)
// ABOUTME: Manages shared state between map and card sections

'use client'

import { useState, useMemo } from 'react'
import ListingsMap from './ListingsMap'
import ListingCardGrid from './ListingCardGrid'
import type { SeoListingProps } from '@/types/seo-listing'

interface ListingsMapSectionProps {
  activeListings: SeoListingProps[]
  closedListings: SeoListingProps[]
  activeRadiusMiles?: number
  closedRadiusMiles?: number
  initialCenter: [number, number]
  initialZoom: number
  clusteringEnabled?: boolean
  title?: string
}

function formatRadius(miles: number): string {
  if (miles < 1) return `${miles} mi`
  return `${miles} mi`
}

function CollapsibleSection({
  title,
  count,
  radiusMiles,
  defaultOpen = true,
  dotColor,
  children,
}: {
  title: string
  count: number
  radiusMiles?: number
  defaultOpen?: boolean
  dotColor: string
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3 bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${dotColor}`} />
          <span className="font-semibold text-foreground">{title}</span>
          <span className="text-sm text-muted-foreground">
            {count} {count === 1 ? 'listing' : 'listings'}
            {radiusMiles != null && ` within ${formatRadius(radiusMiles)}`}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 py-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ListingsMapSection({
  activeListings,
  closedListings,
  activeRadiusMiles,
  closedRadiusMiles,
  initialCenter,
  initialZoom,
  clusteringEnabled,
  title,
}: ListingsMapSectionProps) {
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

      <div className="mt-6 space-y-4">
        {activeListings.length > 0 && (
          <CollapsibleSection
            title="Active Listings"
            count={activeListings.length}
            radiusMiles={activeRadiusMiles}
            dotColor="bg-green-600"
            defaultOpen={true}
          >
            <ListingCardGrid
              listings={activeListings}
              visibleIds={visibleIds}
              highlightedId={highlightedId}
            />
          </CollapsibleSection>
        )}

        {closedListings.length > 0 && (
          <CollapsibleSection
            title="Recent Sales"
            count={closedListings.length}
            radiusMiles={closedRadiusMiles}
            dotColor="bg-primary"
            defaultOpen={true}
          >
            <ListingCardGrid
              listings={closedListings}
              visibleIds={visibleIds}
              highlightedId={highlightedId}
            />
          </CollapsibleSection>
        )}
      </div>
    </div>
  )
}
