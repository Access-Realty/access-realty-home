// ABOUTME: Horizontal looping carousel of SeoListingCards
// ABOUTME: Replaces vertical grid — swipe sideways, wraps around at ends

'use client'

import { useRef, useCallback, useMemo } from 'react'
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
  const scrollRef = useRef<HTMLDivElement>(null)

  const visibleListings = useMemo(() => {
    const visibleSet = new Set(visibleIds)
    return listings.filter((l) => visibleSet.has(l.listingId))
  }, [listings, visibleIds])

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return

    const cardWidth = 300
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth

    // If at the end, loop to start (and vice versa)
    if (direction === 'right' && container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
    } else if (direction === 'left' && container.scrollLeft <= 10) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }, [])

  if (visibleListings.length === 0) return null

  return (
    <div className="relative group/carousel -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-[calc((100vw-64rem)/2+2rem)]">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg border border-border hover:bg-white hover:scale-105 transition-all opacity-0 group-hover/carousel:opacity-100"
        aria-label="Previous"
      >
        <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg border border-border hover:bg-white hover:scale-105 transition-all opacity-0 group-hover/carousel:opacity-100"
        aria-label="Next"
      >
        <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scrollable card row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-4 sm:px-6 lg:px-8 scrollbar-hide"
        // eslint-disable-next-line access-realty/no-inline-styles
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleListings.map((listing) => (
          <div
            key={listing.listingId}
            className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start"
          >
            <SeoListingCard
              {...listing}
              highlighted={listing.listingId === highlightedId}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
