// ABOUTME: Immersive property hero — full-width photo with overlaid title, specs, and AVM card
// ABOUTME: Merges photo + property info into one cinematic section

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
  avmValue: string
  avmLow: string
  avmHigh: string
  bedrooms: number
  bathrooms: number
  sqft: string
  yearBuilt: number
}

export default function PropertyHero({
  imageUrl, address, city, state, zip, specs, lotSize, source,
  avmValue, avmLow, avmHigh,
  bedrooms, bathrooms, sqft, yearBuilt,
}: PropertyHeroProps) {
  if (!imageUrl) return null

  return (
    <section className="relative">
      {/* Photo — tall, immersive */}
      <div className="relative w-full h-[420px] md:h-[480px] bg-primary overflow-hidden">
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

        {/* Gradient overlay — photo fades into navy at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary" />

        {/* Content overlaid on photo */}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 pb-8">
            <div className="grid md:grid-cols-[1fr_320px] gap-6 items-end">
              {/* Left: Title + specs */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {address}
                </h1>
                <p className="text-white/80 text-lg mb-1">
                  {city}, {state} {zip}
                </p>
                <p className="text-white/60 text-sm">{specs}</p>
              </div>

              {/* Right: AVM card — glass morphism on the photo */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-2xl">
                <h2 className="text-base font-bold text-foreground mb-1">Estimated Home Value</h2>
                <p className="text-xs text-muted-foreground mb-3">
                  Based on recent sales and market trends.
                </p>
                <div className="bg-muted rounded-lg p-3 mb-3 text-center">
                  <div className="text-2xl font-bold text-primary blur-sm select-none" aria-hidden="true">
                    {avmValue}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{avmLow} – {avmHigh}</div>
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-lg hover:bg-secondary/90 transition-colors text-sm">
                  See Estimated Value
                </button>
                <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                  Free · No obligation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spec pills — sit right below the photo in a cream band */}
      <div className="bg-primary">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-wrap gap-2.5">
            {[
              `${bedrooms} Bed`,
              `${bathrooms} Bath`,
              `${sqft} sqft`,
              `Built ${yearBuilt}`,
              `${Number(lotSize).toFixed(2)} ac`,
            ].map((label) => (
              <div
                key={label}
                className="bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/90 font-medium"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
