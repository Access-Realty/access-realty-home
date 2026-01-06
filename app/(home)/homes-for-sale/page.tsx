// ABOUTME: Inventory page showing all Access Realty listings
// ABOUTME: Features grid layout with load-more pagination, ISR refresh

import { Metadata } from "next";
import ListingsGrid from "@/components/listings/ListingsGrid";
import { getListings } from "@/lib/listings";
import { HeroSection, Section, AccessCTA } from "@/components/layout";

export const metadata: Metadata = {
  title: "Homes for Sale | Access Realty",
  description:
    "Browse homes for sale represented by Access Realty. Find your perfect home in the Dallas-Fort Worth area.",
  openGraph: {
    title: "Homes for Sale | Access Realty",
    description:
      "Browse homes for sale represented by Access Realty. Find your perfect home in the Dallas-Fort Worth area.",
  },
};

// Revalidate every hour
export const revalidate = 3600;

const ITEMS_PER_PAGE = 12;

// Server action for loading more listings
async function loadMoreListings(offset: number) {
  "use server";
  const { listings, hasMore } = await getListings({}, ITEMS_PER_PAGE, offset);
  return { listings, hasMore };
}

export default async function HomesForSale() {
  const { listings, total, hasMore } = await getListings({}, ITEMS_PER_PAGE, 0);

  return (
    <>
      {/* Hero Section */}
      <HeroSection maxWidth="4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
          Homes for Sale
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
          Explore our current listings in the Dallas-Fort Worth area
        </p>
      </HeroSection>

      {/* Listings Section */}
      <Section variant="content" maxWidth="6xl" background="default">
        <ListingsGrid
          initialListings={listings}
          initialTotal={total}
          initialHasMore={hasMore}
          loadMoreAction={loadMoreListings}
        />
      </Section>

      <AccessCTA
        heading="Looking to Sell Your Home?"
        subheading="List your home on MLS for a flat fee and save thousands in commissions."
        buttonText="Learn About DirectList"
        buttonHref="/direct-list"
      />
    </>
  );
}
