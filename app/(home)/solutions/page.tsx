// ABOUTME: Solutions overview page showcasing 6 service offerings
// ABOUTME: Cards link to individual solution detail pages

import Link from "next/link";
import {
  HiOutlineBanknotes,
  HiOutlineRocketLaunch,
  HiOutlineCreditCard,
  HiOutlineWrenchScrewdriver,
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
} from "react-icons/hi2";

const solutions = [
  {
    id: "cash-offer",
    name: "Cash Offer",
    tagline: "Close in days, not months",
    description:
      "Get a competitive cash offer on your home. Skip showings, repairs, and uncertainty. Ideal for sellers who need speed and simplicity.",
    icon: HiOutlineBanknotes,
    href: "https://metroplexhomebuyers.com",
  },
  {
    id: "price-launch",
    name: "Price Launch",
    tagline: "Test the market risk-free",
    description:
      "Launch your home at an aspirational price before committing to a full listing. See real buyer interest before making decisions.",
    icon: HiOutlineRocketLaunch,
    href: "/solutions/price-launch",
  },
  {
    id: "2-payment",
    name: "2 Payment",
    tagline: "Pay when it works for you",
    description:
      "Split your fees into two payments — a small amount upfront, the rest at closing. Keep more cash in your pocket until you sell.",
    icon: HiOutlineCreditCard,
    href: "/solutions/2-payment",
  },
  {
    id: "uplist",
    name: "Uplist",
    tagline: "Renovate now, pay at closing",
    description:
      "Our remodeling team upgrades your property before listing — new flooring, paint, kitchens, and more. No upfront cost; pay from your sale proceeds.",
    icon: HiOutlineWrenchScrewdriver,
    href: "/solutions/uplist",
  },
  {
    id: "direct-list",
    name: "Direct List",
    tagline: "Full exposure, flat fee",
    description:
      "Get on the MLS and all major sites for a flat fee. You handle showings and negotiations, we handle the paperwork.",
    icon: HiOutlineClipboardDocumentList,
    href: "/direct-list",
  },
  {
    id: "agent",
    name: "Agent",
    tagline: "Full-service representation",
    description:
      "Work with one of our experienced team members who handles everything — pricing, marketing, showings, negotiations, and closing.",
    icon: HiOutlineUserGroup,
    href: "/staff",
  },
];

export default function Solutions() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Sell Your House Your Way
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Six flexible solutions to fit your timeline, budget, and goals.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  {/* Icon */}
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                    <solution.icon className="h-8 w-8 text-primary group-hover:text-secondary transition-colors" />
                  </div>

                  {/* Content */}
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
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Not Sure Which Solution Is Right for You?
          </h2>
          <p className="text-lg text-foreground mb-8 max-w-2xl mx-auto">
            Talk to our team and we&apos;ll help you find the best path to sell your home.
          </p>
          <a
            href="tel:+19728207902"
            className="inline-block bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
          >
            Call (972) 820-7902
          </a>
        </div>
      </section>
    </div>
  );
}
