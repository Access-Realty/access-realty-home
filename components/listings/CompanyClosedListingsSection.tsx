// ABOUTME: Server component for company-wide closed listings map
// ABOUTME: Aggregates all staff MLS + imported deals for /our-team page

import { getCompanyClosedListings, formatVolume } from "@/lib/listings";
import DeckGLListingsMap from "./DeckGLListingsMap";

export default async function CompanyClosedListingsSection() {
  const listings = await getCompanyClosedListings();

  if (listings.length === 0) {
    return null;
  }

  const totalVolume = listings.reduce((sum, d) => sum + (d.list_price || 0), 0);

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
              {listings.length.toLocaleString()}
            </span>{" "}
            transactions · {formatVolume(totalVolume)}
          </p>
        </div>

        <DeckGLListingsMap listings={listings} />
      </div>
    </section>
  );
}
