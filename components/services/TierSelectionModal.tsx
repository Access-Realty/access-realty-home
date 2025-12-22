// ABOUTME: Modal component for selecting service tier before checkout
// ABOUTME: Displays all 3 tiers with full feature comparison table

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { HiXMark, HiCheck } from "react-icons/hi2";
import { EmbeddedCheckoutModal } from "../checkout/EmbeddedCheckoutModal";

// Tier configuration
const TIERS = [
  {
    id: "direct-list",
    code: "direct_list",
    name: "DirectList",
    totalPrice: "$2,995",
    upfrontPrice: "$495 upfront",
    badge: null,
  },
  {
    id: "direct-list-plus",
    code: "direct_list_plus",
    name: "DirectList+",
    totalPrice: "$4,495",
    upfrontPrice: "$995 upfront",
    badge: "BEST VALUE",
  },
  {
    id: "full-service",
    code: "full_service",
    name: "Full Service",
    totalPrice: "3%",
    upfrontPrice: "No upfront payment",
    badge: null,
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

// Styled tier name component
function TierName({ name, inherit = false }: { name: string; inherit?: boolean }) {
  // When inherit=true, text color comes from parent (for buttons)
  // When inherit=false (default), use explicit dark color for visibility on light backgrounds
  const textColor = inherit ? "inherit" : "#1f2937"; // gray-800 for readability

  const italicStyle: React.CSSProperties = {
    fontFamily: "'Times New Roman', serif",
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: "1.05em",
    color: textColor,
  };
  const boldStyle: React.CSSProperties = {
    fontFamily: "var(--font-be-vietnam-pro), 'Be Vietnam Pro', sans-serif",
    fontWeight: 700,
    color: textColor,
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
  return <span style={{ color: textColor }}>{name}</span>;
}

// Render cell value
function CellValue({ value }: { value: string | boolean | undefined }) {
  if (value === undefined || value === false) {
    return <span className="text-muted-foreground">—</span>;
  }
  if (value === true) {
    return <HiCheck className="h-4 w-4 text-green-600 mx-auto" />;
  }
  return <span className="text-xs text-foreground">{value}</span>;
}

// UTM helpers
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function getUTMParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utmData: Record<string, string> = {};
  for (const param of UTM_PARAMS) {
    const value = params.get(param);
    if (value) utmData[param] = value;
  }
  return utmData;
}

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: string;
  source?: string;
}

export function TierSelectionModal({
  isOpen,
  onClose,
  source = "direct-list-page",
}: TierSelectionModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !showCheckout) onClose();
    },
    [isOpen, showCheckout, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSelectTier = (tierId: string) => {
    const tier = TIERS.find((t) => t.id === tierId);
    if (tier) {
      setSelectedTier(tier);
      setShowCheckout(true);
      setError(null);
    }
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedTier(null);
  };

  const handleCheckoutError = (errorMsg: string) => {
    setError(errorMsg);
    setShowCheckout(false);
    setSelectedTier(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-center z-10 relative">
          <h2 className="text-xl font-bold text-foreground">Select Your Service</h2>
          <button
            onClick={onClose}
            className="absolute right-4 p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Close modal"
          >
            <HiXMark className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* All Plans Include Section */}
          <div className="bg-primary/5 border border-primary/50 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-sm mb-3 text-center text-primary">All Plans Include</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {BASE_FEATURES.map((feature, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <HiCheck className="h-3.5 w-3.5 text-green-600 shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Tier Headers - Desktop */}
          <div className="hidden md:grid grid-cols-4 gap-2 mb-1">
            <div className="flex items-center justify-center p-2">
              <Image
                src="/access-realty-logo.png"
                alt="Access Realty"
                width={120}
                height={67}
                className="object-contain opacity-80"
              />
            </div>
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative text-center p-3 rounded-t-lg border border-b-0 ${
                  tier.id === "full-service"
                    ? "border-primary bg-primary/10"
                    : tier.id === "direct-list-plus"
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
                  <h3 className="font-semibold text-sm mb-1">
                    <TierName name={tier.name} />
                  </h3>
                  <div className="text-lg font-bold text-primary">{tier.totalPrice}</div>
                  <div className="text-xs text-muted-foreground">{tier.upfrontPrice}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table - Desktop */}
          <div className="hidden md:block border border-border rounded-lg overflow-hidden mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-2 font-semibold border-r w-1/4">What&apos;s Different</th>
                  {TIERS.map((tier, idx) => (
                    <th
                      key={tier.id}
                      className={`p-2 font-semibold text-center w-1/4 ${
                        idx < TIERS.length - 1 ? "border-r" : ""
                      } ${
                        tier.id === "direct-list-plus"
                          ? "bg-primary/5"
                          : tier.id === "full-service"
                          ? "bg-primary/10"
                          : ""
                      }`}
                    >
                      <TierName name={tier.name} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="p-2 text-muted-foreground border-r">{row.feature}</td>
                    {TIERS.map((tier, tierIdx) => (
                      <td
                        key={tier.id}
                        className={`p-2 text-center ${tierIdx < TIERS.length - 1 ? "border-r" : ""} ${
                          tier.id === "direct-list-plus"
                            ? "bg-primary/5"
                            : tier.id === "full-service"
                            ? "bg-primary/10"
                            : ""
                        }`}
                      >
                        <CellValue value={row.values[tier.code]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Select Buttons - Desktop */}
          <div className="hidden md:grid grid-cols-4 gap-2 mb-2">
            <div /> {/* Empty corner */}
            {TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => handleSelectTier(tier.id)}
                className="py-2 px-4 rounded-lg text-sm font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary-dark"
              >
                Select <TierName name={tier.name} inherit />
              </button>
            ))}
          </div>

          {/* Mobile Layout - Stacked Cards */}
          <div className="md:hidden space-y-4">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-lg border-2 overflow-hidden ${
                  tier.id === "full-service"
                    ? "border-primary bg-primary/10"
                    : tier.id === "direct-list-plus"
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        <TierName name={tier.name} />
                      </h3>
                      {tier.badge && (
                        <span className="inline-block mt-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{tier.totalPrice}</div>
                      <div className="text-xs text-muted-foreground">{tier.upfrontPrice}</div>
                    </div>
                  </div>
                </div>

                {/* Card Features */}
                <div className="p-4 space-y-2">
                  {COMPARISON_ROWS.map((row, idx) => {
                    const value = row.values[tier.code];
                    if (value === false) return null;
                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-1 border-b border-border/30 last:border-0 text-sm"
                      >
                        <span className="text-muted-foreground">{row.feature}</span>
                        <span className="font-medium text-foreground">
                          {value === true ? (
                            <HiCheck className="h-4 w-4 text-green-600" />
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
                  <button
                    onClick={() => handleSelectTier(tier.id)}
                    className="block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary-dark"
                  >
                    Select <TierName name={tier.name} inherit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Checkout Modal */}
      {selectedTier && (
        <EmbeddedCheckoutModal
          isOpen={showCheckout}
          onClose={handleCloseCheckout}
          plan={selectedTier.id}
          planName={selectedTier.name}
          source={source}
          utmParams={getUTMParams()}
          onError={handleCheckoutError}
        />
      )}
    </div>
  );
}
