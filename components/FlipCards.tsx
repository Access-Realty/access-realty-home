// ABOUTME: Interactive flip cards showing different selling solutions
// ABOUTME: Content-only component - wrap with Section at page level for spacing

"use client";

import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaMoneyBillTrendUp, FaPeopleGroup } from "react-icons/fa6";
import { RiPaintBrushFill } from "react-icons/ri";

const cards = [
  {
    icon: BsFillStopwatchFill,
    title: "Need to Sell Fast?",
    description:
      "We buy houses in any condition — and can close in days, not months.",
    href: "/need-to-sell-fast",
  },
  {
    icon: FaMoneyBillTrendUp,
    title: "Want to Maximize Price?",
    description:
      "List your home with our top performing agents or use our exclusive self service listing option and save thousands in fees.",
    href: "/sell-for-the-most",
  },
  {
    icon: RiPaintBrushFill,
    title: "House Less Than Perfect?",
    description:
      "No problem — we have a team ready to handle updates so you don't leave money on the table.",
    href: "/less-than-perfect-house",
  },
  {
    icon: FaPeopleGroup,
    title: "Want To Avoid Showings And Negotiations?",
    description:
      "Let us handle everything behind the scenes while you stay in control.",
    href: "/avoid-showings-negotiations",
  },
];

const FlipCards = () => {
  return (
    <>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground mb-16">
        Your Perfect Selling Solution
      </h2>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Desktop: Flip card */}
              <div className="hidden md:block flip-card h-80">
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="flip-card-front bg-card border-2 border-border rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
                    <card.icon className="h-16 w-16 text-secondary mb-6" />
                    <h3 className="text-2xl font-bold text-foreground">
                      {card.title}
                    </h3>
                  </div>

                  {/* Back */}
                  <div className="flip-card-back bg-primary rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
                    <p className="text-lg text-secondary mb-6">
                      {card.description}
                    </p>
                    <Link
                      href={card.href}
                      className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-primary px-6 py-2 rounded-md transition-colors inline-flex items-center gap-2"
                    >
                      Learn More
                      <HiArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile: Static card showing all content */}
              <div className="md:hidden bg-card border-2 border-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <card.icon className="h-12 w-12 text-secondary flex-shrink-0" />
                  <h3 className="text-xl font-bold text-foreground">
                    {card.title}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Learn More
                  <HiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default FlipCards;
