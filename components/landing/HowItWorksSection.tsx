// ABOUTME: 3-step walkthrough emphasizing emotional payoff at each step
// ABOUTME: Numbered steps with both functional description and feeling

import { Section } from "@/components/layout/Section";
import type { PersonaLandingConfig } from "@/types/persona-landing";

interface HowItWorksSectionProps {
  howItWorks: PersonaLandingConfig["howItWorks"];
}

export function HowItWorksSection({ howItWorks }: HowItWorksSectionProps) {
  return (
    <Section variant="content" maxWidth="4xl">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center">
        How It Works
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {howItWorks.steps.map((step, i) => (
          <div key={i} className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                {i + 1}
              </span>
              <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-3">{step.description}</p>
            <p className="text-sm text-primary/80 italic">{step.emotionalPayoff}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
