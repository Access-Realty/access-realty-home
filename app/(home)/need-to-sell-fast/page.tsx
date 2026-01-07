// ABOUTME: Hybrid page for sellers who need to sell quickly
// ABOUTME: Highlights Cash Offer, 2 Payment, and Seller Finance solutions

import Link from "next/link";
import { HiCheck, HiArrowRight } from "react-icons/hi2";
import { HeroSection, Section } from "@/components/layout";

const solutions = [
  {
    name: "Cash Offer",
    description: "Sell in as little as 7 days with a guaranteed cash offer. No repairs, no showings, no waiting — just a fast, certain close.",
    timeline: "Close in 7-14 days",
    href: "https://metroplexhomebuyers.com",
    external: true,
    highlights: ["Fastest closing option", "No repairs needed", "Guaranteed closing date", "We buy as-is"],
  },
  {
    name: "2 Payment",
    description: "Get a significant upfront payment now, with the remainder paid over time. Combines speed with maximizing your total payout.",
    timeline: "Close in 14-21 days",
    href: "/solutions/2-payment",
    external: false,
    highlights: ["Large upfront payment", "Additional payments over time", "Higher total payout than cash", "Quick closing"],
  },
  {
    name: "Seller Finance",
    description: "Become the bank and receive monthly payments with interest. Ideal if you want ongoing income from your property sale.",
    timeline: "Close in 21-30 days",
    href: "/solutions/seller-finance",
    external: false,
    highlights: ["Monthly income stream", "Earn interest on sale", "Tax advantages", "Flexible terms"],
  },
];

export default function NeedToSellFastPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <HeroSection maxWidth="3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Need to Sell Fast?
        </h1>
        <p className="text-xl text-primary-foreground/80">
          Whether you&apos;re relocating, facing financial challenges, or simply ready to move on quickly,
          we have solutions that can get your home sold in days — not months.
        </p>
      </HeroSection>

      {/* Solutions */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Your Fast-Sale Options
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {solutions.map((solution) => (
            <div
              key={solution.name}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <h3 className="text-xl font-bold text-primary mb-2">{solution.name}</h3>
              <p className="text-muted-foreground mb-4 flex-grow">{solution.description}</p>

              <div className="bg-secondary/10 rounded-lg px-4 py-2 mb-4 inline-block">
                <span className="text-sm font-semibold text-secondary">{solution.timeline}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {solution.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-sm text-foreground">
                    <HiCheck className="h-4 w-4 text-secondary flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>

              {solution.external ? (
                <a
                  href={solution.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors mt-auto"
                >
                  Get Cash Offer
                  <HiArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={solution.href}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors mt-auto"
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
      <Section variant="cta" background="primary" className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Not Sure Which Option Is Right?
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Take our quick quiz to get a personalized recommendation based on your specific situation.
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
