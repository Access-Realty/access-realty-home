// ABOUTME: Server component for company-wide closed listings map
// ABOUTME: Aggregates all staff MLS + imported deals for /our-team page
// ABOUTME: Shows raw stats in headline (every deal), deduped data on map

import { getCompanyClosedListings, formatVolume } from "@/lib/listings";
import DeckGLListingsMap from "./DeckGLListingsMap";

export default async function CompanyClosedListingsSection() {
  const { listings, stats } = await getCompanyClosedListings();

  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
            OUR TRACK RECORD
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Completed Listings
          </h2>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {stats.totalTransactions.toLocaleString()}
            </span>{" "}
            transactions · {formatVolume(stats.totalVolume)}
          </p>
        </div>

        <DeckGLListingsMap listings={listings} />
      </div>
    </section>
  );
}
