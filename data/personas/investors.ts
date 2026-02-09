// ABOUTME: Persona config for Profile 3 — The "I'm a Real Investor Now" First-Timer
// ABOUTME: Aspirational but grounded tone. Professional-grade tools, not discount service.

import type { PersonaLandingConfig } from "@/types/persona-landing";

export const investorsConfig: PersonaLandingConfig = {
  slug: "investors",
  meta: {
    title: "List Investment Properties Like a Pro | Access Realty DirectList",
    description:
      "Serious investors don't give away 3% on every deal. DirectList gives you full MLS access for $2,995 flat — the same tools the pros use.",
  },
  hero: {
    headline: "Investors Who Build Wealth\nDon't Give Away 3% Per Deal.",
    subhead:
      "Full MLS listing for a flat $2,995. Same exposure. Same buyer pool. The savings compound with every property you move.",
    ctaText: "List Like a Pro",
    ctaLink: "/direct-list/get-started",
    trustSignal: "Used by DFW investors managing growing portfolios",
    backgroundVariant: "pro",
  },
  mirror: {
    opener: "You're thinking about this the right way.",
    statements: [
      "You just closed on a property — or maybe you're getting ready to list one. Either way, you're running numbers on everything. You know that margins matter.",
      "You've read enough to know that the investors who build real wealth treat every transaction as a line item. A 3% listing commission on every deal is a leak in the system.",
      "You're not looking for a discount. You're looking for the professional-grade tool that lets you operate like the business this is becoming.",
      "The math is simple: save $9,000 per deal, reinvest it, and watch the gap between you and every other investor widen with every transaction.",
    ],
  },
  reframe: {
    headline: "Your Portfolio Deserves a Professional Toolkit",
    body: "Full-service agents are designed for homeowners who sell once every seven years. You're not that. You're building a portfolio, and every dollar you save on transaction costs is a dollar you can redeploy.\n\nDirectList gives you full MLS access, syndication to every major platform, and the tools to manage your listing professionally. Same exposure a $12,000 commission buys — for a flat $2,995.\n\nThe investors who scale aren't the ones who spend the most per transaction. They're the ones who spend the smartest.",
    highlightStat: {
      number: "$45,025",
      label: "saved over 5 deals at $400K average",
    },
  },
  proof: {
    calculatorPreset: {
      homePrice: 275000,
      traditionalRate: 0.03,
    },
    calculatorVariant: "investor-multi",
    testimonial: {
      quote:
        "I've listed three properties through DirectList now. Same MLS exposure, same buyer traffic, fraction of the cost. The savings on my last two deals alone covered the down payment on my next acquisition. This is how you scale.",
      name: "Ryan D.",
      detail: "3 properties sold — saved $19,600 total",
    },
    stat: {
      number: "100+",
      context: "websites your listing appears on through MLS syndication",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Enter Property Details",
        description:
          "Upload photos, set your price, add property specs. The platform captures everything MLS requires — streamlined for investors who've done this before.",
        emotionalPayoff:
          "Setup takes under an hour. You've spent longer analyzing a deal.",
      },
      {
        title: "Go Live on MLS",
        description:
          "Your listing appears on MLS, Zillow, Realtor.com, and 100+ platforms within 24 hours. Buyer agents see it. Investors see it. Everyone sees it.",
        emotionalPayoff:
          "Same visibility as a $12,000 listing. The only difference is your cost basis.",
      },
      {
        title: "Manage and Close",
        description:
          "Review offers from your dashboard. Accept, counter, negotiate. Our team is available for contract review if you want it — but you call the shots.",
        emotionalPayoff:
          "You close, keep your margins, and roll the savings into the next deal.",
      },
    ],
  },
  objections: [
    {
      question: "I'm newer to investing — do I need a full-service agent to avoid mistakes?",
      answer:
        "The most common mistakes in real estate aren't about the listing — they're about pricing and contract terms. DirectList includes a professionally guided pricing strategy, and you can add contract negotiation as an on-demand service. You get the support where it matters without paying 3% for the parts you can handle.",
    },
    {
      question: "Will buyer agents still show my property?",
      answer:
        "Yes. Buyer agents are compensated by their buyers, not by your listing fee. Your property appears in MLS identically to any other listing. Agents show properties their clients want to see, and your listing is right there in the same search results.",
    },
    {
      question: "Can I use this for multiple properties?",
      answer:
        "Absolutely. Each listing is a separate flat fee. No volume contracts, no lock-in. List one property or ten — each one costs $2,995 with full MLS access. The savings scale linearly with your portfolio.",
    },
  ],
  finalCta: {
    headline: "Better Margins Start Here",
    subhead:
      "Full MLS listing for $2,995. Same exposure. Same results. The savings compound with every deal.",
    ctaText: "List Like a Pro",
    ctaLink: "/direct-list/get-started",
    reassurance: "$2,995 per listing. No percentage. No volume commitment.",
  },
};
