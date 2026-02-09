// ABOUTME: Persona-specific objection handling styled as mind-reading
// ABOUTME: Framed as "you might wonder" — not FAQ, but anticipated doubts

import { Section } from "@/components/layout/Section";
import type { PersonaLandingConfig } from "@/types/persona-landing";

interface ObjectionSectionProps {
  objections: PersonaLandingConfig["objections"];
}

export function ObjectionSection({ objections }: ObjectionSectionProps) {
  return (
    <Section variant="content" maxWidth="3xl">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
        You Might Be Wondering
      </h2>
      <div className="space-y-6">
        {objections.map((obj, i) => (
          <div key={i} className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <p className="font-semibold text-foreground mb-3">{obj.question}</p>
            <p className="text-foreground/80 leading-relaxed">{obj.answer}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
