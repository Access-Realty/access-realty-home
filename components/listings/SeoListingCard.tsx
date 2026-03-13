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
