// ABOUTME: Atomic listing card for SEO property pages — photo, price, specs, status badge
// ABOUTME: Closed listing prices are gated (blurred) until email provided. Shows MLS attribution per NTREIS 17.05/17.07.

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/listing-utils'
import type { SeoListingProps } from '@/types/seo-listing'
import PhotoModal from './PhotoModal'

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
  'Active KO': 'bg-green-600 text-white',
}

// Status display labels (17.10 requires explanation of status symbols)
const STATUS_LABELS: Record<string, string> = {
  Active: 'Active',
  'Active Option Contract': 'Option Contract',
  'Active Contingent': 'Contingent',
  'Active KO': 'Kick Out',
  Closed: 'Sold',
}

interface SeoListingCardProps extends SeoListingProps {
  priceGated?: boolean // true = blur sold prices until email gate crossed
}

export default function SeoListingCard(props: SeoListingCardProps) {
  const {
    listingId, address, price, originalPrice, bedrooms, bathrooms,
    sqft, yearBuilt, parking, status, date, dom, photoUrl, photosCount,
    concessions, listOfficeMlsId, listAgentMlsId, highlighted,
    priceGated = false,
  } = props

  const [showModal, setShowModal] = useState(false)

  const isClosed = status === 'Closed'
  const showPrice = !isClosed || !priceGated
  const hadReduction = originalPrice != null && originalPrice > price
  const hadIncrease = originalPrice != null && originalPrice < price
  const hasConcessions = concessions != null && concessions > 0 && isClosed && showPrice
  const hasPhotos = photoUrl && photosCount > 0

  const streetOnly = address?.split(',')[0] ?? address
  const statusLabel = STATUS_LABELS[status] || status

  return (
    <>
      <div
        data-listing-id={listingId}
        className={`bg-card rounded-xl overflow-hidden border transition-all ${
          highlighted
            ? 'ring-2 ring-primary border-primary shadow-lg'
            : 'border-border hover:shadow-md'
        }`}
      >
        {/* Photo */}
        <div
          className={`relative aspect-[4/3] bg-muted ${hasPhotos ? 'cursor-pointer group' : ''}`}
          onClick={() => hasPhotos && setShowModal(true)}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={streetOnly}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
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
            {statusLabel}
          </div>
          {hasPhotos && photosCount > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {photosCount} photos
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Price — gated for closed listings */}
          {showPrice ? (
            <>
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
                  {formatCompact(concessions)} seller concessions
                </p>
              )}
            </>
          ) : (
            <p className="text-lg font-bold text-primary/40 blur-sm select-none" aria-hidden="true">
              $000,000
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

          {/* Address */}
          <p className="text-sm text-muted-foreground mt-2 truncate">{streetOnly}</p>

          {/* Date + DOM */}
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
            {formatDate(date)}{dom != null && ` · ${dom} days`}
          </div>

          {/* MLS Attribution — per NTREIS 17.05 */}
          {(listOfficeMlsId || listAgentMlsId) && (
            <p className="text-[10px] text-muted-foreground/60 mt-1.5 truncate">
              {[listOfficeMlsId, listAgentMlsId].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>

      {showModal && photoUrl && (
        <PhotoModal
          listingId={listingId}
          address={streetOnly}
          initialPhoto={photoUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
