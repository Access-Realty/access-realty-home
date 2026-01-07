// ABOUTME: Hybrid page for sellers with homes needing repairs/updates
// ABOUTME: Highlights Cash, 2 Payment, Price Launch, Uplist, and Seller Finance solutions

import Link from "next/link";
import { HiCheck, HiArrowRight } from "react-icons/hi2";
import { HeroSection, Section } from "@/components/layout";

const solutions = [
  {
    name: "Cash Offer",
    description: "Skip repairs entirely. We buy homes in any condition — foundation issues, roof problems, outdated everything.",
    href: "https://metroplexhomebuyers.com",
    external: true,
  },
  {
    name: "2 Payment",
    description: "Sell as-is with a large upfront payment and additional payments over time. No repairs required.",
    href: "/solutions/2-payment",
    external: false,
  },
  {
    name: "Price Launch",
    description: "Strategic pricing that accounts for condition. Attract investors and buyers looking for value opportunities.",
    href: "/solutions/price-launch",
    external: false,
  },
  {
    name: "Uplist",
    description: "Let our renovation team handle updates before listing. We front the costs — you pay from sale proceeds.",
    href: "/solutions/uplist",
    external: false,
  },
  {
    name: "Seller Finance",
    description: "Sell as-is to buyers who may not qualify for traditional financing. Receive monthly payments with interest.",
    href: "/solutions/seller-finance",
    external: false,
  },
];

const conditions = [
  "Outdated kitchens or bathrooms",
  "Roof or foundation issues",
  "Deferred maintenance",
  "Cosmetic wear and tear",
  "Inherited properties",
  "Tenant damage",
];

export default function LessThanPerfectHousePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <HeroSection maxWidth="3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          House Less Than Perfect?
        </h1>
        <p className="text-xl text-primary-foreground/80">
          Whether your home needs minor updates or major repairs, we have options that work.
          You don&apos;t have to fix everything yourself — or fix anything at all.
        </p>
      </HeroSection>

      {/* Common Conditions */}
      <Section variant="tight" maxWidth="3xl">
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">
          We Work With Homes That Have:
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center gap-2 text-muted-foreground">
              <HiCheck className="h-5 w-5 text-secondary flex-shrink-0" />
              <span>{condition}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Solutions */}
      <Section variant="content" maxWidth="4xl">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Your Options
        </h2>

        <div className="space-y-4">
          {solutions.map((solution) => (
            <div
              key={solution.name}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-primary mb-1">{solution.name}</h3>
                <p className="text-muted-foreground">{solution.description}</p>
              </div>

              {solution.external ? (
                <a
                  href={solution.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap"
                >
                  Learn More
                  <HiArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={solution.href}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap"
                >
                  Learn More
                  <HiArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="cta" background="primary" maxWidth="2xl" className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Not Sure Which Option Fits?
        </h2>
        <p className="text-primary-foreground/80 mb-8">
          Answer a few questions about your property and goals, and we&apos;ll recommend the best path forward.
        </p>
        <Link
          href="/selling-plan"
          className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-secondary-light transition-colors"
        >
          Find Your Selling Plan
          <HiArrowRight className="h-5 w-5" />
        </Link>
      </Section>
    </div>
  );
}
