// ABOUTME: Hybrid page for sellers who want to avoid showings/negotiations
// ABOUTME: Highlights Cash, 2 Payment, and Seller Finance solutions

import Link from "next/link";
import { HiCheck, HiArrowRight, HiXMark } from "react-icons/hi2";
import { HeroSection, Section } from "@/components/layout";

const solutions = [
  {
    name: "Cash Offer",
    description: "Zero showings, zero negotiations. We make one fair offer and handle everything. You stay in control of your timeline.",
    href: "https://metroplexhomebuyers.com",
    external: true,
  },
  {
    name: "2 Payment",
    description: "Sell directly without listing. Large upfront payment plus additional payments over time — no open houses required.",
    href: "/solutions/2-payment",
    external: false,
  },
  {
    name: "Seller Finance",
    description: "Sell directly to a buyer you approve. No showings to strangers, straightforward terms you control.",
    href: "/solutions/seller-finance",
    external: false,
  },
];

const painPoints = [
  { pain: "Keeping your home \"show ready\"", avoided: "No cleaning before every showing" },
  { pain: "Strangers walking through your space", avoided: "Sell without open houses" },
  { pain: "Weekend showings disrupting your life", avoided: "Your schedule, your terms" },
  { pain: "Back-and-forth price negotiations", avoided: "Clear, straightforward offers" },
  { pain: "Repair request negotiations", avoided: "Sell as-is or on your terms" },
  { pain: "Uncertainty about if/when it will close", avoided: "Guaranteed closing dates available" },
];

export default function AvoidShowingsNegotiationsPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <HeroSection maxWidth="3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Avoid Showings &amp; Negotiations
        </h1>
        <p className="text-xl text-primary-foreground/80">
          Selling your home shouldn&apos;t mean turning your life upside down.
          We have options that let you stay in control — and keep your sanity.
        </p>
      </HeroSection>

      {/* Pain Points */}
      <Section variant="tight" maxWidth="3xl">
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">
          Traditional Selling Pain Points — Avoided
        </h2>
        <div className="grid gap-4">
          {painPoints.map((item) => (
            <div key={item.pain} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 flex-1">
                <HiXMark className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-muted-foreground line-through">{item.pain}</span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <HiCheck className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-foreground font-medium">{item.avoided}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Solutions */}
      <Section variant="content">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Stress-Free Selling Options
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
      <Section variant="cta" background="primary" className="text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">
          Find Your Perfect Fit
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Take our quick quiz to get a personalized recommendation based on your timeline, property, and priorities.
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
