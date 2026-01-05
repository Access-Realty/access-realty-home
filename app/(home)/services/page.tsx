// ABOUTME: Services page with tiered pricing cards
// ABOUTME: Progressive "build-up" design - each tier includes everything from previous tier

"use client";

import { useState } from "react";
import { HiCheck, HiChevronDown } from "react-icons/hi2";
import { TierSelectTrigger } from "@/components/services/TierSelectTrigger";

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

// Render styled tier name using brand logo fonts
function StyledTierName({ name }: { name: string }) {
  const italicStyle: React.CSSProperties = {
    fontFamily: "'Times New Roman', serif",
    fontStyle: "italic",
    fontWeight: 400,
  };
  const boldStyle: React.CSSProperties = {
    fontFamily: "var(--font-be-vietnam-pro), 'Be Vietnam Pro', sans-serif",
    fontWeight: 700,
  };

  if (name === "DirectList") {
    return (
      <span>
        <span style={italicStyle}>Direct</span>
        <span style={boldStyle}>List</span>
      </span>
    );
  }
  if (name === "DirectList+") {
    return (
      <span>
        <span style={italicStyle}>Direct</span>
        <span style={boldStyle}>List+</span>
      </span>
    );
  }
  if (name === "Full Service") {
    return (
      <span>
        <span style={italicStyle}>Full</span>{" "}
        <span style={boldStyle}>Service</span>
      </span>
    );
  }
  return <span>{name}</span>;
}

export default function Services() {
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  const toggleExpanded = (tierId: string) => {
    setExpandedTier(expandedTier === tierId ? null : tierId);
  };

  return (
    <div className="pt-24 pb-12 bg-card">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Choose Your Service Level
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            All plans include MLS listing, professional photography, and expert support.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {SERVICE_TIERS.map((tier) => {
            const hasAddOns = tier.id !== "full_service";
            const addOns = ON_DEMAND_SERVICES[tier.id as keyof typeof ON_DEMAND_SERVICES];
            const isExpanded = expandedTier === tier.id;

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
                </div>

                {/* CTA */}
                <div className="p-6 pt-0 mt-auto">
                  <TierSelectTrigger
                    initialTier={tier.id.replace(/_/g, "-")}
                    source="services-page"
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                      tier.id === "direct_list_plus"
                        ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                        : "bg-primary/90 text-primary-foreground hover:bg-primary"
                    }`}
                  >
                    {tier.cta}
                  </TierSelectTrigger>
                  {tier.footer && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {tier.footer}
                    </p>
                  )}
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings callout */}
        <div className="text-center">
          <p className="text-lg font-semibold text-primary">
            Save <span className="text-secondary">$9,000</span> on a $400k home sale compared to traditional realtors
          </p>
        </div>
      </div>
    </div>
  );
}
