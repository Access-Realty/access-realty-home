// ABOUTME: Crawl hub page linking to all persona landing pages
// ABOUTME: Primarily for SEO (Google discovers child pages via links), but functional if visited

import { Metadata } from "next";
import Link from "next/link";
import { personaConfigs, validSlugs } from "@/data/personas";
import { HeroSection, Section } from "@/components/layout";
import { DirectListCTA } from "@/components/layout/DirectListCTA";

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

const personaLabels: Record<string, string> = {
  "fresh-start": "Starting Fresh",
  "smart-sellers": "Smart Sellers",
  investors: "Investors",
  "starting-over": "Starting Over",
  "family-home": "Family Home",
  fire: "FIRE Movement",
  "your-way": "Your Way",
  "next-chapter": "Next Chapter",
  "experienced-sellers": "Experienced Sellers",
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
        <div className="grid md:grid-cols-3 gap-6">
          {validSlugs.map((slug) => {
            const config = personaConfigs[slug];
            return (
              <Link
                key={slug}
                href={`/direct-list/for/${slug}`}
                className="block p-6 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
              >
                <h2 className="text-lg font-bold text-primary mb-2">
                  {personaLabels[slug] || slug}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {config.meta.description}
                </p>
              </Link>
            );
          })}
        </div>
      </Section>

      <DirectListCTA />
    </>
  );
}
