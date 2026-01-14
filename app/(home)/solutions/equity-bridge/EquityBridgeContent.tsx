// ABOUTME: Equity Bridge solution client component - mortgage relief while selling
// ABOUTME: Page under construction - content from partner mockups

"use client";

import { useState } from "react";
import {
  HiArrowRight,
  HiExclamationTriangle,
} from "react-icons/hi2";
import { Section } from "@/components/layout";
import Accordion from "@/components/ui/Accordion";
import { AddressInput, AddressData } from "@/components/direct-list/AddressInput";
import { ProgramInquiryModal } from "@/components/solutions/ProgramInquiryModal";

// How it works
const howItWorks = [
  {
    step: 1,
    title: "See If Your Home Qualifies",
    description: "Enter your address and see if Equity Bridge is a fit. It's easy and there's no obligation.",
  },
  {
    step: 2,
    title: "We Remove the Payment",
    description: "If it qualifies, we step in, pay off the loan, and eliminate the monthly payment.",
  },
  {
    step: 3,
    title: "Your Equity When It's Sold",
    description: "When your home sells, fees are settled and you get your equity at closing. No stress. No fire-sale pricing.",
  },
];

// FAQs
const faqs = [
  {
    question: "Is this a loan?",
    answer: "No. Equity Bridge is not a loan. We pay off your existing mortgage and eliminate your monthly payment. You're not taking on new debt — you're getting relief while your home sells.",
  },
  {
    question: "What's the catch?",
    answer: "There's no catch. Our fee comes out of the sale proceeds at closing, similar to typical real estate commissions. You know the cost upfront, and you don't pay anything until your home sells.",
  },
  {
    question: "Do I lose control of my home?",
    answer: "No. You remain in control of the sale. You decide on the listing price, approve showings, and accept or reject offers. We're here to remove the financial pressure, not take over.",
  },
  {
    question: "Will I still get my equity?",
    answer: "Yes. When your home sells, our fees are settled from the proceeds and you receive your remaining equity at closing — just like a traditional sale.",
  },
  {
    question: "Is there any cost to see if I qualify?",
    answer: "No. Checking your eligibility is completely free with no obligation. Enter your address and we'll let you know if Equity Bridge is a fit for your situation.",
  },
  {
    question: "Who is this for?",
    answer: "Equity Bridge is ideal for homeowners who need to sell but are struggling with monthly payments, facing foreclosure, or simply want relief from carrying costs while their home is on the market.",
  },
];

export default function EquityBridgeContent() {
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const focusAddressInput = () => {
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
      {/* Under Construction Banner */}
      <div className="bg-secondary/20 border-b border-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-2 text-sm text-foreground">
            <HiExclamationTriangle className="h-5 w-5 text-secondary" />
            <span>This page is under construction. Content and design coming soon.</span>
          </div>
        </div>
      </div>

      {/* On-Page Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-semibold text-primary">
                <span className="font-serif italic">Equity</span>{" "}
                <span className="font-sans font-bold">Bridge</span>
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

      {/* How It Works */}
      <Section variant="content" maxWidth="4xl">
        <div id="how-it-works" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            How Equity Bridge Works
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            A smarter way to eliminate payments while selling — without giving up your equity.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Bottom line callout */}
          <div className="mt-8 text-center">
            <p className="inline-flex items-center gap-2 text-foreground font-medium bg-card border border-border rounded-full px-6 py-3">
              <span className="h-2 w-2 rounded-full bg-secondary"></span>
              Bottom line: You get relief now and your equity later.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="content" maxWidth="3xl">
        <div id="faq" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Get answers to common questions about the Equity Bridge Program.
          </p>

          <div className="bg-card border border-border rounded-xl px-6">
            <Accordion items={faqs} />
          </div>
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section variant="content" maxWidth="3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Ready to Get Relief From Double Payments?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Enter your address below to see if your home qualifies for the Equity Bridge Program.
          </p>

          {/* Address Input */}
          <div id="hero-address-input" className="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <div className="flex-grow">
              <AddressInput
                onAddressSelect={handleAddressSelect}
                placeholder="Enter your property address"
                className="w-full"
              />
            </div>
            <button
              onClick={handleQualifyClick}
              className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Check Eligibility
              <HiArrowRight className="h-5 w-5" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Free • No obligation • Only available in the DFW Metroplex
          </p>
        </div>
      </Section>

      {/* Inquiry Modal */}
      <ProgramInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        programName="Equity Bridge"
        programSlug="equity_bridge"
        addressData={addressData}
      />
    </div>
  );
}
