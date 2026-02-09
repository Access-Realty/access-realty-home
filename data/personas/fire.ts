// ABOUTME: Persona config for Profile 7 — The FIRE Movement Optimizer
// ABOUTME: Precise, numbers-first, community-native tone. Savings rate protection.

import type { PersonaLandingConfig } from "@/types/persona-landing";

export const fireConfig: PersonaLandingConfig = {
  slug: "fire",
  meta: {
    title: "Don't Let Commission Fees Wreck Your FIRE Number | Access Realty DirectList",
    description:
      "You've optimized everything down to basis points. Why would you pay 3% on your largest asset? Full MLS listing for $2,995 flat.",
  },
  hero: {
    headline: "You Optimize to Basis Points.\nWhy Pay 3% to Sell Your Home?",
    subhead:
      "A 3% commission on a $400K home is $12,000. That's $12,000 not compounding at 7% for the next 20 years. That's $46,000.",
    ctaText: "Optimize the Biggest Line Item",
    ctaLink: "/direct-list/get-started",
    trustSignal: "Full MLS listing. $2,995 flat. Do the math.",
    backgroundVariant: "data",
  },
  mirror: {
    opener: "You track every dollar. We respect that.",
    statements: [
      "You know your FIRE number. You know your savings rate. You've optimized groceries, insurance, tax strategy, and investment fees down to basis points.",
      "And now you're looking at the single largest transaction of your financial life — and the default option is to hand someone 3% of it. For scheduling showings.",
      "You're not cheap. You're rational. There's a difference. And the 5-6% commission model doesn't survive rational analysis.",
      "This is the largest single expense you can optimize. Everything else you've done has been practice for this.",
    ],
  },
  reframe: {
    headline: "The Commission Is the Biggest Fee You've Never Optimized",
    body: "You've switched to index funds to save 80bps. You've tax-loss harvested. You've house-hacked, geo-arbitraged, and Roth-converted. But the real estate commission? That's been sitting there the whole time — a 3% expense on your largest asset, hiding in plain sight.\n\nDirectList gives you the same MLS listing for a flat $2,995. Same exposure. Same buyer pool. Same results. The $9,000 you save on a $400K home isn't just $9,000 — it's $9,000 invested at 7% for 20 years. That's $34,800 in future value.\n\nYou've optimized harder things for smaller amounts. This one's easy.",
    highlightStat: {
      number: "$34,800",
      label: "future value of $9K saved, invested at 7% for 20 years",
    },
  },
  proof: {
    calculatorPreset: {
      homePrice: 400000,
      traditionalRate: 0.03,
    },
    calculatorVariant: "fire-growth",
    testimonial: {
      quote:
        "I'm 3 years from my FIRE date. The idea of handing $14,000 to a listing agent for something I could manage myself was physically painful. DirectList gave me full MLS access, I managed the sale, and that $14,000 went straight into VTSAX. Coast number, met.",
      name: "Michael T.",
      detail: "Sold in Frisco, TX — invested $11,200 in savings",
    },
    stat: {
      number: "6+ months",
      context: "of expenses covered by the savings on a typical DFW home sale",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Enter Property Details",
        description:
          "Upload photos, set your price, describe your home. The platform is efficient — you'll spend roughly the same time you spend rebalancing your portfolio quarterly.",
        emotionalPayoff:
          "Under an hour of your time. The ROI on that hour is absurd.",
      },
      {
        title: "Go Live on MLS",
        description:
          "Your listing appears on MLS, Zillow, Realtor.com, and 100+ sites within 24 hours. Identical exposure to a 3% listing. No premium tier. No difference.",
        emotionalPayoff:
          "Same output, 75% lower cost. Your spreadsheet will love this line item.",
      },
      {
        title: "Close and Invest the Difference",
        description:
          "Review offers, negotiate, close. Keep $9,000+ that would have gone to commission. Invest it, compound it, retire on it.",
        emotionalPayoff:
          "The savings hit your brokerage account by end of month. Time in market starts now.",
      },
    ],
  },
  objections: [
    {
      question: "Is this actually the same MLS listing?",
      answer:
        "Yes. Same MLS database, same listing format, same syndication to Zillow, Realtor.com, Redfin, and 100+ sites. There is no difference in how buyers or agents see your property. MLS doesn't have tiers — a listing is a listing.",
    },
    {
      question: "Time vs. money — is the DIY effort worth it?",
      answer:
        "Most sellers spend 3–5 hours on listing setup and another 5–10 hours on showings and offer management over 2–4 weeks. At $9,000 in savings, that's $600–$1,000+ per hour of your time. If you're optimizing for FIRE, that's the highest-paying \"side gig\" you'll ever do.",
    },
    {
      question: "What's the actual out-of-pocket? Any hidden fees?",
      answer:
        "DirectList is $2,995 total ($495 upfront, balance at closing). DirectList+ is $4,495 ($995 upfront) and includes professional photography, virtual walkthrough, aerial photos, and more. No percentage-based fees. No hidden costs. Optional add-on services are priced transparently.",
    },
  ],
  finalCta: {
    headline: "Invest the Difference",
    subhead:
      "$2,995 flat. Same MLS. Same exposure. The $9,000+ you save starts compounding the day you close.",
    ctaText: "Optimize the Biggest Line Item",
    ctaLink: "/direct-list/get-started",
    reassurance: "$2,995 flat fee. No percentage. Every dollar saved is yours to invest.",
  },
};
