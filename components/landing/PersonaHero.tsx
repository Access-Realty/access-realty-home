// ABOUTME: Hero section for persona landing pages
// ABOUTME: Supports visual mood variants while staying within brand system

"use client";

import Link from "next/link";
import type { PersonaLandingConfig, BackgroundVariant } from "@/types/persona-landing";
import { useBrandPath } from "@/lib/BrandProvider";

const variantStyles: Record<BackgroundVariant, { section: string; headline: string; subhead: string; cta: string; trust: string }> = {
  sharp: {
    section: "bg-gradient-to-br from-primary-dark to-primary",
    headline: "text-primary-foreground font-bold",
    subhead: "text-primary-foreground/85",
    cta: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    trust: "text-primary-foreground/60",
  },
  data: {
    section: "bg-primary",
    headline: "text-primary-foreground font-bold",
    subhead: "text-primary-foreground/85",
    cta: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    trust: "text-primary-foreground/60",
  },
  warm: {
    section: "bg-gradient-to-br from-primary to-primary-light",
    headline: "text-primary-foreground font-bold",
    subhead: "text-primary-foreground/90",
    cta: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    trust: "text-primary-foreground/70",
  },
  pro: {
    section: "bg-gradient-to-b from-primary-dark to-primary",
    headline: "text-primary-foreground font-bold",
    subhead: "text-primary-foreground/85",
    cta: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    trust: "text-primary-foreground/60",
  },
  trust: {
    section: "bg-primary",
    headline: "text-primary-foreground font-bold",
    subhead: "text-primary-foreground/90",
    cta: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    trust: "text-primary-foreground/70",
  },
};

interface PersonaHeroProps {
  hero: PersonaLandingConfig["hero"];
}

export function PersonaHero({ hero }: PersonaHeroProps) {
  const bp = useBrandPath();
  const styles = variantStyles[hero.backgroundVariant];

  return (
    <section className={`pt-40 pb-20 ${styles.section}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full text-center">
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl leading-tight whitespace-pre-line mb-6 ${styles.headline}`}
        >
          {hero.headline}
        </h1>
        <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-8 ${styles.subhead}`}>
          {hero.subhead}
        </p>
        <Link
          href={bp(hero.ctaLink)}
          className={`inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${styles.cta}`}
          data-persona={hero.backgroundVariant}
          data-section="hero"
          data-action="cta-click"
        >
          {hero.ctaText}
        </Link>
        <p className={`mt-6 text-sm ${styles.trust}`}>{hero.trustSignal}</p>
      </div>
    </section>
  );
}
