// ABOUTME: "The Reframe" section — repositions the problem
// ABOUTME: Introduces Access Realty as the tool that fits the reader's identity

import { Section } from "@/components/layout/Section";
import type { PersonaLandingConfig } from "@/types/persona-landing";

interface ReframeSectionProps {
  reframe: PersonaLandingConfig["reframe"];
}

export function ReframeSection({ reframe }: ReframeSectionProps) {
  return (
    <Section variant="content" maxWidth="3xl">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
        {reframe.headline}
      </h2>
      <div className="space-y-4">
        {reframe.body.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-foreground/80 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      {reframe.highlightStat && (
        <div className="mt-8 bg-card rounded-xl p-8 text-center shadow-sm border border-border">
          <p className="text-4xl md:text-5xl font-bold text-primary">
            {reframe.highlightStat.number}
          </p>
          <p className="text-muted-foreground mt-2">{reframe.highlightStat.label}</p>
        </div>
      )}
    </Section>
  );
}
