// ABOUTME: Price Launch solution client component - renovation partnership program
// ABOUTME: Extracted to client component to allow server-side dynamic export

"use client";

import { useRef, useState } from "react";
import {
  HiXMark,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineWrenchScrewdriver,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCamera,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineArrowTrendingUp,
  HiOutlineCheckBadge,
  HiCheck,
  HiArrowRight,
  HiPhoto,
} from "react-icons/hi2";
import { GiHammerNails } from "react-icons/gi";
import { Section } from "@/components/layout";
import Accordion from "@/components/ui/Accordion";
import { AddressInput, AddressData } from "@/components/direct-list/AddressInput";
import { ProgramInquiryModal } from "@/components/solutions/ProgramInquiryModal";

// What you DON'T have to do cards
const painPoints = [
  { text: "Pay for renovations" },
  { text: "Manage contractors or repairs" },
  { text: "Deal with the stress of fixing up a home" },
  { text: "List or negotiate the sale themselves" },
];

// 6 benefit cards
const benefits = [
  {
    icon: HiOutlineCurrencyDollar,
    title: "Higher Sale Price",
    description: "Get top market value instead of settling for an as-is cash offer.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Zero Money Out of Pocket",
    description: "We fund all renovation expenses — you pay nothing upfront.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Hands-Off Experience",
    description: "We manage contractors, materials, and the entire renovation process.",
  },
  {
    icon: HiOutlineWrenchScrewdriver,
    title: "Professional Updates",
    description: "Strategically chosen renovations that help your home sell for top dollar.",
  },
  {
    icon: HiOutlineHome,
    title: "MLS Listing Included",
    description: "Your home gets full market exposure at no extra charge.",
  },
  {
    icon: HiOutlineDocumentText,
    title: "No Surprise Costs",
    description: "Get more money at closing without stress or hidden fees.",
  },
];

// How it works steps with timeline
const howItWorks = [
  {
    step: 1,
    icon: HiOutlineClipboardDocumentCheck,
    title: "Preliminary Estimate",
    description: "We provide a no-obligation estimate of renovation costs, timeline, and resale potential.",
    timeline: "1–3 Days",
  },
  {
    step: 2,
    icon: HiOutlineUserGroup,
    title: "Contractor Bids",
    description: "Our vetted contractors inspect the property and submit detailed bids.",
    timeline: "3–5 Days",
  },
  {
    step: 3,
    icon: HiOutlineDocumentText,
    title: "Sign the Agreement",
    description: "Once you approve the terms, we put everything in writing and move forward.",
  },
  {
    step: 4,
    icon: GiHammerNails,
    title: "Renovation Begins",
    description: "We order all materials, manage the crews, and oversee the work from start to finish.",
  },
  {
    step: 5,
    icon: HiOutlineCamera,
    title: "Listing Preparation",
    description: "Professional photos are taken, listing paperwork is filled out, and pricing is finalized with you.",
  },
  {
    step: 6,
    icon: HiOutlineTag,
    title: "For Sale",
    description: "We handle showings, buyer feedback, negotiations, and inspections.",
  },
  {
    step: 7,
    icon: HiOutlineCheckBadge,
    title: "Closing & Settlement",
    description: "At closing, all costs are settled through a trusted title company, and remaining proceeds go to you.",
  },
];

// What's paid at closing
const closingCosts = [
  "Standard real estate closing costs",
  "Realtor commissions (if applicable)",
  "Repayment of all renovation expenses we covered",
  "Metroplex Homebuyers' agreed-upon fee",
];

// Considerations
const considerations = [
  {
    icon: HiOutlineClock,
    title: "It takes longer than a cash offer",
    description: "The renovation and listing process requires time to maximize value.",
  },
  {
    icon: HiOutlineArrowTrendingUp,
    title: "Final price depends on the market",
    description: "Your sale price is determined by market conditions at the time of listing.",
  },
  {
    icon: HiOutlineHome,
    title: "Home must be vacant",
    description: "The property needs to be empty during renovations for efficiency.",
  },
];

// Case studies - keeping for credibility
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

// Updated FAQs
const faqs = [
  {
    question: "Do I pay for renovations?",
    answer: "No. We cover all renovation costs upfront. You only pay at closing from your sale proceeds.",
  },
  {
    question: "Do I pay anything upfront?",
    answer: "No. There are no upfront costs. Everything is paid through closing with a trusted title company.",
  },
  {
    question: "How do you get paid?",
    answer: "We receive an agreed-upon fee at closing, typically 5% of the sale price. No hidden fees.",
  },
  {
    question: "Can I live in the home during renovations?",
    answer: "No — the home needs to be vacant so contractors can work efficiently and complete the project faster.",
  },
  {
    question: "Can I use my own agent?",
    answer: "Yes, but you would cover their commission (typically 3%) separately at closing.",
  },
  {
    question: "What if the house doesn't sell?",
    answer: "If the market shifts, we can adjust the price or explore our Seller Finance option to sell without steep discounts.",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PriceLaunchContent() {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const bottomAddressInputRef = useRef<HTMLInputElement>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const focusAddressInput = () => {
    // Focus the hero address input
    const input = document.querySelector<HTMLInputElement>('#hero-address-input input');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleAddressSelect = (address: AddressData) => {
    setAddressData(address);
  };

  const handleQualifyClick = () => {
    if (addressData) {
      setShowInquiryModal(true);
    } else {
      focusAddressInput();
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* On-Page Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-semibold text-primary">
                <span className="font-serif italic">Price</span>{" "}
                <span className="font-sans font-bold">Launch</span>
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-foreground hover:text-primary transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-foreground hover:text-primary transition-colors"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-foreground hover:text-primary transition-colors"
              >
                FAQ
              </button>
            </div>

            {/* CTA Button */}
            <button
              onClick={focusAddressInput}
              className="px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Check Eligibility
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-blue-50 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight mb-6">
                Unlock Your Home&apos;s{" "}
                <span className="text-secondary">Full Value</span> Without
                Managing Renovations
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Price Launch renovates and sells your single-family property using our
                team, our crews, and our capital so you can maximize your sale price
                without managing repairs, contractors, or agents.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  No upfront costs
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  No obligation
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  DFW homes only
                </div>
              </div>

              {/* Address Input */}
              <div id="hero-address-input" className="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-grow">
                  <AddressInput
                    onAddressSelect={handleAddressSelect}
                    placeholder="Enter your property address"
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() => {/* TODO: Submit address */}}
                  className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  See If You Qualify
                  <HiArrowRight className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Free • No obligation • Only available in the DFW Metroplex
              </p>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Decorative illustration placeholder */}
                <div className="bg-white rounded-2xl shadow-xl p-8 w-[500px] h-[350px] flex items-center justify-center">
                  <div className="text-center">
                    <HiOutlineHome className="h-24 w-24 text-primary/30 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">
                      Renovate. List. Sell for more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smarter Alternative Section */}
      <Section variant="content" maxWidth="5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            A Smarter Alternative to{" "}
            <span className="text-secondary">Selling As-Is</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Price Launch helps homeowners get top market value without having to:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 text-center"
            >
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mb-4">
                <HiXMark className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-foreground font-medium">{point.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Benefits Section */}
      <Section variant="content" maxWidth="5xl" id="benefits">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            What You Get With Price Launch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We handle the renovations, pay for the improvements, and manage the entire
            process from start to finish.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How It Works Timeline */}
      <Section variant="content" maxWidth="4xl" id="how-it-works" background="muted">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold uppercase tracking-wide mb-2">
            How It Works
          </p>
          <h2 className="text-3xl font-bold text-primary mb-4">
            Our Proven &quot;Price Launch&quot; Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A streamlined, transparent process designed to maximize your home&apos;s value
            with zero stress on your part.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

          <div className="space-y-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow pt-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-semibold text-primary">
                      Step {item.step}
                    </span>
                    {item.timeline && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {item.timeline}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* What's Paid at Closing */}
      <Section variant="content" maxWidth="2xl">
        <div className="bg-card border border-border rounded-2xl p-8">
          <h3 className="text-xl font-bold text-primary mb-6">
            What&apos;s Paid at Closing?
          </h3>
          <ul className="space-y-3">
            {closingCosts.map((cost, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">{cost}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground italic mt-6">
            There are no upfront costs. Everything is paid through closing with a
            trusted title company.
          </p>
        </div>
      </Section>

      {/* Is Price Launch Right for You? */}
      <Section variant="content" maxWidth="5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Is Price Launch Right for You?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Price Launch is a great option for many homeowners, but it&apos;s not the best
            fit for everyone. Here are some things to consider:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {considerations.map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-muted mb-4">
                <item.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
          <p className="text-foreground">
            <strong>If selling as fast as possible is your top priority</strong>, a cash
            offer may make more sense.{" "}
            <strong>If getting the most value and equity from your home matters more</strong>,
            Price Launch is often the better option.
          </p>
        </div>
      </Section>

      {/* Recent Projects - Kept for credibility */}
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

      {/* FAQ */}
      <Section variant="content" maxWidth="3xl" id="faq">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="bg-card border border-border rounded-xl px-6">
          <Accordion items={faqs} />
        </div>
      </Section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            See If Your Property Qualifies
          </h2>
          <p className="text-white/80 mb-8">
            Enter your address to receive a no-obligation Price Launch evaluation.
          </p>

          <button
            onClick={focusAddressInput}
            className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
          >
            See If You Qualify
            <HiArrowRight className="h-5 w-5" />
          </button>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <HiCheck className="h-5 w-5 text-white" />
              No pressure
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <HiCheck className="h-5 w-5 text-white" />
              No upfront costs
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white font-semibold">
              <span className="font-serif italic">Price</span>{" "}
              <span className="font-sans font-bold">Launch</span>
            </span>

            <div className="flex items-center gap-6 text-white/70 text-sm">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="hover:text-white transition-colors"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="hover:text-white transition-colors"
              >
                FAQ
              </button>
            </div>

            <span className="text-white/50 text-sm">
              © {new Date().getFullYear()} Price Launch. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
