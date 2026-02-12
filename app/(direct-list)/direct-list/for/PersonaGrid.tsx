// ABOUTME: Client component for persona link grid on the /for hub page
// ABOUTME: Uses useBrandPath to generate correct links on both access.realty and direct-list.com

"use client";

import Link from "next/link";
import { personaConfigs, validSlugs } from "@/data/personas";
import { useBrandPath } from "@/lib/BrandProvider";

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

export function PersonaGrid() {
  const bp = useBrandPath();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {validSlugs.map((slug) => {
        const config = personaConfigs[slug];
        return (
          <Link
            key={slug}
            href={bp(`/direct-list/for/${slug}`)}
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
  );
}
