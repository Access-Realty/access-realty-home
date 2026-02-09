// ABOUTME: Persona config for Profile 2 — The Engineer Who Hates Inefficient Markets
// ABOUTME: Data-forward, precise tone. Emphasizes math and value alignment.

import type { PersonaLandingConfig } from "@/types/persona-landing";

export const smartSellersConfig: PersonaLandingConfig = {
  slug: "smart-sellers",
  meta: {
    title: "Sell Smarter — Pay for Value, Not Tradition | Access Realty DirectList",
    description:
      "The math on real estate commissions doesn't add up. DirectList gives you full MLS access for a flat $2,995 fee — not 3% of your home's value.",
  },
  hero: {
    headline: "You've Done the Math.\nThe Commission Model Is Broken.",
    subhead:
      "3% of your home's value for 40 hours of work is $200–$400/hr. You're not cheap — you just refuse to pay irrational prices.",
    ctaText: "Pay for Value, Not Tradition",
    ctaLink: "/direct-list/get-started",
    trustSignal: "Join 400+ DFW sellers who chose the rational option",
    backgroundVariant: "data",
  },
  mirror: {
    opener: "You've probably already run the numbers.",
    statements: [
      "You know that 3% of a $400K home is $12,000 — for roughly 40 hours of work. That's $300/hr for scheduling showings and uploading photos.",
      "You've looked at what agents actually do versus what they charge. The spread is indefensible by any rational measure.",
      "You're not trying to cut corners. You just refuse to pay a price that isn't connected to the value delivered.",
      "You've been waiting for someone to build the obvious solution. A flat fee for MLS access. That's it. That's the whole product.",
    ],
  },
  reframe: {
    headline: "This Isn't a Discount. It's a Market Correction.",
    body: "The 5–6% commission model was designed for an era when agents held all the information. They controlled the listings, the comps, the buyer pool. That asymmetry no longer exists.\n\nToday you can research comps in minutes, market your listing to thousands, and manage showings from your phone. The only thing you actually need from the traditional model is MLS access — and that shouldn't cost $12,000.\n\nDirectList gives you the full MLS listing, professional-grade tools, and expert support when you want it. For a flat $2,995. Because that's what the service is actually worth.",
    highlightStat: {
      number: "$9,005",
      label: "average savings on a $400K home",
    },
  },
  proof: {
    calculatorPreset: {
      homePrice: 400000,
      traditionalRate: 0.03,
    },
    calculatorVariant: "hourly-rate",
    testimonial: {
      quote:
        "I'm a software engineer. I optimize systems for a living. When I ran the numbers on what a listing agent actually does versus what they charge, the answer was obvious. DirectList gave me MLS access and I handled the rest. Saved $10,200.",
      name: "Kevin R.",
      detail: "Sold in Southlake, TX — saved $10,200",
    },
    stat: {
      number: "94%",
      context: "of DirectList homes sell within the same timeframe as traditionally-listed properties",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Enter Your Property Details",
        description:
          "Upload photos, write your description, set your price. Our platform walks you through exactly what MLS requires — no guesswork.",
        emotionalPayoff:
          "It takes about the same time as filing a detailed expense report. You've done harder things before lunch.",
      },
      {
        title: "Go Live on MLS",
        description:
          "Your listing appears on MLS, Zillow, Realtor.com, and 100+ sites within 24 hours. Same exposure as any $12,000 listing. Buyer agents see it. Buyers find it.",
        emotionalPayoff:
          "Same distribution. Same visibility. Same results. The only difference is you kept your money.",
      },
      {
        title: "Manage Offers and Close",
        description:
          "Review offers in your dashboard. Accept, counter, or decline. Our team is available if you want a second opinion on contract terms — but you're in control.",
        emotionalPayoff:
          "You close on your terms, with full visibility into every step. No one between you and your equity.",
      },
    ],
  },
  objections: [
    {
      question: "Is the MLS listing truly equivalent to what an agent provides?",
      answer:
        "Yes. Your listing appears in the same MLS database, syndicated to the same 100+ websites, visible to the same buyer agents. There is no 'premium' MLS tier. A listing is a listing. The data is identical.",
    },
    {
      question: "What services am I giving up compared to a full-service agent?",
      answer:
        "You're giving up having someone else schedule your showings, take your photos, and write your listing description. You're keeping MLS access, syndication, offer management tools, and access to our support team. Most sellers find the tradeoff obvious once they see it broken down.",
    },
    {
      question: "Will buyer agents still show my property?",
      answer:
        "Buyer agents are compensated by their buyers, not by your listing fee. Your property appears in MLS identically to any other listing. Agents show properties their buyers want to see — and your listing is right there alongside every other home in the market.",
    },
  ],
  finalCta: {
    headline: "The Math Is Simple",
    subhead:
      "Full MLS listing. Professional tools. Expert support when you want it. $2,995 flat — not 3% of your life's biggest asset.",
    ctaText: "Pay for Value, Not Tradition",
    ctaLink: "/direct-list/get-started",
    reassurance: "$2,995 flat. Full MLS. The rest stays in your equity.",
  },
};
