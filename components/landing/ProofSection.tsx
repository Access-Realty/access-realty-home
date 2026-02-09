// ABOUTME: Proof section combining savings calculator, testimonial, and stats
// ABOUTME: The evidence block that makes the emotional pitch concrete

import { Section } from "@/components/layout/Section";
import { SavingsCalculator } from "./SavingsCalculator";
import type { PersonaLandingConfig } from "@/types/persona-landing";

interface ProofSectionProps {
  proof: PersonaLandingConfig["proof"];
  slug: string;
}

export function ProofSection({ proof, slug }: ProofSectionProps) {
  return (
    <Section variant="content" maxWidth="4xl">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Calculator */}
        <SavingsCalculator
          preset={proof.calculatorPreset}
          variant={proof.calculatorVariant}
          slug={slug}
        />

        {/* Social proof column */}
        <div className="space-y-6">
          {proof.testimonial && (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <blockquote className="text-foreground/80 leading-relaxed italic">
                &ldquo;{proof.testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-4">
                <p className="font-semibold text-foreground">{proof.testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{proof.testimonial.detail}</p>
              </div>
            </div>
          )}

          {proof.stat && (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border text-center">
              <p className="text-3xl font-bold text-primary">{proof.stat.number}</p>
              <p className="text-sm text-muted-foreground mt-1">{proof.stat.context}</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
