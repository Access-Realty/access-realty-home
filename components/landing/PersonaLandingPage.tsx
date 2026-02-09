// ABOUTME: Shared layout component for all persona landing pages
// ABOUTME: Composes all section sub-components from a PersonaLandingConfig

import type { PersonaLandingConfig } from "@/types/persona-landing";
import { PersonaHero } from "./PersonaHero";
import { MirrorSection } from "./MirrorSection";
import { ReframeSection } from "./ReframeSection";
import { ProofSection } from "./ProofSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { ObjectionSection } from "./ObjectionSection";
import { PersonaFinalCta } from "./PersonaFinalCta";

interface PersonaLandingPageProps {
  config: PersonaLandingConfig;
}

export function PersonaLandingPage({ config }: PersonaLandingPageProps) {
  return (
    <>
      <PersonaHero hero={config.hero} />
      <MirrorSection mirror={config.mirror} />
      <ReframeSection reframe={config.reframe} />
      <ProofSection proof={config.proof} slug={config.slug} />
      <HowItWorksSection howItWorks={config.howItWorks} />
      <ObjectionSection objections={config.objections} />
      <PersonaFinalCta finalCta={config.finalCta} slug={config.slug} />
    </>
  );
}
