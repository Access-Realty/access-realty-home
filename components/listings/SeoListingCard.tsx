// ABOUTME: Atomic listing card for SEO property pages — photo, price, specs, status badge
// ABOUTME: No navigation/links — informational only. Separate from ListingCard.tsx

import Image from 'next/image'
import { formatPrice } from '@/lib/listing-utils'
import type { SeoListingProps } from '@/types/seo-listing'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatCompact(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return formatPrice(amount)
}

const STATUS_COLORS: Record<string, string> = {
  Closed: 'bg-primary text-primary-foreground',
  Active: 'bg-green-600 text-white',
  'Active Option Contract': 'bg-green-600 text-white',
  'Active Contingent': 'bg-green-600 text-white',
  Pending: 'bg-amber-500 text-white',
}

export default function SeoListingCard(props: SeoListingProps) {
  const {
    address, price, originalPrice, bedrooms, bathrooms,
    sqft, yearBuilt, parking, status, date, dom, photoUrl, concessions, highlighted,
  } = props

  const isClosed = status === 'Closed'
  const hadReduction = originalPrice != null && originalPrice > price
  const hadIncrease = originalPrice != null && originalPrice < price
  const hasConcessions = concessions != null && concessions > 0 && isClosed

  // Strip city/state/zip from address if present (e.g., "2125 Bird Street, Fort Worth TX 76111" → "2125 Bird Street")
  const streetOnly = address?.split(',')[0] ?? address

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
            alt={streetOnly}
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
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[status] || 'bg-gray-500 text-white'}`}>
          {status}
        </div>
      </div>

      <div className="p-4">
        {/* Price block — the full money story */}
        <p className="text-xl font-bold text-foreground">{formatPrice(price)}</p>
        {hadReduction && (
          <p className="text-xs text-amber-600 mt-0.5">
            ↓ {formatCompact(originalPrice - price)} from {formatCompact(originalPrice)}
          </p>
        )}
        {hadIncrease && (
          <p className="text-xs text-green-600 mt-0.5">
            ↑ {formatCompact(price - originalPrice)} from {formatCompact(originalPrice)}
          </p>
        )}
        {hasConcessions && (
          <p className="text-xs text-red-500 mt-0.5">
            {formatCompact(concessions)} concessions
          </p>
        )}

        {/* Specs */}
        <div className="mt-3 space-y-1">
          <p className="text-sm text-foreground font-medium">
            {[
              bedrooms != null ? `${bedrooms} bd` : null,
              bathrooms != null ? `${bathrooms} ba` : null,
              parking != null ? `${parking} car` : null,
            ].filter(Boolean).join(' · ')}
          </p>
          <p className="text-sm text-muted-foreground">
            {[
              sqft ? `${sqft.toLocaleString()} sqft` : null,
              yearBuilt ? `Built ${yearBuilt}` : null,
            ].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Address — street only, no city/state/zip */}
        <p className="text-sm text-muted-foreground mt-2 truncate">{streetOnly}</p>

        {/* Date + DOM */}
        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
          {formatDate(date)}{dom != null && ` · ${dom} days`}
        </div>
      </div>
    </div>
  )
}
