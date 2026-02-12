// ABOUTME: Crawl hub page linking to all persona landing pages
// ABOUTME: Primarily for SEO (Google discovers child pages via links), but functional if visited

import { Metadata } from "next";
import { personaConfigs, validSlugs } from "@/data/personas";
import { HeroSection, Section } from "@/components/layout";
import { DirectListCTA } from "@/components/layout/DirectListCTA";
import { PersonaGrid } from "./PersonaGrid";

export const metadata: Metadata = {
  title: "Sell Your Way | DirectList by Access Realty",
  description:
    "Every seller has a different story. Find the right approach for your home sale — flat fee MLS listing for $2,995 in Dallas-Fort Worth.",
  alternates: {
    canonical: "https://direct-list.com/for",
  },
  openGraph: {
    title: "Sell Your Way | DirectList by Access Realty",
    description:
      "Every seller has a different story. Find the right approach for your home sale — flat fee MLS listing for $2,995 in Dallas-Fort Worth.",
    url: "https://direct-list.com/for",
    siteName: "DirectList by Access Realty",
    type: "website",
    locale: "en_US",
  },
};

export default function ForIndexPage() {
  // CollectionPage schema — content derived from our own persona configs, not user input
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "DirectList — Sell Your Way",
    description:
      "Choose the DirectList approach that matches your selling situation.",
    url: "https://direct-list.com/for",
    hasPart: validSlugs.map((slug) => ({
      "@type": "WebPage",
      name: personaConfigs[slug].meta.title,
      url: `https://direct-list.com/for/${slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Safe: collectionSchema is built entirely from our own static config data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <HeroSection>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Every Seller Has a Different Story
        </h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          Full MLS listing for $2,995 flat — same service, tailored to your
          situation.
        </p>
      </HeroSection>

      <Section maxWidth="5xl">
        <PersonaGrid />
      </Section>

      <DirectListCTA />
    </>
  );
}
