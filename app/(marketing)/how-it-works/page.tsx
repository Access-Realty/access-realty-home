// ABOUTME: How It Works page explaining the selling process
// ABOUTME: Step-by-step guide for homeowners

import {
  HiClipboardDocumentList,
  HiHome,
  HiMegaphone,
  HiEnvelope,
  HiCurrencyDollar,
} from "react-icons/hi2";

const steps = [
  {
    number: 1,
    title: "Choose Your Plan",
    description:
      "Select the listing option that fits your needs and budget.",
    icon: HiClipboardDocumentList,
  },
  {
    number: 2,
    title: "Enter Your Information",
    description:
      "Provide basic details about your home so we can prepare your MLS listing.",
    icon: HiHome,
  },
  {
    number: 3,
    title: "Get Listed on the MLS",
    description:
      "Your home is professionally listed and seen by serious buyers actively searching.",
    icon: HiMegaphone,
  },
  {
    number: 4,
    title: "Review Offers as They Come In",
    description:
      "Offers are delivered to you directly with no middleman, and guidance is available whenever you need it.",
    icon: HiEnvelope,
  },
  {
    number: 5,
    title: "Select the Best Offer & Sell",
    description:
      "Choose the offer that works best for you and close while keeping more of your money.",
    icon: HiCurrencyDollar,
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in">
            How It Works
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in">
            Selling your home should be simple. Here&apos;s how we make it happen.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex gap-6 md:gap-8 pb-12 last:pb-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Vertical Line Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 md:left-8 top-16 bottom-0 w-0.5 bg-secondary/30" />
                )}

                {/* Step Number Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                    <step.icon className="w-6 h-6 md:w-8 md:h-8 text-secondary-foreground" />
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-1 md:pt-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-secondary uppercase tracking-wide">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-foreground text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of homeowners who have saved thousands by selling smarter.
          </p>
          <a
            href="https://app.access.realty/signup?source=how-it-works"
            className="inline-block bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
          >
            Start Your Listing
          </a>
        </div>
      </section>
    </div>
  );
}
