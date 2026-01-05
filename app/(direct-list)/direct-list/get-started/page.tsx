// ABOUTME: Get Started wizard page for DirectList onboarding
// ABOUTME: Multi-step flow: Address → Property Specs → Contact → Service Selection

"use client";

// Calendly global type
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

import { useState, useCallback, useEffect } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { AddressInput, AddressData } from "@/components/direct-list/AddressInput";
import { lookupProperty, PropertySpecs } from "@/lib/propertyLookup";
import { EmbeddedCheckoutModal } from "@/components/checkout/EmbeddedCheckoutModal";
import { HeroSection, Section } from "@/components/layout";
import {
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlinePhone,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlinePencil,
  HiCheck,
} from "react-icons/hi2";

// Define libraries outside component to prevent re-renders
const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "250px",
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

// Default center (DFW)
const defaultCenter = { lat: 32.7767, lng: -96.797 };

type Step = "address" | "confirm" | "contact" | "service";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const initialContactForm: ContactForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

// Editable property specs
interface EditableSpecs {
  propertyType: string;
  bedrooms: string;
  fullBathrooms: string;
  halfBathrooms: string;
  yearBuilt: string;
  squareFeet: string;
}

const initialEditableSpecs: EditableSpecs = {
  propertyType: "",
  bedrooms: "",
  fullBathrooms: "",
  halfBathrooms: "",
  yearBuilt: "",
  squareFeet: "",
};

// Tracking parameters captured from URL
interface TrackingParams {
  landingUrl: string;
  gclid?: string;
  fbclid?: string;
  fbAdId?: string;
  fbAdsetId?: string;
  fbCampaignId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

// Tier configuration for inline selection
const TIERS = [
  {
    id: "direct-list",
    code: "direct_list",
    name: "DirectList",
    totalPrice: "$2,995",
    upfrontPrice: "$495",
    badge: null,
  },
  {
    id: "direct-list-plus",
    code: "direct_list_plus",
    name: "DirectList+",
    totalPrice: "$4,495",
    upfrontPrice: "$995",
    badge: "BEST VALUE",
  },
  {
    id: "full-service",
    code: "full_service",
    name: "Full Service",
    totalPrice: "3%",
    upfrontPrice: null,
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

// Full comparison table rows - matches modal
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
    values: { direct_list: "Monthly Video", direct_list_plus: "Bi-Weekly Video", full_service: "Weekly Meeting" },
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
    values: { direct_list: "Self-Written", direct_list_plus: true, full_service: true },
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
    values: { direct_list: "$99", direct_list_plus: "3 photos", full_service: "Whole House/Yard" },
  },
  {
    feature: "Premium Analytics",
    values: { direct_list: false, direct_list_plus: true, full_service: true },
  },
  {
    feature: "Mega Open House",
    values: { direct_list: "$99", direct_list_plus: "1 Included", full_service: "1 Included" },
  },
  {
    feature: "Contract Negotiation",
    values: { direct_list: "$249", direct_list_plus: "1 Free, then $149", full_service: "Every Offer" },
  },
  {
    feature: "Amendment Negotiation",
    values: { direct_list: "$249", direct_list_plus: "1 Free, then $149", full_service: "Every Offer" },
  },
  {
    feature: "Leaseback Package",
    values: { direct_list: "$499", direct_list_plus: "$299", full_service: "If needed" },
  },
  {
    feature: "Repairs Management",
    values: { direct_list: "Self-Managed", direct_list_plus: "Self-Managed", full_service: true },
  },
  {
    feature: "Preferred Vendors",
    values: { direct_list: false, direct_list_plus: false, full_service: true },
  },
  {
    feature: "Transaction Coord.",
    values: { direct_list: "Self-Guided", direct_list_plus: "Self-Guided", full_service: "Hands-off" },
  },
];

// Generate terms of service content for selected tier
function generateTermsContent(tier: typeof TIERS[0]) {
  const isFullService = tier.id === "full-service";
  const paymentTerms = isFullService
    ? "3% of the final sale price, due at closing. No upfront payment required."
    : `${tier.upfrontPrice} due at signup. Remaining balance of ${tier.totalPrice} total due at closing.`;

  return {
    title: `${tier.name} Terms of Service`,
    sections: [
      {
        heading: "Service Agreement",
        content: `By selecting ${tier.name}, you agree to engage Access Realty to provide listing services for your property. This agreement becomes effective upon payment completion.`,
      },
      {
        heading: "Payment Terms",
        content: paymentTerms,
      },
      {
        heading: "Listing Period",
        content: "Your MLS listing will remain active for up to 12 months from the activation date. You may cancel at any time, though upfront fees are non-refundable.",
      },
      {
        heading: "Service Inclusions",
        content: isFullService
          ? "Full Service includes complete agent representation, negotiations on all offers, repairs management, transaction coordination, and all marketing services."
          : `${tier.name} includes MLS listing, professional photography, and the features outlined in your selected package. Additional services are available on demand.`,
      },
      {
        heading: "Cancellation Policy",
        content: "You may cancel your listing at any time by providing written notice. Upfront fees are non-refundable. Services rendered prior to cancellation are final.",
      },
    ],
  };
}

// Cell value renderer
function CellValue({ value }: { value: string | boolean | undefined }) {
  if (value === undefined || value === false) {
    return <span className="text-muted-foreground">—</span>;
  }
  if (value === true) {
    return <HiCheck className="h-4 w-4 text-green-600 mx-auto" />;
  }
  return <span className="text-xs text-foreground">{value}</span>;
}

// Styled tier name component
function TierName({ name, inherit = false }: { name: string; inherit?: boolean }) {
  const textColor = inherit ? "inherit" : "#1f2937";
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

// Editable address fields (for user corrections)
interface EditableAddress {
  street: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
}

const initialEditableAddress: EditableAddress = {
  street: "",
  unit: "",
  city: "",
  state: "",
  zipCode: "",
};

export default function GetStartedPage() {
  const [step, setStep] = useState<Step>("address");
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [editableAddress, setEditableAddress] = useState<EditableAddress>(initialEditableAddress);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [propertySpecs, setPropertySpecs] = useState<PropertySpecs | null>(null);
  const [editableSpecs, setEditableSpecs] = useState<EditableSpecs>(initialEditableSpecs);
  const [specsLoading, setSpecsLoading] = useState(false);
  const [specsError, setSpecsError] = useState<string | null>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactForm>(initialContactForm);
  const [contactErrors, setContactErrors] = useState<Partial<ContactForm>>({});
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitError, setContactSubmitError] = useState<string | null>(null);

  // Service selection state
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  // Tracking params captured on mount
  const [trackingParams, setTrackingParams] = useState<TrackingParams>({
    landingUrl: "",
  });

  // Capture tracking params from URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    setTrackingParams({
      landingUrl: window.location.href,
      // Google Ads
      gclid: params.get("gclid") || undefined,
      // Facebook Ads
      fbclid: params.get("fbclid") || undefined,
      fbAdId: params.get("fb_ad_id") || undefined,
      fbAdsetId: params.get("fb_adset_id") || undefined,
      fbCampaignId: params.get("fb_campaign_id") || undefined,
      // UTM parameters
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      utmTerm: params.get("utm_term") || undefined,
      utmContent: params.get("utm_content") || undefined,
    });
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Open Calendly popup (loads script if needed)
  const openCalendlyPopup = useCallback(() => {
    const url = "https://calendly.com/access-inquiries/sales-call";

    // If Calendly is already loaded, open popup
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
      return;
    }

    // Load Calendly script dynamically
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url });
      }
    };
    document.head.appendChild(script);

    // Also load Calendly CSS
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Handle address selection from Google Places (no BatchData call yet)
  const handleAddressSelect = useCallback((data: AddressData) => {
    setAddressData(data);
    setMapCenter({ lat: data.lat, lng: data.lng });
    setShowAddressEdit(false); // Reset edit mode on new selection

    // Populate editable address fields from Google Places data
    const street = [data.streetNumber, data.streetName].filter(Boolean).join(" ");
    setEditableAddress({
      street: street,
      unit: "",
      city: data.city || "",
      state: data.state || "",
      zipCode: data.zipCode || "",
    });

    // Reset property specs (will be fetched when user confirms address)
    setPropertySpecs(null);
    setEditableSpecs(initialEditableSpecs);
    setSpecsError(null);
  }, []);

  // Lookup property data after user confirms address
  const lookupPropertyData = useCallback(async () => {
    // Build final address from editable fields
    const unitPart = editableAddress.unit.trim() ? ` ${editableAddress.unit.trim()}` : "";
    const fullAddress = `${editableAddress.street}${unitPart}, ${editableAddress.city}, ${editableAddress.state} ${editableAddress.zipCode}`;

    setSpecsLoading(true);
    setSpecsError(null);

    try {
      const specs = await lookupProperty(fullAddress);
      setPropertySpecs(specs);
      if (specs) {
        // Initialize editable specs from fetched data
        setEditableSpecs({
          propertyType: specs.propertyTypeLabel ?? "Single Family Home",
          bedrooms: specs.bedrooms?.toString() ?? "",
          fullBathrooms: specs.fullBathrooms?.toString() ?? "",
          halfBathrooms: specs.halfBathrooms?.toString() ?? "",
          yearBuilt: specs.yearBuilt?.toString() ?? "",
          squareFeet: specs.squareFeet?.toString() ?? "",
        });
      } else {
        setSpecsError("Property data not found. You can still continue.");
      }
      // Move to confirm step
      setStep("confirm");
    } catch (error) {
      console.error("Property lookup failed:", error);
      setSpecsError("Could not load property data. You can still continue.");
      // Still move to confirm step even if lookup fails
      setStep("confirm");
    } finally {
      setSpecsLoading(false);
    }
  }, [editableAddress]);

  const handleContinue = () => {
    if (step === "address" && addressData) {
      // Trigger property lookup and move to confirm step
      lookupPropertyData();
    } else if (step === "confirm") {
      setStep("contact");
    }
  };

  // Handle editable specs changes
  const handleSpecsChange = (field: keyof EditableSpecs, value: string, numericOnly = true) => {
    const processedValue = numericOnly ? value.replace(/\D/g, "") : value;
    setEditableSpecs((prev) => ({ ...prev, [field]: processedValue }));
  };

  // Format phone number as user types
  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, "");
    // Strip leading "1" country code if autofill included it
    if (digits.length === 11 && digits.startsWith("1")) {
      digits = digits.slice(1);
    }
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleContactChange = (field: keyof ContactForm, value: string) => {
    const formattedValue = field === "phone" ? formatPhone(value) : value;
    setContactForm((prev) => ({ ...prev, [field]: formattedValue }));
    // Clear error when user starts typing
    if (contactErrors[field]) {
      setContactErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateContact = (): boolean => {
    const errors: Partial<ContactForm> = {};

    if (!contactForm.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!contactForm.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!contactForm.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (contactForm.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Please enter a valid phone number";
    }

    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async () => {
    if (!validateContact()) return;

    setContactSubmitting(true);
    setContactSubmitError(null);

    try {
      // Build street address from components
      const street = addressData
        ? [addressData.streetNumber, addressData.streetName].filter(Boolean).join(" ")
        : undefined;

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Contact info
          firstName: contactForm.firstName.trim(),
          lastName: contactForm.lastName.trim(),
          email: contactForm.email.trim().toLowerCase(),
          phone: contactForm.phone.replace(/\D/g, ""),

          // Address components (parsed from Google Places)
          street: street || undefined,
          city: addressData?.city || undefined,
          state: addressData?.state || undefined,
          zip: addressData?.zipCode || undefined,

          // Property FK (from parcel lookup)
          parcelId: propertySpecs?.parcelId || undefined,

          // Source - determine based on UTM or default
          source: trackingParams.utmSource === "google" ? "paid_search"
            : trackingParams.utmSource === "facebook" ? "social_media"
            : trackingParams.gclid ? "paid_search"
            : trackingParams.fbclid ? "social_media"
            : "website",

          // Landing URL
          landingUrl: trackingParams.landingUrl || undefined,

          // Google tracking
          gclid: trackingParams.gclid,

          // Facebook tracking
          fbclid: trackingParams.fbclid,
          fbAdId: trackingParams.fbAdId,
          fbAdsetId: trackingParams.fbAdsetId,
          fbCampaignId: trackingParams.fbCampaignId,

          // UTM parameters
          utmSource: trackingParams.utmSource,
          utmMedium: trackingParams.utmMedium,
          utmCampaign: trackingParams.utmCampaign,
          utmTerm: trackingParams.utmTerm,
          utmContent: trackingParams.utmContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save contact info");
      }

      // Store leadId for checkout flow
      if (data.leadId) {
        setLeadId(data.leadId);
      }

      // Move to service tier selection step
      setStep("service");
    } catch (error) {
      console.error("Contact submit error:", error);
      setContactSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HeroSection maxWidth="4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          List Your Home on the MLS
        </h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Get started in minutes. Save thousands compared to traditional agents.
        </p>
      </HeroSection>

      {/* Main Content */}
      <Section variant="content" maxWidth="4xl">
          {/* Step 1: Address */}
          {step === "address" && (
            <div className="space-y-8">
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Where is your property?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Enter your property address to get started with your MLS listing.
                </p>

                <AddressInput
                  onAddressSelect={handleAddressSelect}
                  placeholder="Enter your property address"
                  defaultValue={addressData?.formattedAddress}
                  className="mb-6"
                />

                {/* Map Preview */}
                {addressData && isLoaded && (
                  <div className="rounded-lg overflow-hidden border border-border mb-6">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={16}
                      options={mapOptions}
                    >
                      <Marker position={mapCenter} />
                    </GoogleMap>
                  </div>
                )}

                {/* Address Confirmation - shown after autocomplete selection */}
                {addressData && (
                  <div className="space-y-4 mb-6">
                    {/* Display selected address */}
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Is this address correct?</p>
                      <p className="font-semibold text-foreground">
                        {editableAddress.street}
                        {editableAddress.unit && ` ${editableAddress.unit}`}
                        {editableAddress.city && `, ${editableAddress.city}`}
                        {editableAddress.state && `, ${editableAddress.state}`}
                        {editableAddress.zipCode && ` ${editableAddress.zipCode}`}
                      </p>
                    </div>

                    {/* Editable fields - shown when Edit is clicked */}
                    {showAddressEdit && (
                      <div className="space-y-4 border border-border rounded-lg p-4">
                        {/* Street Address */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={editableAddress.street}
                            onChange={(e) => setEditableAddress(prev => ({ ...prev, street: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        {/* Unit Number */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">
                            Unit Number <span className="text-muted-foreground font-normal">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={editableAddress.unit}
                            onChange={(e) => setEditableAddress(prev => ({ ...prev, unit: e.target.value }))}
                            placeholder="e.g., Unit 204, Apt 3B"
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        {/* City, State, ZIP in a row */}
                        <div className="grid grid-cols-6 gap-3">
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                              City
                            </label>
                            <input
                              type="text"
                              value={editableAddress.city}
                              onChange={(e) => setEditableAddress(prev => ({ ...prev, city: e.target.value }))}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                              State
                            </label>
                            <input
                              type="text"
                              value={editableAddress.state}
                              onChange={(e) => setEditableAddress(prev => ({ ...prev, state: e.target.value }))}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              value={editableAddress.zipCode}
                              onChange={(e) => setEditableAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      {!showAddressEdit ? (
                        <>
                          <button
                            onClick={() => setShowAddressEdit(true)}
                            className="flex-1 py-2.5 px-4 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors"
                          >
                            Edit Address
                          </button>
                          <button
                            onClick={handleContinue}
                            disabled={specsLoading}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            {specsLoading ? "Looking up..." : "Continue"}
                            {!specsLoading && <HiOutlineArrowRight className="h-4 w-4" />}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleContinue}
                          disabled={specsLoading || !editableAddress.street || !editableAddress.city}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {specsLoading ? "Looking up..." : "Continue"}
                          {!specsLoading && <HiOutlineArrowRight className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Confirm Details */}
          {step === "confirm" && (
            <div className="bg-card rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Here&apos;s What We Found
              </h2>
              <p className="text-muted-foreground mb-6">
                We pulled this from county tax records, which aren't always accurate. Please review and correct anything that's off.
              </p>

              {/* Property Address */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <HiOutlineCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="font-semibold text-foreground">
                    {editableAddress.street}
                    {editableAddress.unit && ` ${editableAddress.unit}`}
                    {editableAddress.city && `, ${editableAddress.city}`}
                    {editableAddress.state && `, ${editableAddress.state}`}
                    {editableAddress.zipCode && ` ${editableAddress.zipCode}`}
                  </p>
                </div>
              </div>

              {/* Editable Specs - Borderless with pencil triggers */}
              <div className="divide-y divide-border mb-6">
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Property Type</span>
                  <select
                    value={editableSpecs.propertyType}
                    onChange={(e) => handleSpecsChange("propertyType", e.target.value, false)}
                    className="text-sm font-medium text-foreground bg-transparent hover:bg-muted/50 focus:bg-muted/50 border-0 rounded px-2 py-1 text-right cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Single Family Home">Single Family Home</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Half Duplex">Half Duplex</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                  <label className="flex items-center gap-2 cursor-text">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editableSpecs.bedrooms}
                      onChange={(e) => handleSpecsChange("bedrooms", e.target.value)}
                      placeholder="—"
                      className="text-sm font-medium text-foreground bg-transparent hover:bg-muted/50 focus:bg-muted/50 border-0 rounded px-2 py-1 text-right w-16 cursor-text focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                    <HiOutlinePencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Full Bathrooms</span>
                  <label className="flex items-center gap-2 cursor-text">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editableSpecs.fullBathrooms}
                      onChange={(e) => handleSpecsChange("fullBathrooms", e.target.value)}
                      placeholder="—"
                      className="text-sm font-medium text-foreground bg-transparent hover:bg-muted/50 focus:bg-muted/50 border-0 rounded px-2 py-1 text-right w-16 cursor-text focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                    <HiOutlinePencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Half Bathrooms</span>
                  <label className="flex items-center gap-2 cursor-text">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editableSpecs.halfBathrooms}
                      onChange={(e) => handleSpecsChange("halfBathrooms", e.target.value)}
                      placeholder="—"
                      className="text-sm font-medium text-foreground bg-transparent hover:bg-muted/50 focus:bg-muted/50 border-0 rounded px-2 py-1 text-right w-16 cursor-text focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                    <HiOutlinePencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Year Built</span>
                  <label className="flex items-center gap-2 cursor-text">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editableSpecs.yearBuilt}
                      onChange={(e) => handleSpecsChange("yearBuilt", e.target.value)}
                      placeholder="—"
                      className="text-sm font-medium text-foreground bg-transparent hover:bg-muted/50 focus:bg-muted/50 border-0 rounded px-2 py-1 text-right w-16 cursor-text focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                    <HiOutlinePencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Square Footage</span>
                  <label className="flex items-center gap-2 cursor-text">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editableSpecs.squareFeet}
                      onChange={(e) => handleSpecsChange("squareFeet", e.target.value)}
                      placeholder="—"
                      className="text-sm font-medium text-foreground bg-transparent hover:bg-muted/50 focus:bg-muted/50 border-0 rounded px-2 py-1 text-right w-20 cursor-text focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                    <HiOutlinePencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </label>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep("address")}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors"
                >
                  <HiOutlineArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Next
                  <HiOutlineArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {step === "contact" && (
            <div className="bg-card rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                How Can We Reach You?
              </h2>
              <p className="text-muted-foreground mb-6">
                Enter your contact information to continue with your listing.
              </p>

              {/* Property Address */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="font-semibold text-foreground text-sm">
                  {editableAddress.street}
                  {editableAddress.unit && ` ${editableAddress.unit}`}
                  {editableAddress.city && `, ${editableAddress.city}`}
                  {editableAddress.state && `, ${editableAddress.state}`}
                  {editableAddress.zipCode && ` ${editableAddress.zipCode}`}
                </p>
              </div>

              {/* Contact Form */}
              <div className="space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineUser className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        value={contactForm.firstName}
                        onChange={(e) => handleContactChange("firstName", e.target.value)}
                        placeholder="John"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow ${
                          contactErrors.firstName ? "border-red-500" : "border-border"
                        }`}
                      />
                    </div>
                    {contactErrors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{contactErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineUser className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        value={contactForm.lastName}
                        onChange={(e) => handleContactChange("lastName", e.target.value)}
                        placeholder="Smith"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow ${
                          contactErrors.lastName ? "border-red-500" : "border-border"
                        }`}
                      />
                    </div>
                    {contactErrors.lastName && (
                      <p className="mt-1 text-xs text-red-500">{contactErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineEnvelope className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={contactForm.email}
                      onChange={(e) => handleContactChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow ${
                        contactErrors.email ? "border-red-500" : "border-border"
                      }`}
                    />
                  </div>
                  {contactErrors.email && (
                    <p className="mt-1 text-xs text-red-500">{contactErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlinePhone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={contactForm.phone}
                      onChange={(e) => handleContactChange("phone", e.target.value)}
                      placeholder="(972) 555-1234"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow ${
                        contactErrors.phone ? "border-red-500" : "border-border"
                      }`}
                    />
                  </div>
                  {contactErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">{contactErrors.phone}</p>
                  )}
                </div>

                {/* Submit Error */}
                {contactSubmitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <HiOutlineExclamationCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{contactSubmitError}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep("confirm")}
                    className="flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    <HiOutlineArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={handleContactSubmit}
                    disabled={contactSubmitting}
                    className="flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {contactSubmitting ? "Saving..." : "Next"}
                    {!contactSubmitting && <HiOutlineArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Service Selection - Simple Tier Cards */}
          {step === "service" && (
            <div className="bg-card rounded-xl border border-border p-4 md:p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Choose Your Service Level
                </h2>
                <p className="text-muted-foreground">
                  Select a plan to continue to payment.
                </p>
              </div>

              {/* Tier Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {TIERS.map((tier) => {
                  const isSelected = selectedTierId === tier.id;
                  return (
                    <button
                      key={tier.id}
                      onClick={() => {
                        setSelectedTierId(tier.id);
                        setTermsAccepted(false);
                      }}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : tier.id === "direct-list-plus"
                          ? "border-primary/50 bg-primary/5 hover:border-primary"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {tier.badge && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                          <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap">
                            {tier.badge}
                          </span>
                        </div>
                      )}
                      <div className={tier.badge ? "pt-2" : ""}>
                        <h3 className="font-semibold text-lg mb-1">
                          <TierName name={tier.name} />
                        </h3>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          {tier.id === "full-service" ? "Pay at closing" : "Upfront"}
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {tier.id === "full-service" ? tier.totalPrice : tier.upfrontPrice}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tier.id === "full-service" ? "No upfront payment" : `${tier.totalPrice} total`}
                        </div>
                        {isSelected && (
                          <div className="mt-2 flex items-center gap-1 text-primary text-sm font-medium">
                            <HiCheck className="h-4 w-4" />
                            Selected
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Terms Section - Shows when tier is selected */}
              {selectedTierId && (() => {
                const selectedTier = TIERS.find(t => t.id === selectedTierId);
                if (!selectedTier) return null;
                const terms = generateTermsContent(selectedTier);
                return (
                  <div className="border border-border rounded-lg p-4 mb-6 bg-muted/30">
                    <h3 className="font-semibold text-foreground mb-3">{terms.title}</h3>
                    <div className="max-h-48 overflow-y-auto mb-4 text-sm text-muted-foreground space-y-3">
                      {terms.sections.map((section, idx) => (
                        <div key={idx}>
                          <h4 className="font-medium text-foreground">{section.heading}</h4>
                          <p>{section.content}</p>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-start gap-2 mb-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">
                        I have read and agree to the Terms of Service
                      </span>
                    </label>
                    <button
                      onClick={() => setShowCheckout(true)}
                      disabled={!termsAccepted}
                      className="w-full py-3 px-6 rounded-lg font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </button>
                  </div>
                );
              })()}

              {/* Back Button */}
              <div>
                <button
                  onClick={() => {
                    setStep("contact");
                    setSelectedTierId(null);
                    setTermsAccepted(false);
                  }}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors"
                >
                  <HiOutlineArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>
            </div>
          )}
      </Section>

      {/* Checkout Modal - opens when user accepts terms */}
      {(() => {
        const selectedTier = TIERS.find(t => t.id === selectedTierId);
        if (!selectedTier) return null;
        return (
          <EmbeddedCheckoutModal
            isOpen={showCheckout}
            onClose={() => {
              setShowCheckout(false);
            }}
            plan={selectedTier.code}
            planName={selectedTier.name}
            source="get-started"
            leadId={leadId || undefined}
            propertySpecs={editableSpecs}
            utmParams={{
              utm_source: trackingParams.utmSource,
              utm_medium: trackingParams.utmMedium,
              utm_campaign: trackingParams.utmCampaign,
              utm_term: trackingParams.utmTerm,
              utm_content: trackingParams.utmContent,
            }}
          />
        );
      })()}

      {/* Schedule a Call Section */}
      <Section variant="tight" maxWidth="2xl" background="muted" borderTop className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Not ready to get started?
        </h2>
        <p className="text-muted-foreground mb-4">
          Our team can answer your questions and help you choose the right
          plan.
        </p>
        <button
          onClick={openCalendlyPopup}
          className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
        >
          Schedule a Free Consultation
        </button>
      </Section>
    </div>
  );
}
