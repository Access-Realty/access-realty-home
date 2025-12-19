// ABOUTME: Interactive flip cards showing different selling solutions
// ABOUTME: Cards flip on hover to reveal description and CTA

import { Clock, TrendingUp, Wrench, Smile } from "lucide-react";

const cards = [
  {
    icon: Clock,
    title: "Need to Sell Fast?",
    description:
      "We buy houses in any condition — and can close in days, not months.",
  },
  {
    icon: TrendingUp,
    title: "Want to Maximize Price?",
    description:
      "List your home with our top performing agents or use our exclusive self service listing option and save thousands in fees.",
  },
  {
    icon: Wrench,
    title: "House Less Than Perfect?",
    description:
      "No problem — we have a team ready to handle updates so you don't leave money on the table.",
  },
  {
    icon: Smile,
    title: "Want To Avoid Showings And Negotiations?",
    description:
      "Let us handle everything behind the scenes while you stay in control.",
  },
];

const FlipCards = () => {
  return (
    <section className="py-16 md:py-24" id="solutions">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground mb-16">
          Your Perfect Selling Solution
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flip-card h-80 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
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
                  <a
                    href="https://app.access.realty/signup"
                    className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-primary px-6 py-2 rounded-md transition-colors"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlipCards;
