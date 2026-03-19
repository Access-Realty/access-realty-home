// ABOUTME: Composed wrapper for ListingsMap + two horizontal carousel sections (active + closed)
// ABOUTME: Manages shared state between map and carousel sections

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
  interactive?: boolean
  title?: string
}

function formatRadius(miles: number): string {
  return `${miles} mi`
}

export default function ListingsMapSection({
  activeListings,
  closedListings,
  activeRadiusMiles,
  closedRadiusMiles,
  initialCenter,
  initialZoom,
  clusteringEnabled,
  interactive = true,
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
  const [soldPricesUnlocked, setSoldPricesUnlocked] = useState(false)
  const [email, setEmail] = useState('')

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
        interactive={interactive}
      />

      <div className="mt-6 space-y-6">
        {activeListings.length > 0 && (
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-3 h-3 rounded-full bg-green-600" />
              <h3 className="font-semibold text-foreground">Active Listings</h3>
              <span className="text-sm text-muted-foreground">
                {activeListings.length}
                {activeRadiusMiles != null && ` within ${formatRadius(activeRadiusMiles)}`}
              </span>
            </div>
            <ListingCardGrid
              listings={activeListings}
              visibleIds={visibleIds}
              highlightedId={highlightedId}
            />
          </div>
        )}

        {closedListings.length > 0 && (
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <h3 className="font-semibold text-foreground">Recent Sales</h3>
              <span className="text-sm text-muted-foreground">
                {closedListings.length}
                {closedRadiusMiles != null && ` within ${formatRadius(closedRadiusMiles)}`}
              </span>
            </div>

            {/* Email gate for sold prices — per NTREIS 17.11 */}
            {!soldPricesUnlocked && (
              <div className="bg-card border border-border rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-center gap-3">
                <p className="text-sm text-muted-foreground flex-1">
                  Enter your email to see sold prices and concessions data.
                </p>
                <form
                  className="flex gap-2 w-full sm:w-auto"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (email.includes('@')) setSoldPricesUnlocked(true)
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-muted border border-border rounded-lg px-3 py-2 text-sm flex-1 sm:w-56 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    Unlock Prices
                  </button>
                </form>
              </div>
            )}

            <ListingCardGrid
              listings={closedListings}
              visibleIds={visibleIds}
              highlightedId={highlightedId}
              priceGated={!soldPricesUnlocked}
            />
          </div>
        )}
      </div>
    </div>
  )
}
