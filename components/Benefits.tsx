// ABOUTME: Benefits section highlighting customer-centric selling approach
// ABOUTME: Shows key value propositions with checkmarks

import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Top-dollar with a full-service listing",
  "A quick, no-hassle cash offer",
  "Or a commission-saving strategy to keep more equity in their pocket",
];

const Benefits = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Your House. Your Timeline. Your Terms.
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-primary">
              Your Money.
            </h3>
          </div>

          <p className="text-lg md:text-xl text-foreground animate-fade-in">
            We&apos;ve helped hundreds of homeowners sell smart — whether they wanted:
          </p>

          <div className="space-y-6 animate-fade-in">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 text-left max-w-2xl mx-auto"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircle2 className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg md:text-xl text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
