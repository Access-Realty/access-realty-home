// ABOUTME: Price Launch solution page - renovation partnership program
// ABOUTME: We renovate the property, list it, and get paid at closing

import Link from "next/link";
import { HiCheck, HiArrowRight, HiWrenchScrewdriver, HiExclamationTriangle, HiPhoto } from "react-icons/hi2";
import { HeroSection, Section } from "@/components/layout";

const keyBenefits = [
  {
    title: "Zero Upfront Cost",
    description: "We cover all renovation expenses. You pay at closing from sale proceeds.",
  },
  {
    title: "Expert Renovations",
    description: "Our team selects high-ROI improvements based on hundreds of completed projects.",
  },
  {
    title: "Full-Service Listing",
    description: "Once renovated, we list on MLS, handle showings, and negotiate offers — included.",
  },
];

const whyItWorks = [
  "Faster sale — Updated homes spend fewer days on market",
  "Fewer surprises — Renovations eliminate post-inspection repair requests",
  "Stronger offers — Move-in ready homes attract multiple offer scenarios",
  "Higher net proceeds — Strategic improvements maximize your sale price",
];

const considerations = [
  { upside: "Higher sale price", tradeoff: "Takes longer than a cash offer" },
  { upside: "Professional renovation", tradeoff: "Market conditions can shift during renovation" },
  { upside: "No upfront costs", tradeoff: "Must vacate during renovation" },
];

const howItWorks = [
  {
    step: 1,
    title: "Free Estimate",
    description: "We assess your property and estimate renovation scope, cost, and timeline. No obligation.",
    timeline: "1-3 days",
  },
  {
    step: 2,
    title: "Contractor Bids",
    description: "Our contractors bid on the work and identify anything we missed.",
    timeline: "2-5 days",
  },
  {
    step: 3,
    title: "Sign Agreement",
    description: "If the numbers work, we sign a contract outlining renovations and listing terms.",
  },
  {
    step: 4,
    title: "Renovation",
    description: "We manage everything — materials, contractors, weekly photo updates.",
  },
  {
    step: 5,
    title: "Listing Prep",
    description: "Professional photos, virtual staging, and MLS paperwork handled.",
  },
  {
    step: 6,
    title: "On the Market",
    description: "We conduct showings, gather feedback, negotiate offers, and manage the contract.",
  },
  {
    step: 7,
    title: "Close & Get Paid",
    description: "At closing, renovation costs are settled and you receive your proceeds.",
  },
];

// Placeholder case studies - replace with real data and images
const caseStudies = [
  {
    address: "1609 Pine St",
    city: "Grand Prairie, TX",
    beforeValue: 185000,
    renovationCost: 42000,
    salePrice: 275000,
    netGain: 48000,
  },
  {
    address: "1131 Willow Run Cir",
    city: "Duncanville, TX",
    beforeValue: 210000,
    renovationCost: 35000,
    salePrice: 295000,
    netGain: 50000,
  },
  {
    address: "100 Hickory Springs Dr",
    city: "Euless, TX 76039",
    beforeValue: 165000,
    renovationCost: 38000,
    salePrice: 248000,
    netGain: 45000,
  },
];

const faqs = [
  {
    question: "How long does the renovation take?",
    answer: "Depends on scope — typically 3-6 weeks. We'll provide a timeline after our walkthrough.",
  },
  {
    question: "Do I get input on the design?",
    answer: "We handle design decisions based on what sells in your area. Our style is clean and modern. Happy to share examples of recent projects.",
  },
  {
    question: "Can I stay in the home during renovation?",
    answer: "No — vacant access lets contractors work efficiently and finish faster.",
  },
  {
    question: "Who pays for the renovation?",
    answer: "We do. All costs are repaid from sale proceeds at closing.",
  },
  {
    question: "Can I use my own listing agent?",
    answer: "Yes, but you'd cover their commission (typically 3%) separately.",
  },
  {
    question: "How do you get paid?",
    answer: "5% of the sale price, paid at closing. No upfront fees.",
  },
  {
    question: "How is the sale price determined?",
    answer: "Using recent comparable sales, just like any appraiser. Our licensed realtor assists with pricing.",
  },
  {
    question: "What if the home doesn't sell?",
    answer: "If the market shifts, you can use our Seller Finance option to sell without taking steep discounts.",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PriceLaunchPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <HeroSection maxWidth="3xl">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-foreground/20 mb-6">
          <HiWrenchScrewdriver className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Price Launch
        </h1>
        <p className="text-xl text-primary-foreground/80">
          Renovate first. Sell for more. Pay nothing upfront.
        </p>
        <p className="mt-4 text-primary-foreground/80">
          We handle the entire renovation — design, contractors, materials — so your home
          sells for top dollar. You pay nothing until closing.
        </p>
      </HeroSection>

      {/* Key Benefits */}
      <Section variant="content" maxWidth="5xl">
        <div className="grid md:grid-cols-3 gap-6">
          {keyBenefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-card border border-border rounded-xl p-6 text-center"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/20 mb-4">
                <HiCheck className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why It Works */}
      <Section variant="content" maxWidth="3xl" background="card">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Why Price Launch Works
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {whyItWorks.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Considerations */}
      <Section variant="content" maxWidth="3xl">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          Things to Consider
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Price Launch maximizes value but isn&apos;t the fastest option.
        </p>
        <div className="space-y-4">
          {considerations.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 bg-card rounded-lg p-4 border border-border"
            >
              <div className="flex items-center gap-2 flex-1">
                <HiCheck className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-foreground font-medium">{item.upside}</span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <HiExclamationTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span className="text-muted-foreground">{item.tradeoff}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section variant="content" maxWidth="3xl" background="card">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          How It Works
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
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  {item.timeline && (
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                      {item.timeline}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Case Studies */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          Recent Price Launch Projects
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Real results from properties we&apos;ve renovated and sold.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {/* Placeholder for before/after images */}
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <HiPhoto className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <span className="text-sm">Before / After</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-foreground mb-1">{study.address}</h3>
                <p className="text-sm text-muted-foreground mb-4">{study.city}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">As-Is Value</span>
                    <span className="text-foreground">{formatCurrency(study.beforeValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renovation Cost</span>
                    <span className="text-foreground">{formatCurrency(study.renovationCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sale Price</span>
                    <span className="text-foreground font-semibold">{formatCurrency(study.salePrice)}</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-secondary font-medium">Extra Net Gain</span>
                      <span className="text-secondary font-bold">+{formatCurrency(study.netGain)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQs */}
      <Section variant="content" maxWidth="3xl" background="card">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-xl p-6"
            >
              <h3 className="font-bold text-foreground mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">
                {faq.question === "What if the home doesn't sell?" ? (
                  <>
                    If the market shifts, you can use our{" "}
                    <Link href="/solutions/seller-finance" className="text-secondary hover:underline">
                      Seller Finance
                    </Link>{" "}
                    option to sell without taking steep discounts.
                  </>
                ) : (
                  faq.answer
                )}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="cta" background="primary" maxWidth="4xl" className="text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">
          See If Price Launch Is Right for Your Property
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Get a free, no-obligation renovation estimate and see how much more your home could sell for.
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
