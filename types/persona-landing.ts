// ABOUTME: Type definition for persona-specific landing page configurations
// ABOUTME: Each persona gets a config object that drives the shared PersonaLandingPage component

export interface PersonaLandingConfig {
  slug: string;
  meta: {
    title: string;
    description: string;
    ogImage?: string;
  };
  hero: {
    headline: string;
    subhead: string;
    ctaText: string;
    ctaLink: string;
    trustSignal: string;
    backgroundVariant: BackgroundVariant;
  };
  mirror: {
    opener: string;
    statements: string[];
  };
  reframe: {
    headline: string;
    body: string;
    highlightStat?: {
      number: string;
      label: string;
    };
  };
  proof: {
    calculatorPreset: {
      homePrice: number;
      traditionalRate: number;
    };
    calculatorVariant?: "standard" | "hourly-rate" | "fire-growth" | "investor-multi";
    testimonial?: {
      quote: string;
      name: string;
      detail: string;
    };
    stat?: {
      number: string;
      context: string;
    };
  };
  howItWorks: {
    steps: Array<{
      title: string;
      description: string;
      emotionalPayoff: string;
    }>;
  };
  objections: Array<{
    question: string;
    answer: string;
  }>;
  finalCta: {
    headline: string;
    subhead: string;
    ctaText: string;
    ctaLink: string;
    reassurance: string;
  };
}

export type BackgroundVariant = "sharp" | "data" | "warm" | "pro" | "trust";
