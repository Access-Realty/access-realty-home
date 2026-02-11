// ABOUTME: Persona config for Profile 4 — The Control Reclamation Widow/Widower
// ABOUTME: Warm, respectful, empowering tone. Autonomy and dignity.

import type { PersonaLandingConfig } from "@/types/persona-landing";

export const startingOverConfig: PersonaLandingConfig = {
  slug: "starting-over",
  meta: {
    title: "Sell Your Home Your Way — With Support | DirectList",
    description:
      "You're capable of more than people give you credit for. List your home on MLS with professional tools and expert support — on your terms.",
  },
  hero: {
    headline: "You Don't Need Someone\nto Do This for You.",
    subhead:
      "You need tools that work when you're ready, support when you ask for it, and the space to do this your way.",
    ctaText: "Start When You're Ready",
    ctaLink: "/direct-list/get-started",
    trustSignal: "Professional tools. Expert support. Your pace, your decisions.",
    backgroundVariant: "warm",
  },
  mirror: {
    opener: "Everyone means well.",
    statements: [
      "Your kids want to help. Your friends have opinions. Someone's already suggested \"their\" agent who'll \"take care of everything.\"",
      "But you know what you need right now isn't someone else making decisions for you. It's the opposite.",
      "You need to do this — not because no one else can, but because proving you can matters right now more than almost anything.",
      "You're not looking for someone to take over. You're looking for the right tools and the confidence that help is there if you want it.",
    ],
  },
  reframe: {
    headline: "Your Home. Your Timeline. Your Decision.",
    body: "DirectList was built for people who want to be in the driver's seat. You enter your property details, set your price, and decide when to go live. The platform handles the technical parts — MLS listing, syndication to Zillow and Realtor.com, showing coordination.\n\nAnd if you have a question at any point — about pricing, about an offer, about anything — our team is one call away. Not hovering. Not pushing. Just there when you need them.\n\nThis isn't about doing it alone. It's about doing it on your terms.",
    highlightStat: {
      number: "One call away",
      label: "expert support whenever you want it — never when you don't",
    },
  },
  proof: {
    calculatorPreset: {
      homePrice: 450000,
      traditionalRate: 0.03,
    },
    calculatorVariant: "standard",
    testimonial: {
      quote:
        "After my husband passed, everyone wanted to handle things for me. I needed to do this myself. DirectList gave me the tools to manage everything, and when I got nervous about the first offer, I called and they walked me through it. No pressure, no judgment. Just support.",
      name: "Patricia W.",
      detail: "Sold in Grapevine, TX — on her own terms",
    },
    stat: {
      number: "24 hours",
      context: "from listing entry to live on MLS, Zillow, and 100+ sites",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Set Up Your Listing",
        description:
          "Add your property details and photos at your own pace. The platform guides you through each step clearly — nothing confusing, nothing rushed.",
        emotionalPayoff:
          "You're in control from the start. Take your time. There's no deadline but yours.",
      },
      {
        title: "Your Home Goes Live",
        description:
          "Your listing appears on MLS and every major real estate website. Buyer agents can find it, buyers can schedule showings through ShowingTime.",
        emotionalPayoff:
          "It's out there, working for you. And you made it happen.",
      },
      {
        title: "Review Offers and Decide",
        description:
          "Offers come through your dashboard. Review them, take your time, and decide. Our team is available if you want a second pair of eyes on anything.",
        emotionalPayoff:
          "Every decision is yours. Support is there when you want it — never imposed.",
      },
    ],
  },
  objections: [
    {
      question: "What if I get stuck on something?",
      answer:
        "Call us. Our support team is available to walk you through any step — pricing questions, offer review, contract terms, anything. You're never truly on your own. The difference is that you decide when to ask.",
    },
    {
      question: "Is there a real person I can talk to?",
      answer:
        "Yes. You're supported by licensed real estate professionals at Access Realty — a Texas brokerage with real people, real phone numbers, and real answers. This isn't a chatbot. It's a team that's there when you need them.",
    },
    {
      question: "What if my family thinks I should use a traditional agent?",
      answer:
        "Your listing appears on MLS identically to any agent-listed home. Same exposure, same professionalism, same buyer pool. The only difference is the cost — $2,995 instead of 3% commission. When your family sees the result, they'll understand the decision.",
    },
  ],
  finalCta: {
    headline: "You're Ready for This",
    subhead:
      "Professional tools, expert support, and the freedom to do this your way. $2,995 — and you keep the rest.",
    ctaText: "Start When You're Ready",
    ctaLink: "/direct-list/get-started",
    reassurance: "Full MLS listing. Expert support one call away. Your pace.",
  },
};
