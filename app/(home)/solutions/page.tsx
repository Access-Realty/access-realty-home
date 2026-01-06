// ABOUTME: Solutions overview page showcasing 6 service offerings
// ABOUTME: Cards link to individual solution detail pages

import Link from "next/link";
import { HeroSection, Section, AccessCTA } from "@/components/layout";

const solutions = [
  {
    id: "cash-offer",
    name: "Cash Offer",
    tagline: "Close in days, not months",
    description:
      "Get a competitive cash offer on your home. Skip showings, repairs, and uncertainty. Ideal for sellers who need speed and simplicity.",
    href: "https://metroplexhomebuyers.com",
  },
  {
    id: "price-launch",
    name: "Price Launch",
    tagline: "Renovate first. Sell for more.",
    description:
      "We handle the entire renovation — design, contractors, materials — so your home sells for top dollar. You pay nothing until closing.",
    href: "/solutions/price-launch",
  },
  {
    id: "2-payment",
    name: "2 Payment",
    tagline: "Pay when it works for you",
    description:
      "Split your fees into two payments — a small amount upfront, the rest at closing. Keep more cash in your pocket until you sell.",
    href: "/solutions/2-payment",
  },
  {
    id: "uplist",
    name: "Uplist",
    tagline: "Market price, zero hassle",
    description:
      "Your home is loanable and livable but you won't accept a low investor offer. We cover your mortgage while it sells on the open market — you get a net-to-seller price.",
    href: "/solutions/uplist",
  },
  {
    id: "direct-list",
    name: "Direct List",
    tagline: "Full exposure, flat fee",
    description:
      "Get on the MLS and all major sites for a flat fee. You handle showings and negotiations, we handle the paperwork.",
    href: "/direct-list",
  },
  {
    id: "agent",
    name: "Agent",
    tagline: "Full-service representation",
    description:
      "Work with one of our experienced team members who handles everything — pricing, marketing, showings, negotiations, and closing.",
    href: "/staff",
  },
];

export default function Solutions() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HeroSection>
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
          Sell Your House Your Way
        </h1>
        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
          Six flexible solutions to fit your timeline, budget, and goals.
        </p>
      </HeroSection>

      {/* Solutions Grid */}
      <Section variant="content" maxWidth="6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => {
              const isExternal = solution.href.startsWith("http");
              const CardWrapper = isExternal ? "a" : Link;
              const extraProps = isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {};

              return (
                <CardWrapper
                  key={solution.id}
                  href={solution.href}
                  className="group bg-card border-2 border-border rounded-xl p-8 hover:border-secondary hover:shadow-xl transition-all"
                  {...extraProps}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {solution.name}
                  </h2>
                  <p className="text-secondary font-semibold mb-4">
                    {solution.tagline}
                  </p>
                  <p className="text-muted-foreground text-sm mb-6">
                    {solution.description}
                  </p>

                  {/* CTA */}
                  <span className="inline-flex items-center text-primary font-semibold group-hover:text-secondary transition-colors">
                    Learn More
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </span>
                </CardWrapper>
              );
            })}
        </div>
      </Section>

      <AccessCTA />
    </div>
  );
}
