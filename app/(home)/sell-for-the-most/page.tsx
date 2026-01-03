// ABOUTME: Hybrid page for sellers who want to maximize sale price
// ABOUTME: Highlights Full Service Listing, DirectList, and Price Launch solutions

import Link from "next/link";
import { HiArrowTrendingUp, HiCheck, HiArrowRight } from "react-icons/hi2";
import { HeroSection, Section } from "@/components/layout";

const solutions = [
  {
    name: "Full Service Listing",
    description: "Our top-performing agents handle everything — professional marketing, expert pricing, skilled negotiations, and full support from listing to closing.",
    benefit: "Maximum exposure & support",
    href: "/staff",
    highlights: ["Professional photography & staging", "MLS + syndicated marketing", "Expert price negotiations", "Dedicated agent support"],
  },
  {
    name: "DirectList",
    description: "List your home on the MLS yourself and save thousands in commission fees. Perfect for sellers who want control and maximum net proceeds.",
    benefit: "Save on commissions",
    href: "/direct-list",
    highlights: ["Flat-fee MLS listing", "Keep more of your equity", "Professional photos included", "Full transaction support"],
  },
  {
    name: "Price Launch",
    description: "Strategic pricing and launch timing designed to create urgency and attract multiple competing offers on your home.",
    benefit: "Competitive bidding strategy",
    href: "/solutions/price-launch",
    highlights: ["Market timing analysis", "Pre-launch buzz building", "Multiple offer strategy", "Premium positioning"],
  },
];

export default function PriceMaximizationPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <HeroSection maxWidth="3xl" className="bg-gradient-to-b from-primary/5 to-background !bg-transparent">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary/20 mb-6">
          <HiArrowTrendingUp className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Want to Maximize Your Price?
        </h1>
        <p className="text-xl text-muted-foreground">
          Your home is likely your biggest asset. We have multiple strategies to help you get
          top dollar — through expert representation, strategic timing, or cost-saving flat-fee options.
        </p>
      </HeroSection>

      {/* Solutions */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Strategies to Maximize Your Sale Price
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
                <span className="text-sm font-semibold text-secondary">{solution.benefit}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {solution.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-sm text-foreground">
                    <HiCheck className="h-4 w-4 text-secondary flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>

              <Link
                href={solution.href}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors mt-auto"
              >
                Learn More
                <HiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="cta" background="primary" maxWidth="2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Not Sure Which Strategy Is Best?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Every home and situation is different. Take our quick quiz to get a personalized recommendation.
          </p>
          <Link
            href="/selling-plan"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-secondary-light transition-colors"
          >
            Find Your Selling Plan
            <HiArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
