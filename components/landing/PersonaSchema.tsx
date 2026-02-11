// ABOUTME: JSON-LD structured data for persona landing pages
// ABOUTME: Outputs Service, FAQPage, and RealEstateAgent schemas for rich search results

import type { PersonaLandingConfig } from "@/types/persona-landing";

interface PersonaSchemaProps {
  config: PersonaLandingConfig;
}

export function PersonaSchema({ config }: PersonaSchemaProps) {
  const canonicalUrl = `https://direct-list.com/for/${config.slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Real Estate Listing Service",
    name: "DirectList Flat Fee MLS Listing",
    description: config.meta.description,
    url: canonicalUrl,
    provider: {
      "@type": "RealEstateAgent",
      "@id": "https://direct-list.com/#organization",
      name: "Access Realty",
      alternateName: "DirectList by Access Realty",
      url: "https://direct-list.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dallas-Fort Worth",
        addressRegion: "TX",
        addressCountry: "US",
      },
      areaServed: {
        "@type": "GeoShape",
        name: "Dallas-Fort Worth Metroplex",
      },
    },
    offers: {
      "@type": "Offer",
      price: "2995",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://direct-list.com/get-started",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.objections.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // Content is derived entirely from our own persona config data (not user input),
  // so dangerouslySetInnerHTML is safe here — this is the standard Next.js pattern
  // for JSON-LD structured data.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
