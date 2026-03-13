// ABOUTME: Lightweight listing popup for Mapbox map pin clicks
// ABOUTME: Rendered inside react-map-gl <Popup> — must be compact

import { formatPrice, formatSpecsLine } from '@/lib/listing-utils'
import type { SeoListingProps } from '@/types/seo-listing'

interface ListingPopupProps {
  listing: SeoListingProps
  onClose: () => void
}

export default function ListingPopup({ listing, onClose }: ListingPopupProps) {
  const specsLine = formatSpecsLine(listing.bedrooms, listing.bathrooms, listing.sqft)

  return (
    <div className="w-[260px]">
      <button
        onClick={onClose}
        className="absolute top-1 right-1 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        aria-label="Close popup"
      >
        ×
      </button>
      {listing.photoUrl && (
        <img
          src={listing.photoUrl}
          alt={listing.address}
          className="w-full h-32 object-cover rounded-t"
        />
      )}
      <div className="p-2.5">
        <p className="font-bold text-sm text-gray-900">{formatPrice(listing.price)}</p>
        <p className="text-xs text-gray-600 mt-0.5">{specsLine}</p>
        <p className="text-xs text-gray-500 mt-1 truncate">{listing.address}</p>
        <p className="text-xs text-gray-500">{listing.city}, TX {listing.postalCode}</p>
      </div>
    </div>
  )
}
