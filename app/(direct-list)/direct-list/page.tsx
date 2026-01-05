// ABOUTME: DirectList landing page for flat-fee MLS listing service
// ABOUTME: Showcases savings, process, and pricing comparison

"use client";

import { useState } from "react";
import {
  HiCheck,
  HiChevronDown,
  HiOutlineBanknotes,
  HiOutlineHomeModern,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlinePencilSquare,
  HiOutlineCamera,
  HiOutlineRocketLaunch,
  HiOutlineChatBubbleLeftRight
} from "react-icons/hi2";
import Link from "next/link";
import { StyledTierName } from "@/components/services/StyledTierName";

// Service tier definitions
const SERVICE_TIERS = [
  {
    id: "direct_list",
    name: "DirectList",
    totalPrice: "$2,995",
    upfrontPrice: "$495",
    badge: null,
    tagline: "Everything you need to list on MLS",
    features: [
      "MLS Listing + Syndication",
      "Professional Photography",
      "Professionally Guided Pricing Strategy",
      "Digital Document Signing",
      "Lockbox & Yard Sign",
      "Showings via ShowingTime",
      "Monthly Market Assessments",
      "On Demand Services Available",
    ],
    cta: "Get Started",
    footer: null,
  },
  {
    id: "direct_list_plus",
    name: "DirectList+",
    totalPrice: "$4,495",
    upfrontPrice: "$995",
    badge: "BEST VALUE",
    tagline: "Everything in DirectList, plus:",
    features: [
      "Bi-Weekly Market Assessments",
      "Professionally Written Listing Description",
      "Virtual Walkthrough (Matterport)",
      "2D Floor Plan",
      "Aerial Photography",
      "Amenities Photography",
      "Virtual Staging (3 Photos)",
      "Showing Feedback Requests",
      "1 Mega Open House",
      "1 Contract Negotiation",
      "1 Amendment Negotiation",
      "Discounted On Demand Services",
    ],
    cta: "Get Started Now",
    footer: "Most popular for confident sellers",
  },
  {
    id: "full_service",
    name: "Full Service",
    totalPrice: "3%",
    upfrontPrice: null,
    badge: null,
    tagline: "Everything in DirectList+, and:",
    features: [
      "On-Site Evaluation",
      "Weekly On-Market Reporting",
      "Virtual Staging (Whole House/Yard)",
      "Contract Negotiation on Every Offer",
      "Amendment Negotiations",
      "Preferred Vendor Access",
      "Hands-Off Repairs Management",
      "Hands-Off Transaction Coordination",
    ],
    cta: "Get Started",
    footer: "No upfront cost — pay only when you sell",
  },
];

// On Demand Services by tier
const ON_DEMAND_SERVICES = {
  direct_list: [
    { service: "Virtual Walkthrough", price: "$99" },
    { service: "2D Floor Plan", price: "$49" },
    { service: "Aerial Photography", price: "$99" },
    { service: "Amenities Photography", price: "$40" },
    { service: "Virtual Staging", price: "$99" },
    { service: "Mega Open House", price: "$99" },
    { service: "On-Market Consultation", price: "$99" },
    { service: "On-Site Evaluation", price: "$199" },
    { service: "Contract Negotiation", price: "$249" },
    { service: "Amendment Negotiation", price: "$249" },
    { service: "Leaseback Package", price: "$499" },
  ],
  direct_list_plus: [
    { service: "On-Market Consultation", price: "$99" },
    { service: "On-Site Evaluation", price: "$199" },
    { service: "Addl Contract Negotiation", price: "$149" },
    { service: "Addl Amendment Negotiation", price: "$149" },
    { service: "Leaseback Package", price: "$299" },
  ],
};
// NOTE: ListingsCarousel removed - it's a server component that can't be imported into a client component
// TODO: Add back via a server layout wrapper if needed
import CarouselNav from "@/components/listings/CarouselNav";
import { SavingsCalculatorModal } from "@/components/direct-list/SavingsCalculatorModal";
import { HeroSection, Section } from "@/components/layout";

// Styled DirectList logo component
function DirectListLogo({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      <span
        style={{
          fontFamily: "'Times New Roman', serif",
          fontStyle: "italic",
          fontWeight: 400,
        }}
      >
        Direct
      </span>
      <span
        style={{
          fontFamily: "var(--font-be-vietnam-pro), 'Be Vietnam Pro', sans-serif",
          fontWeight: 700,
        }}
      >
        List
      </span>
    </span>
  );
}

export default function DirectListPage() {
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());

  const toggleExpanded = (tierId: string) => {
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tierId)) {
        next.delete(tierId);
      } else {
        next.add(tierId);
      }
      return next;
    });
  };

  return (
    <div className="bg-card">
      {/* Hero Section */}
      <HeroSection maxWidth="6xl" centered={false} className="md:pt-28 pb-16 md:pb-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <DirectListLogo />
              </h1>
              <p
                className="text-2xl md:text-3xl mb-6 text-secondary italic"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                The way selling your home should be.
              </p>
              <h2 className="text-base md:text-lg mb-8 text-white/90">
                Everything an agent provides for a fraction of the cost.
                <br />
                Because selling smart shouldn&apos;t cost 6%.
              </h2>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/direct-list/get-started"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors"
                >
                  Get Started Now
                </Link>
                <button
                  onClick={() => setShowSavingsModal(true)}
                  className="inline-flex items-center justify-center bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                >
                  Calculate Your Savings
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 md:gap-8 text-secondary">
                <div className="border-r border-white/20 pr-6 md:pr-8">
                  <div className="text-2xl md:text-3xl font-bold">$12,000</div>
                  <div className="text-xs uppercase tracking-wide opacity-80">Average Savings</div>
                </div>
                <div className="border-r border-white/20 pr-6 md:pr-8">
                  <div className="text-2xl md:text-3xl font-bold">72 hrs</div>
                  <div className="text-xs uppercase tracking-wide opacity-80">MLS Activation</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold">100%</div>
                  <div className="text-xs uppercase tracking-wide opacity-80">Your Control</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden md:block">
              <div className="border-4 border-secondary rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="/hero-house-new.jpg"
                  alt="Beautiful home for sale"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
      </HeroSection>

      {/* Why Sell Without a Realtor */}
      <Section variant="content" maxWidth="6xl" background="card">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Sell Without a Realtor?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our simple listing system gives you everything you need to sell your home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Save Thousands */}
            <div className="bg-muted rounded-xl p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineBanknotes className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Save Thousands in Commissions
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save on listing commissions. On a $400k home that&apos;s over $9,000 in savings.
              </p>
              <span className="inline-block text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1">
                Huge savings
              </span>
            </div>

            {/* Full MLS Exposure */}
            <div className="bg-muted rounded-xl p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineHomeModern className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Full MLS Exposure
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your property appears on all major real estate websites including Zillow, Realtor.com, and Redfin.
              </p>
              <span className="inline-block text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1">
                Maximum visibility
              </span>
            </div>

            {/* Complete Control */}
            <div className="bg-muted rounded-xl p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Complete Control
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                You decide on pricing, showings, negotiations, and timeline. No pressure from agents to accept low offers.
              </p>
              <span className="inline-block text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1">
                Your decisions
              </span>
            </div>

            {/* Quick MLS Activation */}
            <div className="bg-muted rounded-xl p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineClock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Quick MLS Activation
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get your listing live within 72 hours. Professional photos and description creation included.
              </p>
              <span className="inline-block text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1">
                72-hour setup
              </span>
            </div>
          </div>
      </Section>

      {/* Testimonials */}
      <Section variant="content" background="muted" className="overflow-hidden" maxWidth="full">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
              REAL RESULTS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What Our Sellers Say
            </h2>
          </div>

          <CarouselNav>
            {/* Testimonial 1 - The Skeptic */}
            <div className="flex-shrink-0 w-[320px] sm:w-[360px] snap-start">
              <div className="bg-card rounded-xl p-6 border border-border h-full">
                <p className="text-foreground mb-4">
                  &quot;Traditional agents wanted 6% of our sale price. We used DirectList instead, got the same MLS exposure, and kept most of that money. The listing looked just as professional as our neighbor&apos;s who paid full commission. I don&apos;t know why everyone doesn&apos;t do this.&quot;
                </p>
                <div className="border-t border-border pt-4 flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/80?img=70"
                    alt="Michael T."
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Michael T.</p>
                    <p className="text-sm text-muted-foreground">Plano · Sold in 23 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - The First-Timer */}
            <div className="flex-shrink-0 w-[320px] sm:w-[360px] snap-start">
              <div className="bg-card rounded-xl p-6 border border-border h-full">
                <p className="text-foreground mb-4">
                  &quot;I&apos;d never sold a house before and was nervous about doing it myself. The app walked me through everything step by step. When I got my first offer and started second-guessing myself, my agent called me back within an hour and walked me through what to look for. Closed in 30 days, no surprises.&quot;
                </p>
                <div className="border-t border-border pt-4 flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/80?img=47"
                    alt="Sarah M."
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Sarah M.</p>
                    <p className="text-sm text-muted-foreground">Keller · First-time seller</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - The Experienced Seller */}
            <div className="flex-shrink-0 w-[320px] sm:w-[360px] snap-start">
              <div className="bg-card rounded-xl p-6 border border-border h-full">
                <p className="text-foreground mb-4">
                  &quot;This was my third home sale. I know how to price, I know how to show, I know how to negotiate. What I needed was MLS access — not a 3% babysitter. DirectList gave me exactly that. Listed, sold in two weeks, saved $9,000. Perfect for anyone who&apos;s done this before.&quot;
                </p>
                <div className="border-t border-border pt-4 flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/80?img=52"
                    alt="Mark H."
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Mark H.</p>
                    <p className="text-sm text-muted-foreground">Coppell · Third home sale</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 4 - The Negotiation Win */}
            <div className="flex-shrink-0 w-[320px] sm:w-[360px] snap-start">
              <div className="bg-card rounded-xl p-6 border border-border h-full">
                <p className="text-foreground mb-4">
                  &quot;I was fine until the offer came in $20k under asking. I had no idea how to respond. My DirectList agent reviewed the buyer&apos;s terms, helped me write a counter, and coached me through two rounds of back-and-forth. Closed $8,000 higher than that first offer. That support alone was worth it.&quot;
                </p>
                <div className="border-t border-border pt-4 flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/80?img=44"
                    alt="Angela R."
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Angela R.</p>
                    <p className="text-sm text-muted-foreground">Lewisville · Sold $8k over initial offer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 5 - The Investor */}
            <div className="flex-shrink-0 w-[320px] sm:w-[360px] snap-start">
              <div className="bg-card rounded-xl p-6 border border-border h-full">
                <p className="text-foreground mb-4">
                  &quot;In 2025 I sold five flips through DirectList — ranged from $285k to $465k. If I&apos;d paid 3% on each of those, that&apos;s $56,000 in listing commissions. Instead I paid under $15,000 total. Same MLS, same Zillow exposure, same buyer pool. I kept $41,000 that would&apos;ve gone to agents. Flat fee beats percentage every time.&quot;
                </p>
                <div className="border-t border-border pt-4 flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/80?img=68"
                    alt="Ryan D."
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Ryan D.</p>
                    <p className="text-sm text-muted-foreground">Dallas · Real estate investor</p>
                  </div>
                </div>
              </div>
            </div>
          </CarouselNav>
      </Section>

      {/* How It Works */}
      <Section variant="content" maxWidth="4xl" background="card">
        <div className="text-center mb-16">
            <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
              SIMPLE PROCESS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your home on the MLS in just 4 simple steps. We handle the technical details while you stay in control.
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 - Left */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <HiOutlinePencilSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Complete Your Listing
                </h3>
                <p className="text-muted-foreground">
                  Fill out our simple form with your property details, pricing, and contact information.
                </p>
              </div>
            </div>

            {/* Step 2 - Right on desktop */}
            <div className="flex gap-6 items-start md:flex-row-reverse md:text-right">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <HiOutlineCamera className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Professional Setup
                </h3>
                <p className="text-muted-foreground">
                  We create your MLS listing with professional descriptions and optimize your photos.
                </p>
              </div>
            </div>

            {/* Step 3 - Left */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <HiOutlineRocketLaunch className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Property Goes Live
                </h3>
                <p className="text-muted-foreground">
                  Your property appears on the MLS and all major real estate sites with maximum exposure.
                </p>
              </div>
            </div>

            {/* Step 4 - Right on desktop */}
            <div className="flex gap-6 items-start md:flex-row-reverse md:text-right">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <HiOutlineChatBubbleLeftRight className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Manage Your Sale
                </h3>
                <p className="text-muted-foreground">
                  Handle showings, negotiations, and closing yourself while we provide ongoing support.
                </p>
              </div>
            </div>
          </div>
      </Section>

      {/* Pricing Section */}
      <Section variant="content" maxWidth="5xl" background="card" id="pricing">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
            PRICING
          </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Compare Your Options
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See exactly how much you can save by selling without a traditional realtor while still getting MLS exposure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {SERVICE_TIERS.map((tier) => {
              const hasAddOns = tier.id !== "full_service";
              const addOns = ON_DEMAND_SERVICES[tier.id as keyof typeof ON_DEMAND_SERVICES];
              const isExpanded = expandedTiers.has(tier.id);

              return (
                <div key={tier.id} className="relative pt-3">
                  {/* Badge - outside card to avoid overflow clipping */}
                  {tier.badge && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm">
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div
                    className={`rounded-xl border-2 overflow-hidden flex flex-col h-full ${
                      tier.id === "direct_list_plus"
                        ? "border-primary shadow-lg"
                        : "border-border"
                    }`}
                  >
                    {/* Card Header */}
                    <div className={`p-6 text-center ${tier.badge ? "pt-8" : ""} ${
                      tier.id === "direct_list_plus" ? "bg-primary/5" : "bg-muted/30"
                    }`}>
                      <h3 className="text-2xl font-semibold mb-2">
                        <StyledTierName name={tier.name} />
                      </h3>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        {tier.upfrontPrice ? "Upfront" : "Pay at closing"}
                      </div>
                      <div className="text-3xl font-bold text-primary mt-1">
                        {tier.upfrontPrice || tier.totalPrice}
                      </div>
                      {tier.upfrontPrice && (
                        <div className="text-sm text-muted-foreground">
                          {tier.totalPrice} total
                        </div>
                      )}
                      {!tier.upfrontPrice && (
                        <div className="text-sm text-muted-foreground">
                          No upfront payment
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="p-6 flex-grow">
                      <p className="text-sm font-medium text-muted-foreground mb-4">
                        {tier.tagline}
                      </p>
                      <ul className="space-y-3">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <HiCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* On Demand Services Expandable */}
                      {hasAddOns && addOns && (
                        <div className="mt-6 border-t border-border pt-4">
                          <button
                            onClick={() => toggleExpanded(tier.id)}
                            className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span>On Demand Services</span>
                            <HiChevronDown
                              className={`h-5 w-5 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="mt-3 space-y-2">
                              {addOns.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0"
                                >
                                  <span className="text-muted-foreground">
                                    {item.service}
                                  </span>
                                  <span className="font-medium">{item.price}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer note */}
                      {tier.footer && (
                        <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t border-border">
                          {tier.footer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA - inside pricing section to avoid double padding */}
          <div className="text-center mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Ready to Save Thousands on Your Home Sale?
            </h2>
            <p className="text-xl text-secondary font-semibold mb-2">
              Save $9,000 on a $400k home sale compared to traditional realtors
            </p>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Get full MLS exposure and keep more money in your pocket.
            </p>
            <Link
              href="/direct-list/get-started"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
            >
              List My Home on MLS
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
      </Section>

      {/* Savings Calculator Modal */}
      <SavingsCalculatorModal
        isOpen={showSavingsModal}
        onClose={() => setShowSavingsModal(false)}
      />
    </div>
  );
}
