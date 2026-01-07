// ABOUTME: Seller Finance solution client component
// ABOUTME: Owner financing option where seller becomes the lender

"use client";

import { useState } from "react";
import {
  HiCheck,
  HiArrowRight,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineCheckBadge,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { Section } from "@/components/layout";
import Accordion from "@/components/ui/Accordion";
import { AddressInput, AddressData } from "@/components/direct-list/AddressInput";
import { ProgramInquiryModal } from "@/components/solutions/ProgramInquiryModal";

const benefits = [
  {
    icon: HiOutlineBanknotes,
    title: "Monthly Income Stream",
    description: "Receive consistent monthly payments instead of a single lump sum. Great for retirement income or passive cash flow.",
  },
  {
    icon: HiOutlineChartBar,
    title: "Earn Interest",
    description: "As the lender, you earn interest on the financed amount — often more than you'd get from traditional investments.",
  },
  {
    icon: HiOutlineDocumentText,
    title: "Tax Advantages",
    description: "Spread capital gains over multiple years through an installment sale, potentially reducing your overall tax burden.",
  },
  {
    icon: HiOutlineCalendarDays,
    title: "Faster Sale",
    description: "Attract buyers who may not qualify for traditional financing, expanding your pool of potential purchasers.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Collateral Protection",
    description: "The property remains collateral for the loan. If the buyer defaults, you have the option to foreclose and reclaim the property.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Flexible Terms",
    description: "You control the interest rate, down payment, and loan terms. Structure the deal to fit your financial goals.",
  },
];

const howItWorks = [
  {
    step: 1,
    icon: HiOutlineDocumentText,
    title: "Property Evaluation",
    description: "We assess your property and discuss your financial goals to determine if seller financing is right for you.",
  },
  {
    step: 2,
    icon: HiOutlineChartBar,
    title: "Structure the Terms",
    description: "Together we determine the down payment, interest rate, monthly payment, and loan duration that work for you.",
  },
  {
    step: 3,
    icon: HiOutlineUserGroup,
    title: "Find a Qualified Buyer",
    description: "We market your property to buyers interested in seller financing and vet them for creditworthiness.",
  },
  {
    step: 4,
    icon: HiOutlineCheckBadge,
    title: "Close the Deal",
    description: "The buyer makes a down payment, signs a promissory note, and you begin receiving monthly payments.",
  },
];

const idealFor = [
  "Sellers seeking passive monthly income",
  "Those looking to minimize capital gains taxes",
  "Owners with properties difficult to finance traditionally",
  "Sellers wanting a faster sale process",
  "Those comfortable with a secured investment",
  "Owners with free-and-clear properties",
];

const faqs = [
  {
    question: "What is seller financing?",
    answer: "Seller financing (also called owner financing) is when you, the seller, act as the lender instead of a bank. The buyer makes a down payment and then pays you monthly with interest until the property is paid off.",
  },
  {
    question: "Do I need to own my property free and clear?",
    answer: "Not necessarily. While it's simpler if you own the property outright, there are structures that can work even with an existing mortgage. We'll discuss your specific situation during the consultation.",
  },
  {
    question: "What happens if the buyer stops paying?",
    answer: "Because the property serves as collateral, you have the right to foreclose and reclaim the property if the buyer defaults. The promissory note and deed of trust protect your interests.",
  },
  {
    question: "What interest rate can I charge?",
    answer: "You set the interest rate, though it should be competitive with market rates to attract buyers. Rates typically range from 6-10% depending on market conditions and buyer qualifications.",
  },
  {
    question: "How long are typical seller finance terms?",
    answer: "Terms vary based on your goals and the buyer's situation. Common structures include 5-10 year balloon notes or 15-30 year amortization schedules.",
  },
  {
    question: "What are the tax benefits?",
    answer: "By spreading the sale over multiple years (installment sale), you may be able to defer capital gains taxes and potentially pay less overall. Consult a tax professional for your specific situation.",
  },
];

export default function SellerFinanceContent() {
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
                <span className="font-serif italic">Seller</span>{" "}
                <span className="font-sans font-bold">Finance</span>
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
                Become the Bank,{" "}
                <span className="text-secondary">Earn Monthly Income</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Instead of a lump sum, receive monthly payments with interest. Seller financing
                lets you create a passive income stream while potentially reducing your tax burden.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  Monthly income
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  Tax advantages
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  You set the terms
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
                    <HiOutlineBanknotes className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground">Create Passive Income</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <HiCheck className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-foreground">Monthly payments with interest</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <HiCheck className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-foreground">Spread capital gains over time</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <HiCheck className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-foreground">Property stays as collateral</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <Section variant="content" maxWidth="5xl">
        <div id="benefits" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Why Consider Seller Financing?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Turn your property into a long-term investment with predictable returns
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mt-1">{benefit.title}</h3>
                </div>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section variant="content" maxWidth="3xl">
        <div id="how-it-works" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            How Seller Financing Works
          </h2>

          <div className="space-y-6">
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
        </div>
      </Section>

      {/* Ideal For */}
      <Section variant="content" maxWidth="3xl">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          Seller Financing Is Ideal For
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {idealFor.map((item) => (
            <div key={item} className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
              <HiCheck className="h-5 w-5 text-secondary flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQs */}
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
            Is Seller Financing Right for You?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your property and financial goals to see if seller financing makes sense for your situation.
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
              Expert guidance
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white font-semibold">
              <span className="font-serif italic">Seller</span>{" "}
              <span className="font-sans font-bold">Finance</span>
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
              © {new Date().getFullYear()} Seller Finance. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* Inquiry Modal */}
      <ProgramInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        programName="Seller Finance"
        programMessage="I'm interested in your Seller Finance option."
        addressData={addressData}
      />
    </div>
  );
}
