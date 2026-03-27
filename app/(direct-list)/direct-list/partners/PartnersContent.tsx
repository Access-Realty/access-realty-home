// app/(direct-list)/direct-list/partners/PartnersContent.tsx
// ABOUTME: Affiliate recruitment pitch page — noindexed, targets wholesalers/investor communities
// ABOUTME: Static page, no forms or API calls; signup URL is a placeholder env var

"use client";

import { HeroSection, Section } from "@/components/layout";
import {
  HiOutlineLink,
  HiOutlineBanknotes,
  HiOutlineArrowPath,
  HiOutlineUserGroup,
  HiOutlineMegaphone,
  HiOutlineAcademicCap,
} from "react-icons/hi2";

const signupUrl = process.env.NEXT_PUBLIC_PROMOTEKIT_SIGNUP_URL || "#";

export default function PartnersContent() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HeroSection maxWidth="4xl" centered={true} className="pt-28">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
          Earn $150 for Every Investor Listing
        </h1>
        <p className="text-base md:text-lg mb-8 text-white/90 max-w-2xl mx-auto">
          Partner with DirectList and earn a recurring commission when your
          referrals list their investment properties on the MLS.
        </p>
        <div className="flex flex-col items-center gap-3">
          <a
            href={signupUrl}
            className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Apply to Become a Partner
          </a>
          <p className="text-white/70 text-sm">
            Applications are reviewed within 48 hours
          </p>
        </div>
      </HeroSection>

      {/* How It Works */}
      <Section variant="content" maxWidth="5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: HiOutlineLink,
              step: "1",
              title: "Share Your Link",
              description:
                "Get a unique referral link and promo code. Share it with investors in your network.",
            },
            {
              icon: HiOutlineBanknotes,
              step: "2",
              title: "Investor Lists a Property",
              description:
                "When a referred investor purchases the DirectList Investor package, you earn a commission.",
            },
            {
              icon: HiOutlineArrowPath,
              step: "3",
              title: "Earn Recurring Revenue",
              description:
                "Every time that investor comes back to list another property, you earn again. For life.",
            },
          ].map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                  {step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Program Details */}
      <Section variant="content" maxWidth="4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Program Details
          </h2>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { label: "Commission per listing", value: "$150" },
              { label: "Commission type", value: "Fixed per transaction" },
              {
                label: "Duration",
                value: "Lifetime — earn on every future listing",
              },
              { label: "Tracking", value: "Unique promo codes per partner" },
              { label: "Payouts", value: "Via Stripe (monthly)" },
              { label: "Support", value: "Dedicated partner support" },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
                <span className="text-base font-semibold text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Who This Is For */}
      <Section variant="content" maxWidth="5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for Real Estate Networks
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: HiOutlineUserGroup,
              title: "Wholesalers & Investors",
              description:
                "You already know investors who need to list properties. Now you can earn when they do.",
            },
            {
              icon: HiOutlineMegaphone,
              title: "Community Leaders",
              description:
                "Run an investor meetup, Facebook group, or Discord? Your members need this.",
            },
            {
              icon: HiOutlineAcademicCap,
              title: "Coaches & Educators",
              description:
                "Recommend a tool your students will actually use — and earn for every referral.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-6 bg-card rounded-xl border border-border shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section variant="cta" maxWidth="4xl" className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Ready to Start Earning?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Join the DirectList partner program and start earning $150 per
          investor listing.
        </p>
        <a
          href={signupUrl}
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Apply Now
          <span aria-hidden="true">&rarr;</span>
        </a>
      </Section>
    </div>
  );
}
