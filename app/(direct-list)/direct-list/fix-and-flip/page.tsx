// ABOUTME: DirectList Fix & Flip landing page for real estate investors
// ABOUTME: Flat-fee MLS listing service targeted at fix and flip sellers

"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroSection, Section } from "@/components/layout";
import { HiCheck, HiChevronDown, HiPhone } from "react-icons/hi2";

// FAQ items for fix & flip investors
const faqItems = [
  {
    question: "Will buyer's agents still show my property?",
    answer:
      "Yes. Your property is listed on the MLS, where buyer's agents are already searching. Nothing changes from their perspective.",
  },
  {
    question: "Who handles negotiations?",
    answer:
      "You stay in control, but you're not alone. Our licensed agents are available to provide guidance and advice whenever you need it without forcing you into a full-service commission.",
  },
  {
    question: "Will my home get the same exposure as a traditional listing?",
    answer:
      "Yes. Your flip is listed on the MLS, which feeds major real estate platforms buyers and agents already use. DirectList gives you professional exposure without the premium fees.",
  },
  {
    question: "Is this only for experienced investors?",
    answer:
      "No. DirectList works for both new and experienced fix & flip investors. The system does most of the work, and support is available if you need it.",
  },
  {
    question: "What if I need help during the listing?",
    answer:
      "You can reach out to our licensed agents anytime for advice, strategy, or clarification. You get help when you want it.",
  },
];

// Comparison table data
const comparisonRows = [
  { feature: "MLS Exposure", directList: "check", traditional: "check" },
  {
    feature: "Listing Experience",
    directList: "Step-by-Step Platform",
    traditional: "Agent Controlled Process",
  },
  {
    feature: "Market Updates",
    directList: "Real Time Updates",
    traditional: "Periodic Check-Ins",
  },
  {
    feature: "Pricing Control",
    directList: "Full Control",
    traditional: "Dependent on Agent",
  },
  {
    feature: "Agent Support",
    directList: "Support Available",
    traditional: "On Demand",
  },
  { feature: "Savings", directList: "Thousands", traditional: "None" },
];

// How it works steps
const steps = [
  {
    number: "01",
    title: "Book a Call",
    description:
      "We will answer questions and explain exactly how the process works.",
  },
  {
    number: "02",
    title: "Set Up Your Listing",
    description:
      "Upload your property details using our step-by-step listing platform and we take care of everything else.",
  },
  {
    number: "03",
    title: "Go Live on the MLS",
    description:
      "Your property is published to the MLS with the same exposure buyers and agents expect, without the high cost of a full-service listing agent.",
  },
  {
    number: "04",
    title: "Stay Informed & In Control",
    description:
      "Stay updated on market activity and make confident pricing decisions. Our experienced, licensed agents are available whenever you need support.",
  },
  {
    number: "05",
    title: "Close With Confidence",
    description:
      "From accepted offer to closing, we help you finish the sale smoothly while maximizing your net proceeds.",
  },
];

export default function FixAndFlipPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HeroSection maxWidth="6xl" centered={false} className="pt-28">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              List Your Investment Property on the MLS Without Paying High
              Listing Fees
            </h1>
            <p className="text-base md:text-lg mb-8 text-white/90">
              DirectList is a self guided flat fee MLS listing service for fix
              and flip investors who want control, clarity, and more money at
              closing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/direct-list/get-started"
                className="inline-flex items-center justify-center bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Book a Call
              </Link>
              <p className="text-sm text-white/70">
                Find out if DirectList is the right fit for you.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:block">
            <div className="border-4 border-secondary rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/hero-house-new.jpg"
                alt="Investment property for sale"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </HeroSection>

      {/* How DirectList Works - Timeline */}
      <Section variant="content" maxWidth="4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How DirectList Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selling your flip shouldn&apos;t require handing over a massive
            chunk of your profit. DirectList gives you MLS exposure, control,
            and support without the high listing fees.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical timeline line */}
          <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-secondary/40" />

          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center z-10">
                  <span className="text-sm font-bold text-primary">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Comparison Table */}
      <Section variant="content" maxWidth="4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See How DirectList Compares to a Traditional Listing
          </h2>
        </div>

        <div className="rounded-xl border border-border shadow-sm overflow-x-auto">
          <table className="w-full min-w-[500px] bg-card">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left px-4 md:px-6 py-4 font-semibold">Feature</th>
                <th className="text-center px-4 md:px-6 py-4 font-semibold">
                  DirectList
                </th>
                <th className="text-center px-4 md:px-6 py-4 font-semibold">
                  Traditional Listing
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={row.feature}
                  className={idx % 2 === 0 ? "bg-card" : "bg-muted/50"}
                >
                  <td className="px-4 md:px-6 py-4 text-foreground">{row.feature}</td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    {row.directList === "check" ? (
                      <HiCheck className="h-5 w-5 text-primary mx-auto" />
                    ) : (
                      <span className="font-semibold text-primary">
                        {row.directList}
                      </span>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    {row.traditional === "check" ? (
                      <HiCheck className="h-5 w-5 text-primary mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">
                        {row.traditional}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section variant="content" maxWidth="3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-primary pr-4">
                    {item.question}
                  </span>
                  <HiChevronDown
                    className={`h-5 w-5 text-primary shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-96 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-muted-foreground px-6">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Bottom CTA - Book a Call */}
      <section className="bg-primary pt-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Book a Call
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Find out if DirectList is the right fit for your next flip.
          </p>
          <Link
            href="/direct-list/get-started"
            className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <HiPhone className="h-5 w-5" />
            Schedule Your Call
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
