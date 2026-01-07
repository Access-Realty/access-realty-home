// ABOUTME: Uplist (Novation) solution client component
// ABOUTME: For loanable/livable homes - we cover mortgage while listing on MLS

"use client";

import { useState } from "react";
import {
  HiCheck,
  HiArrowRight,
  HiXMark,
  HiOutlineHome,
  HiOutlineBanknotes,
  HiOutlineClipboardDocumentCheck,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import { Section } from "@/components/layout";
import Accordion from "@/components/ui/Accordion";
import { AddressInput, AddressData } from "@/components/direct-list/AddressInput";
import { ProgramInquiryModal } from "@/components/solutions/ProgramInquiryModal";

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
    icon: HiOutlineClipboardDocumentCheck,
    title: "Property Evaluation",
    description: "We assess your home to confirm it's loanable and livable for retail buyers.",
  },
  {
    step: 2,
    icon: HiOutlineDocumentText,
    title: "Novation Agreement",
    description: "We agree to cover your mortgage payments while the property is listed for sale.",
  },
  {
    step: 3,
    icon: HiOutlineHome,
    title: "MLS Listing",
    description: "Your home goes on the open market, exposed to all buyers, for a realistic market price.",
  },
  {
    step: 4,
    icon: HiOutlineUserGroup,
    title: "We Handle Everything",
    description: "Showings, negotiations, paperwork — you stay hands-off while we manage the sale.",
  },
  {
    step: 5,
    icon: HiOutlineCheckBadge,
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

export default function UplistContent() {
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
                <span className="font-serif italic">Up</span>
                <span className="font-sans font-bold">list</span>
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
                Get Market Price{" "}
                <span className="text-secondary">Without the Hassle</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Stop settling for low investor offers. With Uplist, we cover your mortgage
                payments while your home sells on the open market for what it&apos;s actually worth.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  Mortgage covered
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  Market price
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <HiCheck className="h-5 w-5 text-primary" />
                  Hands-off selling
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
                    <p className="text-lg font-semibold text-foreground">We Cover Your Mortgage</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <HiCheck className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-foreground">No payments while selling</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <HiCheck className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-foreground">Full MLS exposure</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <HiCheck className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-foreground">Market value sale price</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        <div id="benefits" className="scroll-mt-20">
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
      </Section>

      {/* How It Works */}
      <Section variant="content" maxWidth="3xl">
        <div id="how-it-works" className="scroll-mt-20">
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
        </div>
      </Section>

      {/* FAQs */}
      <Section variant="content" maxWidth="3xl">
        <div id="faq" className="scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
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
            Ready for a Better Price Without the Hassle?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Find out if Uplist is right for your situation. We&apos;ll give you a realistic net number with no obligation.
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
              Mortgage relief
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white font-semibold">
              <span className="font-serif italic">Up</span>
              <span className="font-sans font-bold">list</span>
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
              © {new Date().getFullYear()} Uplist. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* Inquiry Modal */}
      <ProgramInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        programName="Uplist"
        programMessage="I'm interested in your Uplist Program."
        addressData={addressData}
      />
    </div>
  );
}
