// ABOUTME: Full-screen photo carousel modal for listing photos
// ABOUTME: Fetches full photo array on-demand via API route

'use client'

import { useState, useEffect, useCallback } from 'react'

interface PhotoModalProps {
  listingId: string
  address: string
  initialPhoto: string
  onClose: () => void
}

export default function PhotoModal({ listingId, address, initialPhoto, onClose }: PhotoModalProps) {
  const [photos, setPhotos] = useState<string[]>([initialPhoto])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch full photo array
  useEffect(() => {
    fetch(`/api/listing-photos?id=${encodeURIComponent(listingId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.photos?.length > 0) {
          setPhotos(data.photos)
        }
      })
      .finally(() => setLoading(false))
  }, [listingId])

  const prev = useCallback(() => {
    setCurrentIndex(i => (i === 0 ? photos.length - 1 : i - 1))
  }, [photos.length])

  const next = useCallback(() => {
    setCurrentIndex(i => (i === photos.length - 1 ? 0 : i + 1))
  }, [photos.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white text-3xl font-light"
        aria-label="Close"
      >
        ×
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 text-white/80 text-sm">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Address */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {address}
      </div>

      {/* Photo */}
      <div
        className="relative max-w-5xl max-h-[80vh] w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[currentIndex]}
          alt={`${address} — Photo ${currentIndex + 1}`}
          className="w-full h-full max-h-[80vh] object-contain rounded-lg"
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Prev/Next arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-2xl transition-colors"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-2xl transition-colors"
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}
