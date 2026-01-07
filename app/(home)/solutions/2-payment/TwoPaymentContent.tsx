// ABOUTME: 2-Payment solution client component - split payment option
// ABOUTME: Extracted to client component to allow server-side dynamic export

"use client";

import { useState } from "react";
import {
  HiCheck,
  HiArrowRight,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineBanknotes,
} from "react-icons/hi2";
import { Section } from "@/components/layout";
import Accordion from "@/components/ui/Accordion";
import { AddressInput, AddressData } from "@/components/direct-list/AddressInput";
import { ProgramInquiryModal } from "@/components/solutions/ProgramInquiryModal";

// Benefits
const benefits = [
  {
    icon: HiOutlineBanknotes,
    title: "Keep Cash in Your Pocket",
    description: "Pay a small amount upfront, the rest comes out of your sale proceeds at closing.",
  },
  {
    icon: HiOutlineCalendarDays,
    title: "Flexible Timing",
    description: "Don't drain your savings before your home sells — pay when it works for you.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "No Hidden Fees",
    description: "Transparent pricing with no surprises. Know exactly what you'll pay and when.",
  },
  {
    icon: HiOutlineDocumentText,
    title: "Simple Agreement",
    description: "Clear terms spelled out upfront so you understand the full cost structure.",
  },
];

// How it works
const howItWorks = [
  {
    step: 1,
    title: "Choose 2-Payment",
    description: "Select the 2-Payment option when you list with us.",
  },
  {
    step: 2,
    title: "Pay Small Upfront Fee",
    description: "A minimal upfront payment gets your listing started without draining your savings.",
  },
  {
    step: 3,
    title: "We List & Sell",
    description: "Your home goes on the market with full MLS exposure and professional marketing.",
  },
  {
    step: 4,
    title: "Pay Balance at Closing",
    description: "The remaining fee is paid from your proceeds when your home sells — not before.",
  },
];

// FAQs
const faqs = [
  {
    question: "How much do I pay upfront?",
    answer: "The upfront payment is a small fraction of the total fee, designed to be affordable while you wait for your home to sell. We'll provide exact figures during your consultation.",
  },
  {
    question: "What if my home doesn't sell?",
    answer: "If your home doesn't sell within the listing agreement period, we'll discuss options including extending the listing or adjusting the strategy.",
  },
  {
    question: "Is this available for all properties?",
    answer: "The 2-Payment option is available for most residential properties in the DFW Metroplex. We'll confirm eligibility during your consultation.",
  },
  {
    question: "Can I combine this with other programs?",
    answer: "In some cases, yes. Depending on your situation, we may be able to combine 2-Payment with other solutions. Let's discuss your specific needs.",
  },
  {
    question: "When is the balance due?",
    answer: "The remaining balance is due at closing, paid directly from your sale proceeds through the title company. You never write a second check.",
  },
];

export default function TwoPaymentContent() {
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
      {/* On-Page Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-semibold text-primary">
                <span className="font-serif italic">2</span>{" "}
                <span className="font-sans font-bold">Payment</span>
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
                Split Your Fees,{" "}
                <span className="text-secondary">Keep Your Cash</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Don&apos;t drain your savings to sell your home. With 2-Payment, you pay a
                small amount upfront and the rest at closing — when you actually have the money.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  Minimal upfront cost
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
                  onClick={handleQualifyClick}
                  className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  See If You Qualify
                  <HiArrowRight className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Free consultation • No obligation • DFW Metroplex only
              </p>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-[400px]">
                  <div className="text-center mb-6">
                    <HiOutlineCurrencyDollar className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground">Pay When It Works For You</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <HiOutlineCheckCircle className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-foreground">Small upfront payment</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <HiOutlineCheckCircle className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-foreground">Balance at closing</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <HiOutlineCheckCircle className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-foreground">Keep cash in your pocket</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <Section variant="content" maxWidth="4xl">
        <div id="how-it-works" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            How 2-Payment Works
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            A simple, flexible way to pay for selling your home
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </Section>

      {/* Benefits */}
      <Section variant="content" maxWidth="5xl">
        <div id="benefits" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Why Choose 2-Payment?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Keep more cash available when you need it most
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-card border border-border rounded-xl p-6 flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="content" maxWidth="3xl">
        <div id="faq" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="bg-card border border-border rounded-xl px-6">
            <Accordion items={faqs} />
          </div>
        </div>
      </Section>

      {/* Bottom CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Keep More Cash in Your Pocket?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            See if 2-Payment is right for your situation. Enter your address above or click below to get started.
          </p>
          <button
            onClick={focusAddressInput}
            className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
          >
            See If You Qualify
            <HiArrowRight className="h-5 w-5" />
          </button>

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <HiCheck className="h-5 w-5 text-white" />
              Free consultation
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <HiCheck className="h-5 w-5 text-white" />
              No pressure
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <HiCheck className="h-5 w-5 text-white" />
              No upfront obligation
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white font-semibold">
              <span className="font-serif italic">2</span>{" "}
              <span className="font-sans font-bold">Payment</span>
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
              © {new Date().getFullYear()} 2-Payment. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* Inquiry Modal */}
      <ProgramInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        programName="2-Payment"
        programMessage="I'm interested in your 2-Payment Program."
        addressData={addressData}
      />
    </div>
  );
}
