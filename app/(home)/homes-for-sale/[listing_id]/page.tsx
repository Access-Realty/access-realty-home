// ABOUTME: Individual listing detail page with full property information
// ABOUTME: Photo gallery, specs, description, and contact CTA

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { HiArrowLeft, HiMapPin } from "react-icons/hi2";
import {
  getListingById,
  getListings,
  formatPrice,
  formatAddress,
  formatCityState,
  formatSqft,
} from "@/lib/listings";
import ListingsCarousel from "@/components/listings/ListingsCarousel";
import { Section } from "@/components/layout";

interface PageProps {
  params: Promise<{ listing_id: string }>;
}

// Generate static params for top listings (SEO optimization)
export async function generateStaticParams() {
  const { listings } = await getListings({}, 50, 0);
  return listings
    .filter((l) => l.listing_id)
    .map((listing) => ({
      listing_id: listing.listing_id!,
    }));
}

// Dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { listing_id } = await params;
  const listing = await getListingById(listing_id);

  if (!listing) {
    return { title: "Listing Not Found | Access Realty" };
  }

  const address = formatAddress(listing);
  const cityState = formatCityState(listing);
  const price = formatPrice(listing.list_price);

  return {
    title: `${address}, ${cityState} | ${price} | Access Realty`,
    description: listing.public_remarks?.slice(0, 160) || `${listing.bedrooms_total} bed, ${listing.bathrooms_total_decimal} bath home in ${listing.city}`,
    openGraph: {
      title: `${address} | ${price}`,
      description: listing.public_remarks?.slice(0, 160) || `${listing.bedrooms_total} bed, ${listing.bathrooms_total_decimal} bath home`,
      images: listing.photo_urls?.[0] ? [listing.photo_urls[0]] : undefined,
    },
  };
}

// Revalidate on-demand (new listings render server-side, then cache)
export const revalidate = 3600;

// Generate JSON-LD structured data for SEO
function generateJsonLd(listing: NonNullable<Awaited<ReturnType<typeof getListingById>>>) {
  const address = formatAddress(listing);
  const cityState = formatCityState(listing);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${address}, ${cityState}`,
    description: listing.public_remarks?.slice(0, 500) || `${listing.bedrooms_total} bedroom, ${listing.bathrooms_total_decimal} bathroom home in ${listing.city}`,
    url: `https://access.realty/homes-for-sale/${listing.listing_id}`,
    datePosted: listing.on_market_date || undefined,
    image: listing.photo_urls?.slice(0, 6) || [],
    offers: {
      "@type": "Offer",
      price: listing.list_price,
      priceCurrency: "USD",
      availability: listing.standard_status === "Active" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.unparsed_address || `${listing.street_number} ${listing.street_name} ${listing.street_suffix}`.trim(),
      addressLocality: listing.city,
      addressRegion: listing.state_or_province,
      postalCode: listing.postal_code,
      addressCountry: "US",
    },
    geo: listing.latitude && listing.longitude ? {
      "@type": "GeoCoordinates",
      latitude: listing.latitude,
      longitude: listing.longitude,
    } : undefined,
    floorSize: listing.living_area ? {
      "@type": "QuantitativeValue",
      value: listing.living_area,
      unitCode: "FTK", // square feet
    } : undefined,
    numberOfRooms: listing.bedrooms_total,
    numberOfBathroomsTotal: listing.bathrooms_total_decimal,
    yearBuilt: listing.year_built,
  };
}

export default async function ListingDetail({ params }: PageProps) {
  const { listing_id } = await params;
  const listing = await getListingById(listing_id);

  if (!listing) {
    notFound();
  }

  const photos = listing.photo_urls || [];
  const primaryPhoto = photos[0];
  const secondaryPhotos = photos.slice(1, 5);

  // Property details - Zillow-style "Facts & Features" (no duplicates of quick specs)
  const propertyDetails = [
    { label: "Year Built", value: listing.year_built },
    { label: "Property Type", value: listing.property_sub_type || listing.property_type },
    { label: "Stories", value: listing.stories },
    { label: "Garage", value: listing.garage_spaces ? `${listing.garage_spaces}-car garage` : null },
    { label: "Parking", value: listing.parking_total && listing.parking_total !== listing.garage_spaces ? `${listing.parking_total} total spaces` : null },
    { label: "Pool", value: listing.pool_private_yn ? "Yes" : null },
    { label: "Fireplaces", value: listing.fireplaces_total },
    { label: "HOA", value: listing.association_yn === true ? "Yes" : (listing.association_yn === false ? "No" : null) },
    { label: "County", value: listing.county_or_parish },
  ].filter((s) => s.value !== null && s.value !== undefined);

  // School info
  const schools = [
    { label: "Elementary", value: listing.elementary_school },
    { label: "Middle School", value: listing.middle_or_junior_school },
    { label: "High School", value: listing.high_school },
  ].filter((s) => s.value !== null && s.value !== undefined);

  const jsonLd = generateJsonLd(listing);

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD structured data for SEO */}
      <Script
        id="listing-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>

      {/* Photo Gallery - Compact Zillow-style grid */}
      <section className="bg-background pt-20">
        <div className="container mx-auto px-4 py-4">
          <div className="relative grid grid-cols-4 gap-1 rounded-xl overflow-hidden max-h-[400px]">
            {/* Back button overlay */}
            <Link
              href="/homes-for-sale"
              className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 bg-white/90 hover:bg-white text-foreground px-3 py-2 rounded-full shadow-md transition-colors text-sm font-medium"
            >
              <HiArrowLeft className="h-4 w-4" />
              All homes
            </Link>
            {/* Primary photo - 2x2 */}
            {primaryPhoto && (
              <div className="relative col-span-2 row-span-2">
                <Image
                  src={primaryPhoto}
                  alt={formatAddress(listing)}
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />
              </div>
            )}
            {/* Secondary photos - single cells */}
            {secondaryPhotos.slice(0, 4).map((photo, idx) => (
              <div key={idx} className="relative aspect-[4/3]">
                <Image
                  src={photo}
                  alt={`${formatAddress(listing)} - Photo ${idx + 2}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                {/* Show more overlay on last visible photo */}
                {idx === 3 && photos.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg">
                    +{photos.length - 5} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <Section variant="tight" className="!py-8">
            {/* Details */}
            <div className="space-y-8">
              {/* Price and Address */}
              <div>
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  {formatPrice(listing.list_price)}
                </p>
                <div className="flex items-start gap-2 mt-2">
                  <HiMapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      {formatAddress(listing)}
                    </p>
                    <p className="text-muted-foreground">
                      {formatCityState(listing)} {listing.postal_code}
                    </p>
                    {listing.subdivision_name && (
                      <p className="text-sm text-muted-foreground">
                        {listing.subdivision_name}
                      </p>
                    )}
                  </div>
                </div>
                {listing.listing_id && (
                  <p className="text-sm text-muted-foreground mt-2">
                    MLS #: {listing.listing_id}
                  </p>
                )}
              </div>

              {/* Quick specs bar */}
              <div className="flex flex-wrap gap-6 py-4 border-y border-border">
                {listing.bedrooms_total && (
                  <div>
                    <span className="text-2xl font-bold text-foreground">{listing.bedrooms_total}</span>
                    <span className="text-muted-foreground ml-1">beds</span>
                  </div>
                )}
                {listing.bathrooms_total_decimal && (
                  <div>
                    <span className="text-2xl font-bold text-foreground">{listing.bathrooms_total_decimal}</span>
                    <span className="text-muted-foreground ml-1">baths</span>
                  </div>
                )}
                {listing.living_area && (
                  <div>
                    <span className="text-2xl font-bold text-foreground">{listing.living_area.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1">sqft</span>
                  </div>
                )}
                {listing.lot_size_acres && (
                  <div>
                    <span className="text-2xl font-bold text-foreground">{listing.lot_size_acres.toFixed(2)}</span>
                    <span className="text-muted-foreground ml-1">acres</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {listing.public_remarks && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">About This Home</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {listing.public_remarks}
                  </p>
                </div>
              )}

              {/* Property Details - Zillow-style table */}
              {propertyDetails.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">Facts & Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
                    {propertyDetails.map((detail) => (
                      <div key={detail.label} className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">{detail.label}</span>
                        <span className="font-medium text-foreground">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schools */}
              {schools.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">Schools</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                    {schools.map((school) => (
                      <div key={school.label} className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">{school.label}</span>
                        <span className="font-medium text-foreground text-right">{school.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
      </Section>

      {/* Similar Listings */}
      <ListingsCarousel
        title="More Homes You May Like"
        subtitle="Explore similar properties in the area"
        limit={8}
      />
    </div>
  );
}
