// ABOUTME: Final CTA section — restates identity-level benefit
// ABOUTME: Cream background to separate visually from the navy footer

"use client";

import Link from "next/link";
import type { PersonaLandingConfig } from "@/types/persona-landing";
import { useBrandPath } from "@/lib/BrandProvider";

interface PersonaFinalCtaProps {
  finalCta: PersonaLandingConfig["finalCta"];
  slug: string;
}

export function PersonaFinalCta({ finalCta, slug }: PersonaFinalCtaProps) {
  const bp = useBrandPath();

  return (
    <section className="py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
          {finalCta.headline}
        </h2>
        <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
          {finalCta.subhead}
        </p>
        <Link
          href={bp(finalCta.ctaLink)}
          className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          data-persona={slug}
          data-section="final-cta"
          data-action="cta-click"
        >
          {finalCta.ctaText}
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">{finalCta.reassurance}</p>
      </div>
    </section>
  );
}
