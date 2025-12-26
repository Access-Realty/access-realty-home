// ABOUTME: Services page with pricing comparison table
// ABOUTME: Displays Direct List, Direct List+, and Full Service tiers

import { HiCheck } from "react-icons/hi2";
import { PlanSelectButton } from "@/components/services/PlanSelectButton";

// Service tier definitions with pricing
const SERVICE_TIERS = [
  {
    id: "direct_list",
    name: "DirectList",
    totalPrice: "$2,995",
    upfrontPrice: "$495",
    badge: null,
    ctaUrl: "https://app.access.realty/signup?plan=direct-list",
  },
  {
    id: "direct_list_plus",
    name: "DirectList+",
    totalPrice: "$4,495",
    upfrontPrice: "$995",
    badge: "BEST VALUE",
    ctaUrl: "https://app.access.realty/signup?plan=direct-list-plus",
  },
  {
    id: "full_service",
    name: "Full Service",
    totalPrice: "3%",
    upfrontPrice: null,
    badge: "MOST POPULAR",
    ctaUrl: "https://app.access.realty/signup?plan=full-service",
  },
];

// Base features included in all plans
const BASE_FEATURES = [
  "MLS + Syndication",
  "Professional Photography",
  "Guided Pricing Strategy",
  "Pre-Listing Consultation",
  "Digital Document Signing",
  "Lockbox & Yard Sign",
  "Showings by ShowingTime",
  "Zillow/Homes Traffic",
];

// Comparison table rows - each row shows how the feature differs across tiers
// Values: string for text, true for checkmark, false for dash
const COMPARISON_ROWS: {
  feature: string;
  values: Record<string, string | boolean>;
}[] = [
  {
    feature: "On-Site Evaluation",
    values: { direct_list: "$199", direct_list_plus: "$199", full_service: true },
  },
  {
    feature: "Market Assessment",
    values: {
      direct_list: "Monthly Video",
      direct_list_plus: "Bi-Weekly Video",
      full_service: "Weekly Meeting",
    },
  },
  {
    feature: "On Market Consultation",
    values: { direct_list: "$99", direct_list_plus: "$99", full_service: true },
  },
  {
    feature: "Feedback Requests",
    values: { direct_list: false, direct_list_plus: true, full_service: true },
  },
  {
    feature: "Listing Description",
    values: {
      direct_list: "Self-Written",
      direct_list_plus: true,
      full_service: true,
    },
  },
  {
    feature: "Virtual Walkthrough",
    values: { direct_list: "$99", direct_list_plus: true, full_service: true },
  },
  {
    feature: "Floor Plan",
    values: { direct_list: "$49", direct_list_plus: true, full_service: true },
  },
  {
    feature: "Aerial Photography",
    values: { direct_list: "$99", direct_list_plus: true, full_service: true },
  },
  {
    feature: "Amenities Photography",
    values: { direct_list: "$40", direct_list_plus: true, full_service: true },
  },
  {
    feature: "Virtual Staging",
    values: {
      direct_list: "$99",
      direct_list_plus: "3 photos",
      full_service: "Whole House/Yard",
    },
  },
  {
    feature: "Premium Analytics",
    values: { direct_list: false, direct_list_plus: true, full_service: true },
  },
  {
    feature: "Mega Open House",
    values: {
      direct_list: "$99",
      direct_list_plus: "1 Included",
      full_service: "1 Included",
    },
  },
  {
    feature: "Contract Negotiation",
    values: {
      direct_list: "$249",
      direct_list_plus: "1 Free, then $149",
      full_service: "Every Offer",
    },
  },
  {
    feature: "Amendment Negotiation",
    values: {
      direct_list: "$249",
      direct_list_plus: "1 Free, then $149",
      full_service: "Every Offer",
    },
  },
  {
    feature: "Leaseback Package",
    values: {
      direct_list: "$499",
      direct_list_plus: "$299",
      full_service: "If needed",
    },
  },
  {
    feature: "Repairs Management",
    values: {
      direct_list: "Self-Managed",
      direct_list_plus: "Self-Managed",
      full_service: true,
    },
  },
  {
    feature: "Preferred Vendors",
    values: { direct_list: false, direct_list_plus: false, full_service: true },
  },
  {
    feature: "Transaction Coord.",
    values: {
      direct_list: "Self-Guided",
      direct_list_plus: "Self-Guided",
      full_service: "Hands-off",
    },
  },
];

// Render styled tier name using brand logo fonts
// "Direct" / "Full" in Times New Roman Italic, "List" / "Service" in Be Vietnam Pro Bold
function StyledTierName({ name }: { name: string }) {
  const italicStyle: React.CSSProperties = {
    fontFamily: "'Times New Roman', serif",
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: "1.05em",
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

// Render cell value with consistent styling
function CellValue({ value }: { value: string | boolean | undefined }) {
  if (value === undefined || value === false) {
    return <span className="text-muted-foreground">—</span>;
  }
  if (value === true) {
    return <HiCheck className="h-4 w-4 text-success mx-auto" />;
  }
  return <span className="text-xs">{value}</span>;
}

export default function Services() {
  return (
    <div className="pt-24 pb-12 bg-card">
        <div className="max-w-5xl mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Choose Your Level of Service
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              From DIY listing tools to full-service representation, we have the
              right solution for your home sale.
            </p>
          </div>

          {/* All Plans Include Section - Desktop (Above Table) */}
          <div className="hidden md:block bg-primary/10 border border-primary/30 rounded-lg p-5 mb-6">
            <h4 className="font-bold text-base mb-4 text-center text-primary">
              All Plans Include
            </h4>
            <div className="grid grid-cols-4 gap-3 text-sm">
              {BASE_FEATURES.map((feature, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <HiCheck className="h-4 w-4 text-success shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Tier Headers with Pricing - Desktop Only */}
          <div className="hidden md:grid grid-cols-4 gap-2 mb-1">
            <div /> {/* Empty corner cell */}
            {SERVICE_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative text-center p-3 rounded-t-lg border border-b-0 ${
                  tier.id === "full_service"
                    ? "border-primary bg-primary/10"
                    : tier.id === "direct_list_plus"
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <div className={tier.badge ? "pt-1" : ""}>
                  <h3 className="font-semibold text-base mb-1">
                    <StyledTierName name={tier.name} />
                  </h3>
                  <div className="text-xl font-bold text-primary">
                    {tier.totalPrice}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tier.upfrontPrice
                      ? `${tier.upfrontPrice} upfront`
                      : "No upfront payment"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table - Desktop */}
          <div className="hidden md:block border border-border rounded-lg overflow-hidden mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-2 font-semibold border-r w-1/4">
                    What&apos;s Different
                  </th>
                  {SERVICE_TIERS.map((tier, idx) => (
                    <th
                      key={tier.id}
                      className={`p-2 font-semibold text-center w-1/4 ${
                        idx < SERVICE_TIERS.length - 1 ? "border-r" : ""
                      } ${
                        tier.id === "direct_list_plus"
                          ? "bg-primary/5"
                          : tier.id === "full_service"
                          ? "bg-primary/10"
                          : ""
                      }`}
                    >
                      <StyledTierName name={tier.name} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}
                  >
                    <td className="p-2 text-muted-foreground border-r">
                      {row.feature}
                    </td>
                    {SERVICE_TIERS.map((tier, tierIdx) => (
                      <td
                        key={tier.id}
                        className={`p-2 text-center ${
                          tierIdx < SERVICE_TIERS.length - 1 ? "border-r" : ""
                        } ${
                          tier.id === "direct_list_plus"
                            ? "bg-primary/5"
                            : tier.id === "full_service"
                            ? "bg-primary/10"
                            : ""
                        }`}
                      >
                        <CellValue value={row.values[tier.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Select Buttons - Desktop */}
          <div className="hidden md:grid grid-cols-4 gap-2 mb-6">
            <div /> {/* Empty corner cell */}
            {SERVICE_TIERS.map((tier) => (
              <PlanSelectButton
                key={tier.id}
                planId={tier.id.replace(/_/g, "-")}
                className="text-center py-2 px-4 rounded-lg text-sm font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary-dark"
              >
                Select <StyledTierName name={tier.name} />
              </PlanSelectButton>
            ))}
          </div>

          {/* Mobile Layout - Stacked Cards */}
          <div className="md:hidden space-y-6">
            {/* All Plans Include - Mobile */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold text-center mb-3">
                All Plans Include
              </h4>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {BASE_FEATURES.map((feature, idx) => (
                  <span key={idx} className="flex items-center gap-1">
                    <HiCheck className="h-3 w-3 text-success" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Tier Cards - Mobile */}
            {SERVICE_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-lg border-2 overflow-hidden ${
                  tier.id === "full_service"
                    ? "border-primary bg-primary/10"
                    : tier.id === "direct_list_plus"
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">
                        <StyledTierName name={tier.name} />
                      </h3>
                      {tier.badge && (
                        <span className="inline-block mt-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {tier.totalPrice}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tier.upfrontPrice
                          ? `${tier.upfrontPrice} upfront`
                          : "No upfront"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Features */}
                <div className="p-4 space-y-2">
                  {COMPARISON_ROWS.map((row, idx) => {
                    const value = row.values[tier.id];
                    // Skip rows where value is false (not available)
                    if (value === false) return null;
                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-1 border-b border-border/30 last:border-0 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {row.feature}
                        </span>
                        <span className="font-medium">
                          {value === true ? (
                            <HiCheck className="h-4 w-4 text-success" />
                          ) : (
                            value
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Card CTA */}
                <div className="p-4 pt-0">
                  <PlanSelectButton
                    planId={tier.id.replace(/_/g, "-")}
                    className="block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary-dark"
                  >
                    Select <StyledTierName name={tier.name} />
                  </PlanSelectButton>
                </div>
              </div>
            ))}
          </div>

        </div>
    </div>
  );
}
