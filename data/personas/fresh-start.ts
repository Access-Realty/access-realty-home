// ABOUTME: Persona config for Profile 1 — The Divorce Power Move Seller
// ABOUTME: Sharp, competent, no-nonsense tone. Control and victory language.

import type { PersonaLandingConfig } from "@/types/persona-landing";

export const freshStartConfig: PersonaLandingConfig = {
  slug: "fresh-start",
  meta: {
    title: "Sell Your Home on Your Terms | DirectList",
    description:
      "You're already managing everything else. Take control of your home sale too — full MLS listing for $2,995, not 6% of your equity.",
  },
  hero: {
    headline: "You're Already Handling Everything.\nHandle This Too.",
    subhead:
      "You don't need someone else taking a cut of what you built. List on MLS for a flat fee. Keep your equity. Move forward.",
    ctaText: "Keep What's Yours",
    ctaLink: "/direct-list/get-started",
    trustSignal: "Full MLS listing. Professional tools. You stay in control.",
    backgroundVariant: "sharp",
  },
  mirror: {
    opener: "You don't need anyone to explain this to you.",
    statements: [
      "You're already managing attorneys, timelines, and decisions that would overwhelm most people. You're handling it.",
      "The last thing you need right now is to hand 3% of your equity — thousands of dollars — to someone for putting a sign in the yard and scheduling a few showings.",
      "You want this done right, done clean, and done without anyone else taking a cut of what you worked for.",
      "You've earned every dollar of equity in this home. The sale should reflect that.",
    ],
  },
  reframe: {
    headline: "This Is Your Move. Make It Count.",
    body: "Selling your home during a transition isn't just a transaction — it's a statement. It says you're in control. You're making smart decisions. You're not letting anyone take more than they've earned.\n\nDirectList gives you the same MLS exposure as any full-commission listing. Your home appears on Zillow, Realtor.com, and every major platform. Buyer agents see it. Buyers find it. The only difference is you keep thousands more at closing.\n\nYou're already proving you can handle the hard things. This one's straightforward.",
    highlightStat: {
      number: "$9,005",
      label: "kept in your pocket on a $400K sale",
    },
  },
  proof: {
    calculatorPreset: {
      homePrice: 400000,
      traditionalRate: 0.03,
    },
    calculatorVariant: "standard",
    testimonial: {
      quote:
        "I was going through a lot, and the last thing I wanted was to feel dependent on someone else for the sale. DirectList let me handle it myself, on my schedule. I saved over $8,000 and closed in three weeks. It felt like a win I needed.",
      name: "Laura M.",
      detail: "Sold in Arlington, TX — saved $8,400",
    },
    stat: {
      number: "21 days",
      context: "average time to accepted offer for DirectList sellers",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Enter Your Property Details",
        description:
          "Upload photos, set your price, describe your home. The platform walks you through what's needed — nothing ambiguous.",
        emotionalPayoff:
          "You're in the driver's seat from minute one. No waiting on someone else's schedule.",
      },
      {
        title: "Go Live on MLS",
        description:
          "Your listing appears on MLS, Zillow, Realtor.com, and 100+ sites within 24 hours. Same visibility as any full-commission listing.",
        emotionalPayoff:
          "Your home is out there working for you while you focus on everything else.",
      },
      {
        title: "Close on Your Terms",
        description:
          "Review offers in your dashboard. Accept, counter, or decline. Our team is one call away if you want a second opinion.",
        emotionalPayoff:
          "You close clean, keep your equity, and move forward with momentum.",
      },
    ],
  },
  objections: [
    {
      question: "Can I really manage this while dealing with everything else?",
      answer:
        "Yes. The platform does the heavy lifting — MLS entry, syndication, showing coordination through ShowingTime. You make the decisions. Most sellers spend 2–3 hours total on setup, then it runs itself. You're already managing harder things than this.",
    },
    {
      question: "What if the other party or their attorney has concerns about the listing approach?",
      answer:
        "Your listing appears on MLS identically to any agent-listed property. There is no visible difference to buyers, agents, or attorneys. The property is listed through Access Realty, a licensed Texas brokerage. It's fully legitimate and standard.",
    },
    {
      question: "What if I need help with an offer or contract?",
      answer:
        "Our support team is available to walk you through offers and contract terms. You can also add contract negotiation as an on-demand service if you want professional representation for that specific step. You choose the level of support.",
    },
  ],
  finalCta: {
    headline: "You've Got This",
    subhead:
      "Full MLS listing. Professional tools. Expert support when you want it. $2,995 flat fee — the rest stays with you.",
    ctaText: "Keep What's Yours",
    ctaLink: "/direct-list/get-started",
    reassurance: "$2,995 flat. Full MLS. You keep the rest.",
  },
};
