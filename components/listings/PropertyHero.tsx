// ABOUTME: Immersive property hero — full-width photo with overlaid title and specs
// ABOUTME: Clean layout: photo + address + city + specs text line. AVM card lives elsewhere.

import Image from 'next/image'

interface PropertyHeroProps {
  imageUrl: string
  address: string
  city: string
  state: string
  zip: string
  specs: string
  lotSize: string
  source: 'mls' | 'streetview'
}

export default function PropertyHero({
  imageUrl, address, city, state, zip, specs, lotSize, source,
}: PropertyHeroProps) {
  if (!imageUrl) return null

  return (
    <section className="relative">
      <div className="relative w-full h-[350px] md:h-[420px] bg-primary overflow-hidden">
        {source === 'mls' ? (
          <Image
            src={imageUrl}
            alt={address}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`Street view of ${address}`}
            className="w-full h-full object-cover"
          />
        )}

        {/* Gradient — subtle at top for header readability, stronger at bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

        {/* Title overlaid at bottom */}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 pb-6 md:pb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 drop-shadow-lg">
              {address}
            </h1>
            <p className="text-white/80 text-lg">
              {city}, {state} {zip}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {specs} · {lotSize} acres
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
