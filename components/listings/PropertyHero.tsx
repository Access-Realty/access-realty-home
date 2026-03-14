// ABOUTME: Full-width hero image for SEO property pages
// ABOUTME: Shows MLS photo or Google Street View fallback

import Image from 'next/image'

interface PropertyHeroProps {
  imageUrl: string
  address: string
  source: 'mls' | 'streetview'
}

export default function PropertyHero({ imageUrl, address, source }: PropertyHeroProps) {
  if (!imageUrl) return null

  return (
    <div className="relative w-full h-[250px] md:h-[300px] bg-muted overflow-hidden">
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
        // Street View URLs are external/dynamic — use img tag
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`Street view of ${address}`}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 sm:left-6 lg:left-8">
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
          {source === 'mls' ? 'MLS Photo' : 'Street View'}
        </p>
      </div>
    </div>
  )
}
