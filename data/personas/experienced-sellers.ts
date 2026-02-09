// ABOUTME: Persona config for Profile 10 — The "I Know Better" Seller
// ABOUTME: Direct, peer-level, feature-dense. No hand-holding energy.

import type { PersonaLandingConfig } from "@/types/persona-landing";

export const experiencedSellersConfig: PersonaLandingConfig = {
  slug: "experienced-sellers",
  meta: {
    title: "You Know Your Market — Now List in It | Access Realty DirectList",
    description:
      "You know your comps, your pricing, and your timeline. The only thing you need is MLS access. DirectList: $2,995 flat. Full MLS. No hand-holding.",
  },
  hero: {
    headline: "You Know Your Market.\nNow List in It.",
    subhead:
      "You've got the comps, the pricing, and the timeline. All you need is MLS access. Here are the keys.",
    ctaText: "Get MLS Access",
    ctaLink: "/direct-list/get-started",
    trustSignal: "Full MLS. Full control. $2,995.",
    backgroundVariant: "sharp",
  },
  mirror: {
    opener: "Let's skip the pitch.",
    statements: [
      "You know your comps better than most agents. You've watched every closing in your neighborhood. You know what your home is worth, when to list, and how to price it.",
      "You don't need a pricing consultation. You don't need a staging recommendation. You don't need someone to explain the market to you.",
      "The only thing you don't have is MLS access. Everything else? You've got it handled.",
      "You've been looking for a way to get your listing on MLS without paying someone $12,000 for services you don't need. That's what this is.",
    ],
  },
  reframe: {
    headline: "MLS Access. Transaction Tools. Nothing You Don't Need.",
    body: "DirectList is the missing piece — not a service that replaces your expertise, but the tool that completes it. Full MLS listing, syndication to every major platform, ShowingTime integration, and offer management.\n\nNo upselling. No \"let us help you price it.\" No mandatory consultations. You enter your listing, it goes live on MLS, and you manage it.\n\nSupport is available if you want it. But you probably won't.",
    highlightStat: {
      number: "$2,995",
      label: "for MLS access — not for advice you don't need",
    },
  },
  proof: {
    calculatorPreset: {
      homePrice: 425000,
      traditionalRate: 0.03,
    },
    calculatorVariant: "standard",
    testimonial: {
      quote:
        "Third time selling a home. I know my neighborhood better than any agent who'd drive in with a CMA. All I needed was MLS access. DirectList gave me that, I handled everything else, and I saved $10,750. No middleman, no friction.",
      name: "Greg S.",
      detail: "Sold in Keller, TX — saved $10,750",
    },
    stat: {
      number: "You control",
      context: "pricing, photos, description, showings, and offer responses — directly",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Enter Your Listing",
        description:
          "Property details, your photos, your description, your price. The platform captures MLS-required fields. You fill in what you already know.",
        emotionalPayoff:
          "No one explaining your own market to you. Just the form and the fields.",
      },
      {
        title: "Live on MLS in 24 Hours",
        description:
          "Your listing appears on MLS and syndicates to Zillow, Realtor.com, Redfin, and 100+ platforms. Full exposure. Your listing, your way.",
        emotionalPayoff:
          "Same MLS, same visibility, none of the overhead. Exactly what you wanted.",
      },
      {
        title: "Manage Offers and Close",
        description:
          "Offers come through your dashboard. Review, counter, accept. You've done this before. The tools just make it cleaner.",
        emotionalPayoff:
          "You close on your terms, with your equity intact.",
      },
    ],
  },
  objections: [
    {
      question: "Do I get full MLS control, or does someone else manage my listing?",
      answer:
        "You provide all listing details and we enter them into MLS exactly as you specify. Updates and changes are handled quickly through the platform. You control the content — pricing, photos, description, everything.",
    },
    {
      question: "Can I update my listing myself?",
      answer:
        "Submit changes through your dashboard and they're processed promptly. Price changes, photo updates, description edits, status changes — request them and they happen. You stay in control of the listing content throughout.",
    },
    {
      question: "What exactly am I getting for $2,995?",
      answer:
        "MLS listing, syndication to 100+ websites, professional photography, ShowingTime showing coordination, digital document signing, lockbox and yard sign, and access to our support team. That's DirectList. DirectList+ at $4,495 adds virtual walkthrough, aerial photography, floor plans, and more. No percentage-based fees in either tier.",
    },
  ],
  finalCta: {
    headline: "You Already Know What to Do",
    subhead:
      "Full MLS access. $2,995. Your listing, your market, your terms.",
    ctaText: "Get MLS Access",
    ctaLink: "/direct-list/get-started",
    reassurance: "$2,995 flat. Full MLS. No percentage of your sale.",
  },
};
