// ABOUTME: Horizontal carousel of listing cards with Airbnb/Zillow-inspired UX
// ABOUTME: Content-only component - wrap with Section at page level for spacing

import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import ListingCard from "./ListingCard";
import CarouselNav from "./CarouselNav";
import { getListings, ACCESS_REALTY_OFFICE_MLS_IDS } from "@/lib/listings";
import type { ListingsFilter } from "@/types/mls";

interface ListingsCarouselProps {
  title?: string;
  subtitle?: string;
  officeIds?: string[];
  agentKey?: string;
  limit?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
  centerTitle?: boolean;
}

export default async function ListingsCarousel({
  title = "Our Current Listings",
  subtitle,
  officeIds = ACCESS_REALTY_OFFICE_MLS_IDS,
  agentKey,
  limit = 12,
  showViewAll = true,
  viewAllHref = "/homes-for-sale",
  centerTitle = false,
}: ListingsCarouselProps) {
  const filter: ListingsFilter = {
    officeIds,
    agentKey,
    status: "Active",
  };

  const { listings, total } = await getListings(filter, limit, 0);

  if (listings.length === 0) {
    return null; // Don't render content if no listings
  }

  return (
    <>
      {/* Header */}
      <div className={`mb-8 ${centerTitle ? "text-center" : "flex flex-col md:flex-row md:items-end md:justify-between gap-4"}`}>
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mt-2 text-lg">{subtitle}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {total} {total === 1 ? "home" : "homes"} available
          </p>
        </div>

        {/* Desktop View All - hide when centered */}
        {showViewAll && !centerTitle && (
          <Link
            href={viewAllHref}
            className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:underline transition-colors"
          >
            View all homes
            <HiArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Use grid for 1-3 listings, carousel for 4+ */}
      {listings.length <= 3 ? (
        <div className={`grid gap-6 ${
          listings.length === 1
            ? "max-w-sm mx-auto"
            : listings.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}>
          {listings.map((listing) => (
            <div key={listing.id}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      ) : (
        <CarouselNav>
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] snap-start"
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </CarouselNav>
      )}

      {/* Mobile View All */}
      {showViewAll && (
        <div className="md:hidden mt-8 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            View all homes
            <HiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </>
  );
}
