// ABOUTME: Seller Finance solution page
// ABOUTME: Explains owner financing option where seller becomes the lender

import Link from "next/link";
import { HiCheck, HiArrowRight, HiBanknotes } from "react-icons/hi2";
import { HeroSection, Section } from "@/components/layout";

const benefits = [
  {
    title: "Monthly Income Stream",
    description: "Receive consistent monthly payments instead of a single lump sum. Great for retirement income or passive cash flow.",
  },
  {
    title: "Earn Interest",
    description: "As the lender, you earn interest on the financed amount — often more than you'd get from traditional investments.",
  },
  {
    title: "Tax Advantages",
    description: "Spread capital gains over multiple years through an installment sale, potentially reducing your overall tax burden.",
  },
  {
    title: "Faster Sale",
    description: "Attract buyers who may not qualify for traditional financing, expanding your pool of potential purchasers.",
  },
  {
    title: "Collateral Protection",
    description: "The property remains collateral for the loan. If the buyer defaults, you have the option to foreclose and reclaim the property.",
  },
  {
    title: "Flexible Terms",
    description: "You control the interest rate, down payment, and loan terms. Structure the deal to fit your financial goals.",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Property Evaluation",
    description: "We assess your property and discuss your financial goals to determine if seller financing is right for you.",
  },
  {
    step: 2,
    title: "Structure the Terms",
    description: "Together we determine the down payment, interest rate, monthly payment, and loan duration that work for you.",
  },
  {
    step: 3,
    title: "Find a Qualified Buyer",
    description: "We market your property to buyers interested in seller financing and vet them for creditworthiness.",
  },
  {
    step: 4,
    title: "Close the Deal",
    description: "The buyer makes a down payment, signs a promissory note, and you begin receiving monthly payments.",
  },
];

export default function SellerFinancePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <HeroSection maxWidth="3xl">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-foreground/20 mb-6">
          <HiBanknotes className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Seller Financing
        </h1>
        <p className="text-xl text-primary-foreground/80">
          Become the bank. Receive monthly payments with interest while providing buyers
          an alternative to traditional mortgage financing.
        </p>
      </HeroSection>

      {/* Benefits */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Why Consider Seller Financing?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <HiCheck className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                <h3 className="text-lg font-bold text-primary">{benefit.title}</h3>
              </div>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section variant="content" maxWidth="3xl" background="card">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          How It Works
        </h2>

        <div className="space-y-6">
          {howItWorks.map((item) => (
            <div
              key={item.step}
              className="flex gap-4 bg-background border border-border rounded-xl p-6"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Ideal For */}
      <Section variant="content" maxWidth="3xl">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          Seller Financing Is Ideal For
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Sellers seeking passive monthly income",
            "Those looking to minimize capital gains taxes",
            "Owners with properties difficult to finance traditionally",
            "Sellers wanting a faster sale process",
            "Those comfortable with a secured investment",
            "Owners with free-and-clear properties",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-foreground">
              <HiCheck className="h-5 w-5 text-secondary flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="cta" background="primary" className="text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">
          Is Seller Financing Right for You?
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Let&apos;s discuss your property and financial goals to see if seller financing makes sense for your situation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+19728207902"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-secondary-light transition-colors"
          >
            Call (972) 820-7902
          </a>
          <Link
            href="/selling-plan"
            className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
          >
            Find Your Selling Plan
            <HiArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
