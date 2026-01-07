// ABOUTME: Uplist (Novation) solution page
// ABOUTME: For loanable/livable homes - we cover mortgage while listing on MLS

import Link from "next/link";
import { HiCheck, HiArrowRight, HiXMark } from "react-icons/hi2";
import Accordion from "@/components/ui/Accordion";
import { HeroSection, Section } from "@/components/layout";

const isThisYou = [
  "Your home is loanable and livable — maybe just a \"clean grandma's house\"",
  "You won't accept a typical low investor cash offer",
  "You're not in a hurry and willing to wait for the open market",
  "You need mortgage payments covered while the home is selling",
  "You want a realistic net price that aligns with market value",
];

const comparison = [
  {
    option: "Low Investor Offer",
    cons: ["Deep discount off market value", "Quick but leaves money on the table"],
    uplistBetter: true,
  },
  {
    option: "Traditional Listing",
    cons: ["You pay mortgage while it sits", "Showings, repairs, negotiations"],
    uplistBetter: true,
  },
  {
    option: "Uplist",
    pros: ["Market price on open market", "We cover your mortgage", "No listing hassle"],
    uplistBetter: false,
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Property Evaluation",
    description: "We assess your home to confirm it's loanable and livable for retail buyers.",
  },
  {
    step: 2,
    title: "Novation Agreement",
    description: "We agree to cover your mortgage payments while the property is listed for sale.",
  },
  {
    step: 3,
    title: "MLS Listing",
    description: "Your home goes on the open market, exposed to all buyers, for a realistic market price.",
  },
  {
    step: 4,
    title: "We Handle Everything",
    description: "Showings, negotiations, paperwork — you stay hands-off while we manage the sale.",
  },
  {
    step: 5,
    title: "Close & Get Paid",
    description: "When the home sells, you receive your net proceeds at market value.",
  },
];

const benefits = [
  {
    title: "Mortgage Relief",
    description: "Stop worrying about making payments while your home sits on the market.",
  },
  {
    title: "Market Price",
    description: "No deep discounts — your home sells for what it's worth to retail buyers.",
  },
  {
    title: "Zero Hassle",
    description: "We handle showings, negotiations, and all the paperwork.",
  },
  {
    title: "No Repairs Required",
    description: "If your home is already loanable and livable, you're good to go.",
  },
];

const faqs = [
  {
    question: "What is Uplist?",
    answer: "Uplist is a way to sell your home without listing it traditionally. You keep ownership while Uplist handles the repairs, marketing, and resale. Once the home sells, you get paid without upfront costs, showings, or agent commissions.",
  },
  {
    question: "Do I still own my home during the process?",
    answer: "Yes. You remain the owner until the property sells. Uplist simply handles the entire transaction from start to finish.",
  },
  {
    question: "Do I have to pay for repairs?",
    answer: "No. Uplist covers the cost of repairs if requested by the buyer or the buyer's lender.",
  },
  {
    question: "How is this different from listing with a real estate agent?",
    answer: "With a traditional listing, you pay commissions, handle repairs yourself, and deal with contract negotiations and endless paperwork. Selling with Uplist means no agent commissions, no repairs, and hands-off selling.",
  },
  {
    question: "How do I get paid?",
    answer: "You receive your proceeds when the home sells. Everything is outlined clearly before you move forward with no surprises.",
  },
  {
    question: "Is it as fast as an investor cash offer?",
    answer: "No, investor cash offers typically close within 30 days. It's unlikely that a homestead buyer (non-investor) can close within 30 days. Typically they close in the 45-90 day range depending on market conditions.",
  },
  {
    question: "What if my home doesn't sell?",
    answer: "If the market changes or the home doesn't sell within the agreed timeframe, you still own the property and can choose your next step.",
  },
  {
    question: "Is this a loan or cash advance?",
    answer: "No. This is not a loan, not seller financing, and not a cash advance. It's a real estate transaction structured to help you net more without upfront risk.",
  },
  {
    question: "Who is this a good fit for?",
    answer: "Uplist is ideal if your home needs updates to sell for top dollar, you don't want to deal with repairs or showings, or you want a simpler, no-hassle selling process.",
  },
];

export default function UplistPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <HeroSection maxWidth="3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Uplist
        </h1>
        <p className="text-xl text-primary-foreground/80">
          Get a net-to-seller price without the listing hassle.
        </p>
        <p className="mt-4 text-primary-foreground/80">
          Stop settling for low investor offers or risking a difficult traditional sale.
          Our Novation &ldquo;Uplist&rdquo; is the stress-free path to a better price.
        </p>
      </HeroSection>

      {/* Is This You? */}
      <Section variant="content" maxWidth="3xl">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Is This You?
        </h2>
        <div className="space-y-4">
          {isThisYou.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 bg-card border border-border rounded-lg p-4"
            >
              <HiCheck className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Comparison */}
      <Section variant="content" maxWidth="4xl">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Why Uplist Beats the Alternatives
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {comparison.map((item) => (
            <div
              key={item.option}
              className={`rounded-xl p-6 ${
                item.uplistBetter
                  ? "bg-card border border-border"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              <h3 className={`text-lg font-bold mb-4 ${
                item.uplistBetter ? "text-foreground" : "text-primary-foreground"
              }`}>
                {item.option}
              </h3>
              {item.cons && (
                <ul className="space-y-2">
                  {item.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2">
                      <HiXMark className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{con}</span>
                    </li>
                  ))}
                </ul>
              )}
              {item.pros && (
                <ul className="space-y-2">
                  {item.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2">
                      <HiCheck className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-primary-foreground">{pro}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section variant="content" maxWidth="5xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-card border border-border rounded-xl p-6 text-center"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/20 mb-4">
                <HiCheck className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section variant="content" maxWidth="3xl">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          How Uplist Works
        </h2>

        <div className="space-y-4">
          {howItWorks.map((item) => (
            <div
              key={item.step}
              className="flex gap-4 bg-card border border-border rounded-xl p-6"
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

      {/* FAQs */}
      <Section variant="content" maxWidth="3xl">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="bg-card border border-border rounded-xl px-6">
          <Accordion items={faqs} />
        </div>
      </Section>

      {/* CTA */}
      <Section variant="cta" maxWidth="4xl" background="primary" className="text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">
          Ready for a Better Price Without the Hassle?
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Find out if Uplist is right for your situation. We&apos;ll give you a realistic net number with no obligation.
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
