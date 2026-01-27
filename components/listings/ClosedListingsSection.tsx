// ABOUTME: Server component wrapper for closed listings map
// ABOUTME: Fetches MLS + imported historical listings and renders map with stats

import { getClosedListings, formatVolume } from "@/lib/listings";
import DeckGLListingsMap from "./DeckGLListingsMap";

interface ClosedListingsSectionProps {
  staffId: string;
  agentName: string;
}

export default async function ClosedListingsSection({
  staffId,
  agentName,
}: ClosedListingsSectionProps) {
  const listings = await getClosedListings(staffId);

  if (listings.length === 0) {
    return null; // Don't render section if no closed listings
  }

  // Calculate stats by side
  const listingSide = listings.filter((d) => d.side === "listing");
  const buyerSide = listings.filter((d) => d.side === "buyer");

  const listingVolume = listingSide.reduce(
    (sum, d) => sum + (d.list_price || 0),
    0
  );
  const buyerVolume = buyerSide.reduce(
    (sum, d) => sum + (d.list_price || 0),
    0
  );

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
            TRACK RECORD
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Closed Listings
          </h2>
          <div className="flex flex-col sm:flex-row sm:gap-6 text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">{listingSide.length}</span> homes sold • {formatVolume(listingVolume)}
            </p>
            <p>
              <span className="font-semibold text-foreground">{buyerSide.length}</span> homes bought • {formatVolume(buyerVolume)}
            </p>
          </div>
        </div>

        <DeckGLListingsMap listings={listings} />
      </div>
    </section>
  );
}
