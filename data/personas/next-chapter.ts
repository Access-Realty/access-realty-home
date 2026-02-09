// ABOUTME: Persona config for Profile 9 — The Retired Professional Who Needs a Project
// ABOUTME: Substantive, detailed, respectful of expertise. Process as engagement.

import type { PersonaLandingConfig } from "@/types/persona-landing";

export const nextChapterConfig: PersonaLandingConfig = {
  slug: "next-chapter",
  meta: {
    title: "Bring Your Professional Expertise to Your Home Sale | Access Realty DirectList",
    description:
      "You didn't get where you are by handing things off to people less thorough than you. Full MLS listing with professional-grade tools for $2,995.",
  },
  hero: {
    headline: "You Read Contracts.\nYou Check the Details.\nThis Is Your Kind of Project.",
    subhead:
      "Professional-grade listing tools for people who appreciate a thorough process. Full MLS access. $2,995.",
    ctaText: "Bring Your Expertise",
    ctaLink: "/direct-list/get-started",
    trustSignal: "Professional tools. Full process visibility. Expert support available.",
    backgroundVariant: "pro",
  },
  mirror: {
    opener: "You appreciate a well-managed process.",
    statements: [
      "You didn't get where you are by handing important things off to people less thorough than you. You read contracts. You check details. You understand timelines and compliance.",
      "Selling your home isn't a task to delegate — it's a project that deserves your attention and benefits from your experience.",
      "You've managed more complex things than a real estate transaction. What you need isn't someone to do it for you. It's a platform that matches your level of thoroughness.",
      "And honestly? You might enjoy this. A real project with real stakes and a clear outcome. There's satisfaction in doing it right.",
    ],
  },
  reframe: {
    headline: "A Platform Built for People Who Do Their Homework",
    body: "DirectList isn't a shortcut. It's a professional listing platform that gives you full control and full visibility into every step of the process. MLS entry, document management, showing coordination, offer review — all in one place.\n\nYou set the price based on your own research. You write the listing description — or use our professional copywriting service. You review every offer yourself, with the ability to drill into the terms.\n\nThis is the tool for people who want to understand and manage the process, not just be told \"it's handled.\"",
    highlightStat: {
      number: "Full visibility",
      label: "into every step — MLS listing, showings, offers, documents",
    },
  },
  proof: {
    calculatorPreset: {
      homePrice: 550000,
      traditionalRate: 0.03,
    },
    calculatorVariant: "standard",
    testimonial: {
      quote:
        "I spent 35 years managing complex operations. When it came time to sell, I wanted to understand every detail of the process — not just sign where someone pointed. DirectList gave me the tools to manage it myself. The process was engaging, the result was excellent, and I saved $14,000.",
      name: "Robert A.",
      detail: "Sold in Southlake, TX — retired executive",
    },
    stat: {
      number: "Step-by-step",
      context: "full process visibility from listing to close",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Prepare Your Listing",
        description:
          "Enter comprehensive property details, upload professional photos, set your price based on comp research. The platform captures everything MLS requires — thoroughly.",
        emotionalPayoff:
          "The preparation is part of the satisfaction. You'll know this listing is solid.",
      },
      {
        title: "Go Live with Full Visibility",
        description:
          "Your listing appears on MLS and all major platforms. Track views, save counts, and showing requests from your dashboard. Full transparency into how your listing is performing.",
        emotionalPayoff:
          "You can see exactly what's happening. No black box. No waiting for a weekly update.",
      },
      {
        title: "Review, Negotiate, Close",
        description:
          "Offers come through your dashboard with full details. Review terms, compare multiple offers, negotiate with precision. Support is available for contract questions.",
        emotionalPayoff:
          "You close knowing you managed this process with the same rigor you brought to your career.",
      },
    ],
  },
  objections: [
    {
      question: "How much support is available if I have questions?",
      answer:
        "Our team of licensed professionals is available by phone and email. You can ask about pricing strategy, contract terms, offer evaluation, or any step of the process. The support is substantive — not scripted customer service, but real answers from real estate professionals.",
    },
    {
      question: "Walk me through the full process end-to-end.",
      answer:
        "1) You enter property details and photos. 2) We review and activate your MLS listing within 24 hours. 3) Your listing syndicates to 100+ sites. 4) Showings are coordinated through ShowingTime. 5) Offers come through your dashboard. 6) You review, negotiate, and accept. 7) Our team supports you through closing. Every step is visible in your dashboard.",
    },
    {
      question: "Can I customize my listing description and details?",
      answer:
        "Absolutely. You write your own description, select your own photos and their order, and set every detail of the listing. You can also opt for our professional listing description service if you'd prefer a polished starting point to edit. Either way, you have final approval on everything.",
    },
  ],
  finalCta: {
    headline: "Your Next Project Starts Here",
    subhead:
      "Professional listing tools built for people who appreciate thoroughness. Full MLS. Full control. $2,995.",
    ctaText: "Bring Your Expertise",
    ctaLink: "/direct-list/get-started",
    reassurance: "Full MLS listing. Full process visibility. Expert support available.",
  },
};
