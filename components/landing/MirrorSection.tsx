// ABOUTME: "The Mirror" section — validates the reader's worldview
// ABOUTME: Creates the recognition moment before introducing the product

import { Section } from "@/components/layout/Section";
import type { PersonaLandingConfig } from "@/types/persona-landing";

interface MirrorSectionProps {
  mirror: PersonaLandingConfig["mirror"];
}

export function MirrorSection({ mirror }: MirrorSectionProps) {
  return (
    <Section variant="content" maxWidth="3xl">
      <p className="text-lg font-semibold text-primary mb-6">{mirror.opener}</p>
      <div className="space-y-4">
        {mirror.statements.map((statement, i) => (
          <p key={i} className="text-foreground/80 leading-relaxed text-base">
            {statement}
          </p>
        ))}
      </div>
    </Section>
  );
}
