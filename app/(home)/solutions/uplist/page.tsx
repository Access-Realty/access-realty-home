// ABOUTME: Uplist (Novation) solution page
// ABOUTME: For loanable/livable homes - we cover mortgage while listing on MLS

import Link from "next/link";
import { HiCheck, HiArrowRight, HiClipboardDocumentList, HiXMark } from "react-icons/hi2";

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
    question: "What does \"loanable and livable\" mean?",
    answer: "The home is in good enough condition that a bank would approve a mortgage for a buyer. No major structural issues, working utilities, and generally move-in ready — even if dated.",
  },
  {
    question: "How long does it take to sell?",
    answer: "Market timing varies, but because we price realistically and expose your home to all buyers on the MLS, most homes sell within typical market timeframes for your area.",
  },
  {
    question: "Do I have to move out?",
    answer: "Yes, the home needs to be vacant for showings and to present well to buyers.",
  },
  {
    question: "How do you make money?",
    answer: "We earn a fee at closing from the sale proceeds. You know your net number upfront.",
  },
  {
    question: "What if my home needs some work?",
    answer: "If your home needs renovation to be marketable, our Price Launch program might be a better fit. We can help you determine which option is right.",
  },
];

export default function UplistPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary/20 mb-6">
              <HiClipboardDocumentList className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Uplist
            </h1>
            <p className="text-xl text-muted-foreground">
              Get a net-to-seller price without the listing hassle.
            </p>
            <p className="mt-4 text-muted-foreground">
              Stop settling for low investor offers or risking a difficult traditional sale.
              Our Novation &ldquo;Uplist&rdquo; is the stress-free path to a better price.
            </p>
          </div>
        </div>
      </section>

      {/* Is This You? */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
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
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Why Uplist Beats the Alternatives
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {comparison.map((item) => (
                <div
                  key={item.option}
                  className={`rounded-xl p-6 ${
                    item.uplistBetter
                      ? "bg-background border border-border"
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
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
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
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              How Uplist Works
            </h2>

            <div className="space-y-4">
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
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <h3 className="font-bold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">
                    {faq.question === "What if my home needs some work?" ? (
                      <>
                        If your home needs renovation to be marketable, our{" "}
                        <Link href="/solutions/price-launch" className="text-secondary hover:underline">
                          Price Launch
                        </Link>{" "}
                        program might be a better fit. We can help you determine which option is right.
                      </>
                    ) : (
                      faq.answer
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
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
        </div>
      </section>
    </div>
  );
}
