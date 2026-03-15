// ABOUTME: Atomic listing card for SEO property pages — photo, price, specs, status badge
// ABOUTME: No navigation/links — informational only. Separate from ListingCard.tsx

import Image from 'next/image'
import { formatPrice } from '@/lib/listing-utils'
import type { SeoListingProps } from '@/types/seo-listing'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatPriceChange(price: number, originalPrice: number): { text: string; direction: 'down' | 'up' } {
  const diff = Math.abs(originalPrice - price)
  const formatted = formatPrice(diff)
  if (price < originalPrice) {
    return { text: `↓ ${formatted} from ${formatPrice(originalPrice)}`, direction: 'down' }
  }
  return { text: `↑ ${formatted} from ${formatPrice(originalPrice)}`, direction: 'up' }
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
    address, city, postalCode, price, originalPrice, bedrooms, bathrooms,
    sqft, yearBuilt, parking, status, date, dom, photoUrl, concessions, highlighted,
  } = props

  const isClosed = status === 'Closed'
  const hadPriceChange = originalPrice != null && originalPrice !== price
  const priceChange = hadPriceChange ? formatPriceChange(price, originalPrice) : null

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
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[status] || 'bg-gray-500 text-white'}`}>
          {status}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Price */}
        <p className="text-xl font-bold text-foreground">{formatPrice(price)}</p>
        {priceChange && (
          <p className={`text-xs ${priceChange.direction === 'down' ? 'text-red-500' : 'text-green-600'}`}>
            {priceChange.text}
          </p>
        )}

        {/* Specs row 1: bed · bath · parking */}
        <p className="text-sm text-foreground font-medium">
          {[
            bedrooms != null ? `${bedrooms} bd` : null,
            bathrooms != null ? `${bathrooms} ba` : null,
            parking != null ? `${parking} car` : null,
          ].filter(Boolean).join(' · ')}
        </p>

        {/* Specs row 2: sqft · year built */}
        <p className="text-sm text-muted-foreground">
          {[
            sqft ? `${sqft.toLocaleString()} sqft` : null,
            yearBuilt ? `Built ${yearBuilt}` : null,
          ].filter(Boolean).join(' · ')}
        </p>

        {/* Address */}
        <p className="text-sm text-muted-foreground truncate">{address}</p>
        <p className="text-sm text-muted-foreground">{city}, TX {postalCode}</p>

        {/* Date + DOM — clean single line */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
          <span>{formatDate(date)}</span>
          {dom != null && (
            <>
              <span>·</span>
              <span>{dom}d on market</span>
            </>
          )}
          {concessions != null && concessions > 0 && isClosed && (
            <>
              <span>·</span>
              <span className="text-secondary">{formatPrice(concessions)} concessions</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
