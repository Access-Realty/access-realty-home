// ABOUTME: Wholesaler affiliate recruitment page — earn $150 per signup by referring buyers and sellers
// ABOUTME: Static landing page targeting DFW wholesalers/dispo managers; CTA links to PromoteKit signup

"use client";

import { useState } from "react";
import Image from "next/image";
import { HeroSection, Section } from "@/components/layout";
import {
  HiCheck,
  HiXMark,
  HiChevronDown,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";

const signupUrl = process.env.NEXT_PUBLIC_PROMOTEKIT_SIGNUP_URL || "#";

const faqItems = [
  {
    question: '"I only focus on cash offers."',
    answer:
      "This doesn't replace that. It gives you a backup when the deal doesn't work. You get paid for helping them find another path to sell.",
  },
  {
    question: '"I don\'t want to spam my list."',
    answer:
      "This isn't spam — it's relevant. It directly helps your buyers and sellers make more money. You're giving them a better option, not pitching something random.",
  },
  {
    question: '"Do I have to manage anything?"',
    answer:
      "No. We handle everything — the listing, the process, the support. You just share your link.",
  },
];

export default function PartnersContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-background">
      {/* Hero */}
      <HeroSection maxWidth="6xl" centered={false} className="pt-28">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-white">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-white/15 text-white/90 px-3 py-1 rounded-full mb-6">
              DFW Only — Limited Rollout
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Turn Your Buyers List{" "}
              <em className="italic">and</em> Dead Leads Into Revenue
            </h1>
            <p className="text-base md:text-lg mb-6 text-white/90">
              DFW Wholesalers &amp; Dispo Managers: Earn{" "}
              <strong>$150 per signup</strong> while helping your buyers and
              sellers keep more profit.
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-8 text-sm text-white/90">
              {[
                "Earn $150 per signup",
                "Monetize your buyers list",
                "Convert leads that didn't sell",
                "DFW-only (limited rollout)",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <HiCheck className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <a
              href={signupUrl}
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get Your Affiliate Link
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <div className="hidden md:block">
            <div className="border-4 border-secondary rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/wholesaler-hero.webp"
                alt="Real estate professionals shaking hands"
                width={1024}
                height={768}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </HeroSection>

      {/* Problem Section */}
      <Section variant="content" maxWidth="4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Add Revenue Without Changing Your Current Process
          </h2>
          <p className="text-lg text-muted-foreground">
            Wholesalers are leaving money on the table every single day.
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg font-semibold text-foreground mb-6">
            Think about it:
          </p>
          <div className="space-y-4 max-w-xl mx-auto">
            {[
              {
                icon: HiOutlineUserGroup,
                text: "Most wholesalers need to talk to 20–25 sellers to get 1 deal",
              },
              {
                icon: HiXMark,
                text: "That means 20 or more leads go nowhere",
              },
              {
                icon: HiOutlineCurrencyDollar,
                text: "Your buyers are flipping, and paying 2–3% to list",
              },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-lg font-semibold text-foreground">
          That&apos;s opportunity being lost on both sides.
          <br />
          The DirectList Partner Program fixes that.
        </p>
      </Section>

      {/* Two Ways You Make Money */}
      <Section variant="content" maxWidth="5xl" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Two Ways You Make Money
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Revenue Stream 1: Buyers */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">
                01
              </span>
              <h3 className="text-xl font-bold text-foreground">
                Your Buyers (Fix &amp; Flip Investors)
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Your buyers sign up &rarr; You earn{" "}
              <strong className="text-foreground">$150 per signup</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-3">They get:</p>
            <ul className="space-y-2 mb-6">
              {[
                "MLS exposure (Zillow, Redfin, Realtor.com)",
                "Flat fee listing",
                "No listing agent commission",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-foreground font-medium">
              They save more profit on every flip. You get paid for helping them.
            </p>
          </div>

          {/* Revenue Stream 2: Dead Leads */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">
                02
              </span>
              <h3 className="text-xl font-bold text-foreground">
                Your &ldquo;Dead Leads&rdquo; (Sellers Who Said No)
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Most sellers don&apos;t reject your offer because they don&apos;t
              want to sell. They rejected it because the price is too low.
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Now you can give them another option:
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "As-is sale",
                "Avoid traditional commissions",
                "Keep more of their equity",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <HiXMark className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Before:</strong> No deal —
                  no revenue
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HiCheck className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Now:</strong> Another
                  solution — monetize your dead leads
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section variant="content" maxWidth="4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {[
            {
              step: "01",
              title: "Sign Up",
              description: "Sign up to get your affiliate link.",
            },
            {
              step: "02",
              title: "Share",
              description:
                "Share it with your buyer and seller leads.",
            },
            {
              step: "03",
              title: "Earn",
              description:
                "When they sell with DirectList, you earn $150 per signup.",
            },
          ].map(({ step, title, description }) => (
            <div key={step} className="flex items-start gap-5">
              <span className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center shrink-0">
                {step}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {title}
                </h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-lg font-semibold text-foreground mb-4">
            That&apos;s it. No extra work.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {[
              "No managing listings",
              "No extra calls",
              "No additional workload",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <HiXMark className="h-4 w-4 text-red-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-muted-foreground">
            Just plug it into what you&apos;re already doing.
          </p>
        </div>
      </Section>

      {/* Why This Works */}
      <Section variant="content" maxWidth="4xl" background="muted">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Why This Works
          </h2>
          <p className="text-muted-foreground">
            This isn&apos;t a random offer. It&apos;s directly tied to what your
            network already wants.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">
              Buyers Want:
            </h3>
            <ul className="space-y-3">
              {["More profit", "Lower costs", "Control"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <HiCheck className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">
              Sellers Want:
            </h3>
            <ul className="space-y-3">
              {[
                "To sell without giving up equity",
                "To avoid commissions",
                "A simple process",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <HiCheck className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center mt-8 text-lg text-muted-foreground">
          You&apos;re just connecting them to a solution.
        </p>
      </Section>

      {/* FAQ */}
      <Section variant="content" maxWidth="3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Common Questions
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

      {/* Final CTA */}
      <Section variant="content" maxWidth="4xl" background="primary">
        <div className="text-center text-white">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-white/15 text-white/90 px-3 py-1 rounded-full mb-6">
            DFW Only
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Limited Rollout — DFW Only
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            We are currently rolling this out to a small group of wholesalers in
            DFW.
          </p>

          <div className="flex justify-center gap-10 mb-10 text-sm text-white/80">
            {[
              {
                icon: HiOutlineUserGroup,
                label: "Less competition",
              },
              {
                icon: HiOutlineArrowTrendingUp,
                label: "More opportunity",
              },
              {
                icon: HiOutlineCurrencyDollar,
                label: "First-mover advantage",
              },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-8 text-center max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">
            If you&apos;re actively wholesaling in DFW&hellip;
          </h3>
          <p className="text-white/80 text-sm mb-4">
            This is one of the easiest ways to:
          </p>
          <ul className="space-y-2 mb-6 text-left max-w-xs mx-auto">
            {[
              "Add a new revenue stream",
              "Increase your deal flow opportunities",
              "Deliver more value to your network",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white">
                <HiCheck className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href={signupUrl}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Your Affiliate Link
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </Section>
    </div>
  );
}
