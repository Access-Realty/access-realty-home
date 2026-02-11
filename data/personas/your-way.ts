// ABOUTME: Persona config for Profile 8 — The Realtor's Spouse
// ABOUTME: Personal, gentle, autonomous tone. Independence without confrontation.

import type { PersonaLandingConfig } from "@/types/persona-landing";

export const yourWayConfig: PersonaLandingConfig = {
  slug: "your-way",
  meta: {
    title: "Your Property, Your Process | DirectList",
    description:
      "Sometimes you want to handle something yourself. Full MLS listing for $2,995 — your property, your timeline, your decisions.",
  },
  hero: {
    headline: "Some Things Are Better\nHandled on Your Own Terms.",
    subhead:
      "Whether it's an investment property, a side project, or just something that's yours — you deserve tools that work for you, not someone else's workflow.",
    ctaText: "Your Property, Your Process",
    ctaLink: "/direct-list/get-started",
    trustSignal: "Private dashboard. Your timeline. Your decisions.",
    backgroundVariant: "warm",
  },
  mirror: {
    opener: "This one's yours.",
    statements: [
      "Sometimes you want to handle something yourself. Not because you don't have help available — but because doing it on your own terms matters.",
      "Maybe it's an investment property. Maybe it's something you inherited. Maybe it's just a project you want to own from start to finish.",
      "Whatever the reason, you want a tool that works for you — straightforward, professional, and independent.",
      "No committees. No second-guessing. Just a clean process that's yours to manage.",
    ],
  },
  reframe: {
    headline: "Your Platform. Your Process.",
    body: "DirectList gives you everything you need to list a property on MLS — from your own dashboard, on your own timeline. You enter the details, upload photos, set the price, and go live. It's your listing.\n\nShowing requests come through the platform. Offers come to you. You decide when to respond and how. There's support available if you want it, but no one looking over your shoulder.\n\nIt's a professional tool for people who want to handle things themselves.",
    highlightStat: {
      number: "$2,995",
      label: "flat fee — full MLS listing, your dashboard, your process",
    },
  },
  proof: {
    calculatorPreset: {
      homePrice: 375000,
      traditionalRate: 0.03,
    },
    calculatorVariant: "standard",
    testimonial: {
      quote:
        "I had an investment property I wanted to sell myself. DirectList made it simple — I managed the whole listing from my phone, on my schedule. Clean process, professional result, and I kept the savings.",
      name: "Jennifer H.",
      detail: "Sold in North Richland Hills, TX — saved $8,250",
    },
    stat: {
      number: "Your dashboard",
      context: "manage your listing, showings, and offers from one private interface",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Set Up Your Listing",
        description:
          "Enter your property details and upload photos. Work at your own pace — save your progress and come back anytime.",
        emotionalPayoff:
          "It's your project. Work on it when it suits you.",
      },
      {
        title: "Go Live",
        description:
          "Your listing appears on MLS, Zillow, Realtor.com, and 100+ sites. Full professional exposure from your personal dashboard.",
        emotionalPayoff:
          "It's out there, and you made it happen. Independently.",
      },
      {
        title: "Manage and Close",
        description:
          "Showing requests and offers come through your dashboard. Respond on your schedule. Close when you're ready.",
        emotionalPayoff:
          "Start to finish, this was yours. Clean and done.",
      },
    ],
  },
  objections: [
    {
      question: "Is my listing activity private?",
      answer:
        "Your DirectList account and dashboard are yours. Listing activity, showing requests, and offer details are visible only to you through your account. The public listing itself shows the property on MLS as you'd expect, but your account management is private.",
    },
    {
      question: "How independent is this from any existing brokerage relationships?",
      answer:
        "Your DirectList listing is through Access Realty as the brokerage of record. It's a separate transaction, a separate account, and a separate process. No overlap with any other brokerage relationship.",
    },
    {
      question: "Do I need any real estate experience?",
      answer:
        "No. The platform guides you through every step — property details, photos, pricing, listing activation. And if you have questions at any point, support is one call away. You don't need experience. You just need to be willing to own the process.",
    },
  ],
  finalCta: {
    headline: "This One's Yours",
    subhead:
      "Full MLS listing from your own dashboard. $2,995 flat. Your property, your process, your pace.",
    ctaText: "Your Property, Your Process",
    ctaLink: "/direct-list/get-started",
    reassurance: "$2,995 flat. Full MLS. Private dashboard. Your pace.",
  },
};
