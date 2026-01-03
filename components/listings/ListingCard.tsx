// ABOUTME: Card component displaying a single MLS listing with Airbnb/Zillow-inspired UX
// ABOUTME: Photo carousel, price, specs, and address with smooth interactions

"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import type { MlsListing } from "@/types/mls";
import {
  formatPrice,
  formatSqft,
  formatAddress,
  formatCityState,
  getPrimaryPhoto,
} from "@/lib/listing-utils";

interface ListingCardProps {
  listing: MlsListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const photos = listing.photo_urls?.slice(0, 5) ?? [];
  const hasMultiplePhotos = photos.length > 1;
  const currentPhoto = photos[currentPhotoIndex] || getPrimaryPhoto(listing);

  const handlePrevPhoto = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageLoading(true);
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const handleNextPhoto = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageLoading(true);
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  const detailUrl = `/homes-for-sale/${listing.listing_id}`;

  // Format specs line: 3 bd | 2 ba | 1,850 sqft
  const specsLine = [
    listing.bedrooms_total ? `${listing.bedrooms_total} bd` : null,
    listing.bathrooms_total_decimal ? `${listing.bathrooms_total_decimal} ba` : null,
    listing.living_area ? formatSqft(listing.living_area) : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <Link
      href={detailUrl}
      className="group block rounded-xl overflow-hidden bg-card transition-all duration-300 hover:shadow-xl"
    >
      {/* Photo container - 4:3 aspect like Zillow */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* Loading skeleton */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 animate-pulse" />
        )}

        <Image
          src={currentPhoto}
          alt={formatAddress(listing)}
          fill
          className={`object-cover transition-all duration-500 ${
            isImageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
          } group-hover:scale-105`}
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 340px"
          onLoad={() => setIsImageLoading(false)}
          priority={false}
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Photo navigation arrows - Airbnb style */}
        {hasMultiplePhotos && (
          <>
            <button
              onClick={handlePrevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              aria-label="Previous photo"
            >
              <HiChevronLeft className="h-5 w-5 text-gray-800" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              aria-label="Next photo"
            >
              <HiChevronRight className="h-5 w-5 text-gray-800" />
            </button>

            {/* Photo dots - Airbnb style */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentPhotoIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Photo count badge */}
        {photos.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            {currentPhotoIndex + 1}/{photos.length}
          </div>
        )}
      </div>

      {/* Content - Zillow-inspired layout */}
      <div className="p-4">
        {/* Price - Large and prominent */}
        <p className="text-xl font-bold text-foreground">
          {formatPrice(listing.list_price)}
        </p>

        {/* Specs line */}
        {specsLine && (
          <p className="text-sm text-foreground mt-1 font-medium">
            {specsLine}
          </p>
        )}

        {/* Address */}
        <p className="text-sm text-muted-foreground mt-2 truncate">
          {formatAddress(listing)}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatCityState(listing)}
        </p>
      </div>
    </Link>
  );
}
