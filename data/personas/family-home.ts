// ABOUTME: Persona config for Profile 6 — The Adult Child Proving Competence
// ABOUTME: Responsible, trustworthy tone. Savings as deliverable to the family.

import type { PersonaLandingConfig } from "@/types/persona-landing";

export const familyHomeConfig: PersonaLandingConfig = {
  slug: "family-home",
  meta: {
    title: "Sell the Family Home the Smart Way | DirectList",
    description:
      "Your family is counting on you to handle this right. DirectList gives you full MLS exposure for $2,995 — and real savings you can show them.",
  },
  hero: {
    headline: "Your Family Trusted You\nWith Their Biggest Asset.",
    subhead:
      "Show them you did your homework. Full MLS listing for $2,995 instead of $15,000+ in commission. Same exposure. Smarter decision.",
    ctaText: "Make the Smart Call",
    ctaLink: "/direct-list/get-started",
    trustSignal: "Licensed Texas brokerage. Full MLS. Professional results.",
    backgroundVariant: "trust",
  },
  mirror: {
    opener: "Your family is looking to you on this one.",
    statements: [
      "Your parents are downsizing, or maybe this is an estate situation. Either way, the responsibility landed with you — and you want to get this right.",
      "Not just the sale itself, but the way you manage it. The research you did. The options you compared. The money you saved.",
      "You want to come back to the family with a number that makes everyone nod and say, \"Good call.\"",
      "The savings aren't just money. They're proof that you handled this thoughtfully.",
    ],
  },
  reframe: {
    headline: "The Savings Are the Deliverable",
    body: "On a $500K home, a 3% listing commission is $15,000. That's money straight out of the family's proceeds — for a service you can largely handle yourself with the right tools.\n\nDirectList gives you the same full MLS listing, the same exposure on Zillow and Realtor.com, the same buyer visibility. For a flat $2,995. The difference — over $12,000 — goes back to your family.\n\nThat's not a shortcut. That's smart stewardship of something that matters to everyone.",
    highlightStat: {
      number: "$12,005",
      label: "saved on a $500K family home",
    },
  },
  proof: {
    calculatorPreset: {
      homePrice: 500000,
      traditionalRate: 0.03,
    },
    calculatorVariant: "standard",
    testimonial: {
      quote:
        "When my mother moved into assisted living, I handled the house sale. I researched every option and chose DirectList. The listing looked completely professional, we got multiple offers, and I saved the family over $13,000. My siblings were impressed — and that mattered to me.",
      name: "David C.",
      detail: "Sold family home in Colleyville, TX — saved $13,400",
    },
    stat: {
      number: "100%",
      context: "of the same MLS exposure as a full-commission listing",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Prepare the Listing",
        description:
          "Enter property details, upload photos, and set the price. The platform guides you through everything MLS requires — nothing left to guess.",
        emotionalPayoff:
          "You'll know you covered every detail. No loose ends.",
      },
      {
        title: "Go Live on MLS",
        description:
          "The listing appears on MLS, Zillow, Realtor.com, and 100+ platforms. Buyer agents see it. Buyers schedule showings. Full professional exposure.",
        emotionalPayoff:
          "The family home is represented properly. You made sure of that.",
      },
      {
        title: "Manage Offers and Close",
        description:
          "Review offers from your dashboard. Our team is available if you want help evaluating terms. You make the call — and you can explain exactly why.",
        emotionalPayoff:
          "You close with confidence and come back to the family with results that speak for themselves.",
      },
    ],
  },
  objections: [
    {
      question: "My parents' agent wants the listing — how do I explain choosing a flat-fee option?",
      answer:
        "Show them the math. The same MLS exposure, the same buyer pool, the same professional listing — for $2,995 instead of $15,000. The family saves over $12,000. Any reasonable person can see the value in that. And the listing is through a licensed Texas brokerage, not a DIY website.",
    },
    {
      question: "What if something goes wrong and the family blames me?",
      answer:
        "Your listing is professionally handled through Access Realty. You have MLS exposure, showing coordination through ShowingTime, and access to expert support for pricing, offers, and contracts. This isn't a gamble — it's a well-supported process that thousands of sellers have used successfully.",
    },
    {
      question: "Can I handle this if I live out of state?",
      answer:
        "Yes. The listing is managed entirely through our platform — entry, photos, showing coordination, offer review. If you need boots on the ground for photography or showing access, you can coordinate with a local contact or use our add-on services.",
    },
  ],
  finalCta: {
    headline: "Do Right by Your Family",
    subhead:
      "Full MLS listing. Professional results. $2,995 instead of $15,000. The savings go back to the people who matter.",
    ctaText: "Make the Smart Call",
    ctaLink: "/direct-list/get-started",
    reassurance: "Licensed brokerage. Full MLS exposure. Family-sized savings.",
  },
};
