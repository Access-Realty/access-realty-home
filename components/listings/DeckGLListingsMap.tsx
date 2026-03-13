// ABOUTME: TEMPORARY PLACEHOLDER — deck.gl removed in favor of Mapbox GL JS
// ABOUTME: Staff page map migration is tracked separately
// TODO: Migrate to Mapbox GL JS (separate task from SEO map work)

"use client";

import type { ClosedListing } from "@/lib/listings";

interface DeckGLListingsMapProps {
  listings: ClosedListing[];
}

export default function DeckGLListingsMap({ listings }: DeckGLListingsMapProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <div className="relative h-[400px] flex items-center justify-center bg-muted">
        <div className="text-center text-muted-foreground">
          <p className="text-sm font-medium">Map temporarily unavailable</p>
          <p className="text-xs mt-1">{listings.length} closed deals</p>
          <p className="text-xs mt-1">Mapbox migration in progress</p>
        </div>
      </div>
    </div>
  );
}
