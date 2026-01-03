// ABOUTME: Modal component for selecting service tier before checkout
// ABOUTME: Displays all 3 tiers with full feature comparison table

"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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

// Property specs from get-started flow
interface PropertySpecs {
  bedrooms?: string;
  fullBathrooms?: string;
  halfBathrooms?: string;
  yearBuilt?: string;
  squareFeet?: string;
}

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: string;
  source?: string;
  leadId?: string;
  propertySpecs?: PropertySpecs;
}

// Generate terms of service with tier-specific values
function generateTermsOfService(tier: typeof TIERS[0]) {
  // Calculate remaining balance (total minus upfront)
  const getRemainingBalance = () => {
    if (tier.id === "direct-list") return "$2,500";
    if (tier.id === "direct-list-plus") return "$3,500";
    return "3% of sale price"; // Full service
  };

  return {
    title: "Terms of Service",
    sections: [
      {
        number: 1,
        heading: "Service Description",
        content: `Access Realty will provide ${tier.name} real estate listing services including MLS access, professional photography, and additional services for a total fee of ${tier.totalPrice} with ${tier.upfrontPrice} due upfront.`,
      },
      {
        number: 2,
        heading: "Payment Terms",
        content: `The upfront payment of ${tier.upfrontPrice} is due immediately upon agreement and is processed in real-time. The remaining balance of ${getRemainingBalance()} will be collected from sale proceeds at closing through the title company.`,
      },
      {
        number: 3,
        heading: "Payment Authorization",
        content: `By providing your payment method, you authorize Access Realty to: charge the initial payment immediately, store your payment method securely through Stripe for future authorized charges, process charges for add-on services you request at then-current prices, and process charges for equipment non-return fees or cancellation fees as specified below.`,
      },
      {
        number: 4,
        heading: "Add-On Services",
        content: `You authorize charges for any add-on services you request. Add-on pricing is subject to change; final pricing is displayed in the platform at the time of request.`,
      },
      {
        number: 5,
        heading: "Inaccessible Property Fee",
        content: `A $50 trip charge will be assessed if the property is not accessible or not ready when the photographer arrives for a scheduled appointment. This fee covers the photographer's time, travel, and scheduling costs for the missed appointment.`,
      },
      {
        number: 6,
        heading: "Equipment Fees",
        content: `Access Realty provides an electronic lockbox during the listing period. You agree to return the lockbox in good working condition within 10 business days of listing expiration, sale closing, or listing withdrawal. Lockbox non-return fee: $95.00.`,
      },
      {
        number: 7,
        heading: "Seller's Authority & Title",
        content: `By entering this agreement, you represent and warrant that: you are the legal owner of the property or have been duly authorized to act on behalf of all owners; you have the legal right and authority to list and sell the property; and there are no unresolved legal matters that would prevent the conveyance of clear and marketable title. No refunds will be issued if the transaction fails to close due to: inability to deliver clear and marketable title; unresolved liens, judgments, tax delinquencies, or encumbrances; pending or unresolved divorce proceedings affecting property ownership; incomplete probate or estate administration; lack of required signatures from co-owners, heirs, spouses, or other parties with ownership interest; disputes over property boundaries, easements, or access rights; or any other title defect discovered during the transaction. You are solely responsible for resolving any title issues at your own expense prior to closing. All services rendered by Access Realty remain billable regardless of whether the transaction closes.`,
      },
      {
        number: 8,
        heading: "Cancellation",
        content: `A cancellation fee of $395 applies if you withdraw your listing to cover administrative costs, MLS fees, photography, and marketing expenses already incurred.`,
      },
      {
        number: 9,
        heading: "Refund Policy",
        content: `The initial payment is non-refundable. Any billing disputes must be reported in writing within 14 days of the charge date.`,
      },
      {
        number: 10,
        heading: "Liability",
        content: `Access Realty's liability is limited to the amount of fees paid. We are not responsible for market conditions, buyer behavior, or factors outside our control.`,
      },
      {
        number: 11,
        heading: "Duration",
        content: `This agreement remains in effect until services are fully delivered and any outstanding balances are settled.`,
      },
      {
        number: 12,
        heading: "Governing Law",
        content: `This agreement shall be governed by the laws of the State of Texas. Any disputes shall first be submitted to mediation before litigation. Any legal action shall be brought exclusively in courts located in Tarrant County, Texas.`,
      },
    ],
  };
}

export function TierSelectionModal({
  isOpen,
  onClose,
  initialTier,
  source = "direct-list-page",
  leadId,
  propertySpecs,
}: TierSelectionModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // When modal opens with initialTier, skip tier selection and go directly to terms
  useEffect(() => {
    if (isOpen && initialTier) {
      const tier = TIERS.find((t) => t.id === initialTier);
      if (tier) {
        setSelectedTier(tier);
        setShowTerms(true);
        setTermsAccepted(false);
        setError(null);
      }
    }
  }, [isOpen, initialTier]);

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
      setShowTerms(true);
      setTermsAccepted(false);
      setError(null);
    }
  };

  const handleAcceptTerms = () => {
    if (termsAccepted) {
      setShowTerms(false);
      setShowCheckout(true);
    }
  };

  const handleCloseTerms = () => {
    setShowTerms(false);
    setSelectedTier(null);
    setTermsAccepted(false);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedTier(null);
    setTermsAccepted(false);
  };

  const handleCheckoutError = (errorMsg: string) => {
    setError(errorMsg);
    setShowCheckout(false);
    setSelectedTier(null);
    setTermsAccepted(false);
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
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {tier.id === "full-service" ? "Pay at closing" : "Starting from"}
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {tier.id === "full-service" ? tier.totalPrice : tier.upfrontPrice.replace(" upfront", "")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tier.id === "full-service" ? "No upfront payment" : `${tier.totalPrice} total`}
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
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        {tier.id === "full-service" ? "Pay at closing" : "Starting from"}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {tier.id === "full-service" ? tier.totalPrice : tier.upfrontPrice.replace(" upfront", "")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tier.id === "full-service" ? "No upfront payment" : `${tier.totalPrice} total`}
                      </div>
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

      {/* Terms Acceptance Modal - rendered via portal to escape stacking context */}
      {selectedTier && showTerms && typeof document !== "undefined" && (() => {
        const terms = generateTermsOfService(selectedTier);
        return createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseTerms} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h2 id="terms-title" className="text-lg font-semibold text-gray-900">
                    {terms.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    <TierName name={selectedTier.name} /> - {selectedTier.totalPrice}
                  </p>
                </div>
                <button
                  onClick={handleCloseTerms}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <HiXMark className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Terms Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                {terms.sections.map((section) => (
                  <div key={section.number}>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {section.number}. {section.heading}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Footer with Checkbox and Button */}
              <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and agree to the Terms of Service
                  </span>
                </label>
                <button
                  onClick={handleAcceptTerms}
                  disabled={!termsAccepted}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    termsAccepted
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}

      {/* Embedded Checkout Modal */}
      {selectedTier && showCheckout && (
        <EmbeddedCheckoutModal
          isOpen={showCheckout}
          onClose={handleCloseCheckout}
          plan={selectedTier.id}
          planName={selectedTier.name}
          source={source}
          utmParams={getUTMParams()}
          onError={handleCheckoutError}
          leadId={leadId}
          propertySpecs={propertySpecs}
        />
      )}
    </div>
  );
}
