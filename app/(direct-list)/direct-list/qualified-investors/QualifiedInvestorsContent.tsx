// ABOUTME: Qualified Investors landing client component — affiliate target for PromoteKit campaigns
// ABOUTME: Multi-step flow: pitch → contact → vetting → checkout (or booking on fail)

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HeroSection, Section } from "@/components/layout";
import { HiCheck, HiArrowLeft } from "react-icons/hi2";
import { useTrackingParams } from "@/lib/useTrackingParams";
import { StyledTierName } from "@/components/services/StyledTierName";
import { InvestorVettingFlow } from "@/components/direct-list/InvestorVettingFlow";
import { EmbeddedCheckoutModal } from "@/components/checkout/EmbeddedCheckoutModal";
import { CalendlyBooking } from "@/components/calendly/CalendlyBooking";
import type { CalendlyBookingResult } from "@/components/calendly/types";

type PageStep = "pitch" | "contact" | "creating-lead" | "vetting" | "checkout" | "booking";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const formatPhone = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export default function QualifiedInvestorsContent() {
  const [step, setStep] = useState<PageStep>("pitch");
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [promotekitReferral, setPromotekitReferral] = useState<string>("");

  const { originalTouch, latestTouch, currentParams } = useTrackingParams();

  const eventTypeUri = process.env.NEXT_PUBLIC_CALENDLY_INQUIRIES_URI || "";

  // Capture PromoteKit referral on mount
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).promotekit_referral) {
      setPromotekitReferral((window as any).promotekit_referral);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("creating-lead");
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          source: "website",
          landingUrl:
            typeof window !== "undefined" ? window.location.href : undefined,
          originalTouch,
          latestTouch,
          convertingTouch: currentParams,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create lead");
      }

      const { leadId: newLeadId } = await response.json();
      setLeadId(newLeadId);

      // Slack notification
      try {
        await fetch("/api/program-inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            programName: "DirectList Qualified Investors",
            address: "",
            attribution: {
              originalTouch: originalTouch?.utm_source
                ? `${originalTouch.utm_source}/${originalTouch.utm_medium || ""}/${originalTouch.utm_campaign || ""}`
                : null,
              latestTouch: latestTouch?.utm_source
                ? `${latestTouch.utm_source}/${latestTouch.utm_medium || ""}/${latestTouch.utm_campaign || ""}`
                : null,
            },
          }),
        });
      } catch {
        console.warn("Failed to send Slack notification");
      }

      setStep("vetting");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("contact");
    }
  };

  const handleVettingPass = (_parcelId: string, _address: string) => {
    setStep("checkout");
  };

  const handleVettingFail = (_reason: string) => {
    setStep("booking");
  };

  const handleBooked = (_result: CalendlyBookingResult) => {
    // Booking confirmed — stay on booking step which shows success via CalendlyBooking
  };

  const handleBookingError = (errorMessage: string) => {
    console.error("Booking error:", errorMessage);
  };

  return (
    <div className="bg-background">
      {/* ── STEP: PITCH ─────────────────────────────────────────── */}
      {step === "pitch" && (
        <>
          {/* Hero */}
          <HeroSection maxWidth="6xl" centered={false} className="pt-28">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <p className="text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
                  You&apos;ve Been Referred
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  List Your Investment Property on the MLS for{" "}
                  <span className="text-secondary">$1,995</span>
                </h1>
                <p className="text-base md:text-lg mb-8 text-white/90">
                  Same MLS exposure. Same professional photography. Same showing
                  system. Just priced for investors who already know what
                  they&apos;re doing.
                </p>

                <div className="flex flex-col items-start gap-4">
                  <button
                    onClick={() => setStep("contact")}
                    className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Verify Your Qualification
                  </button>
                  <p className="text-white/70 text-sm">
                    Takes about 60 seconds. No commitment.
                  </p>
                </div>
              </div>

              {/* Right Image */}
              <div className="hidden md:block">
                <div className="border-4 border-secondary rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="/hero-house-new.jpg"
                    alt="Investment property for sale"
                    width={1920}
                    height={1264}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </HeroSection>

          {/* How It Works */}
          <Section variant="content" maxWidth="4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How DirectList Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Selling your flip shouldn&apos;t require handing over a massive
                chunk of your profit. DirectList gives you MLS exposure,
                control, and support — without the high listing fees.
              </p>
            </div>

            <Image
              src="/3-easy-steps.png"
              alt="How DirectList works: List Your Home, Receive Offers, Close and Get Paid"
              width={1080}
              height={1080}
              className="w-full max-w-2xl mx-auto h-auto"
            />
          </Section>

          {/* Side-by-Side Pricing */}
          <Section variant="content" maxWidth="5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Investor Pricing — Because You&apos;ve Earned It
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Most sellers pay{" "}
                <span className="font-semibold text-foreground">$2,995</span> to
                list on MLS. As a referred investor, you get the same service
                for{" "}
                <span className="font-semibold text-foreground">$1,995</span>.
              </p>
            </div>

            <div className="grid md:grid-cols-7 gap-4 md:gap-6 items-center">
              {/* Standard Listing — passive reference */}
              <div className="md:col-span-3 rounded-xl border border-border/60 shadow-sm overflow-hidden bg-card/80 flex flex-col opacity-85 order-2 md:order-1">
                <div className="p-5 text-center bg-primary/5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Standard Listing Package
                  </p>
                  <h3 className="text-lg font-semibold mb-1">
                    <StyledTierName name="DirectList" />
                  </h3>
                  <p
                    className="text-sm font-bold text-primary/70"
                    style={{
                      fontFamily:
                        "var(--font-be-vietnam-pro), 'Be Vietnam Pro', sans-serif",
                    }}
                  >
                    for Homeowners
                  </p>
                  <div className="text-2xl font-bold text-primary/70 mt-2">
                    $2,995
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <p className="text-xs font-medium text-muted-foreground mb-3">
                    Everything you need to list on MLS
                  </p>
                  <ul className="space-y-2">
                    {[
                      "MLS Listing + Syndication",
                      "Professional Photography",
                      "Guided Pricing Strategy",
                      "Digital Document Signing",
                      "Lockbox & Yard Sign",
                      "Showings via ShowingTime",
                      "Market Assessments",
                      "On Demand Services",
                    ].map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <HiCheck className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Investor Advantage — dominant card */}
              <div className="md:col-span-4 relative mt-4 z-10 order-1 md:order-2">
                {/* Investor Advantage badge */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span className="inline-block bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                    Investor Advantage
                  </span>
                </div>
                <div className="rounded-xl border-2 border-secondary shadow-xl bg-card flex flex-col overflow-hidden md:scale-[1.03]">
                  <div className="p-6 pt-8 text-center bg-secondary/15">
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground/80 mb-2">
                      Referred Investor Pricing
                    </p>
                    <h3 className="text-2xl font-semibold mb-1">
                      <StyledTierName name="DirectList" />
                    </h3>
                    <p
                      className="text-sm font-bold text-primary"
                      style={{
                        fontFamily:
                          "var(--font-be-vietnam-pro), 'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      for Investors
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-1">
                      <span
                        className="text-xl text-muted-foreground"
                        style={{
                          textDecorationLine: "line-through",
                          textDecorationThickness: "3px",
                        }}
                      >
                        $2,995
                      </span>
                      <span className="text-3xl font-bold text-primary mt-1">
                        $1,995
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Use your referral code at checkout for an additional $500
                      off
                    </p>
                  </div>
                  <div className="p-6 flex-grow">
                    <p className="text-sm font-medium text-muted-foreground mb-4 italic">
                      Everything you need to list on MLS, without paying for
                      extras you&apos;ll never use.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Same MLS Exposure & Syndication",
                        "Same Professional Photography",
                        "Same Showing System",
                        "Same Contracts & Documents",
                        "Same Lockbox & Yard Sign",
                        "On Demand Services Available",
                      ].map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm"
                        >
                          <HiCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 pt-0 text-center">
                    <button
                      onClick={() => setStep("contact")}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-base w-full"
                    >
                      Verify Your Qualification
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Takes about 60 seconds. No commitment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Bottom CTA */}
          <Section variant="cta" maxWidth="4xl" className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Verify your qualification and list your next investment property
              for $1,995.
            </p>
            <button
              onClick={() => setStep("contact")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Verify Your Qualification
              <span aria-hidden="true">&rarr;</span>
            </button>
          </Section>
        </>
      )}

      {/* ── STEP: CONTACT ───────────────────────────────────────── */}
      {step === "contact" && (
        <div className="min-h-screen bg-background">
          <div className="bg-primary pt-20">
            <div className="mx-auto max-w-md px-4 py-6">
              <button
                onClick={() => setStep("pitch")}
                className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-4"
              >
                <HiArrowLeft className="h-4 w-4" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-primary-foreground">
                Let&apos;s Verify Your Qualification
              </h1>
              <p className="text-sm text-primary-foreground/80 mt-1">
                DirectList Investor Pricing — $1,995
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-md px-4 py-8">
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
                  >
                    Continue
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP: CREATING LEAD ─────────────────────────────────── */}
      {step === "creating-lead" && (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── STEP: VETTING ───────────────────────────────────────── */}
      {step === "vetting" && (
        <div className="min-h-screen bg-background">
          <div className="bg-primary pt-20">
            <div className="mx-auto max-w-md px-4 py-6">
              <h1 className="text-2xl font-bold text-primary-foreground">
                Verify Your Property
              </h1>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Enter the address of the property you&apos;d like to list
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-md px-4 py-8">
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-6">
                <InvestorVettingFlow
                  email={formData.email}
                  onPass={handleVettingPass}
                  onFail={handleVettingFail}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP: CHECKOUT ──────────────────────────────────────── */}
      {step === "checkout" && (
        <div className="min-h-screen bg-background">
          <div className="bg-primary pt-20">
            <div className="mx-auto max-w-md px-4 py-6">
              <h1 className="text-2xl font-bold text-primary-foreground">
                You&apos;re Qualified
              </h1>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Investor pricing confirmed — $1,995
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-md px-4 py-8">
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                  <p className="font-semibold text-green-800 mb-1">
                    Property verified for investor pricing
                  </p>
                  <p className="text-sm text-green-700">
                    Your referral code will be applied at checkout for an
                    additional $500 off.
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Your investor pricing has been confirmed. Proceed to
                    checkout to complete your listing.
                  </p>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  Proceed to Checkout — $1,995
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP: BOOKING (FAIL PATH) ────────────────────────────── */}
      {step === "booking" && (
        <div className="min-h-screen bg-background">
          <div className="bg-primary pt-20">
            <div className="mx-auto max-w-md px-4 py-6">
              <h1 className="text-2xl font-bold text-primary-foreground">
                Let&apos;s Talk
              </h1>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Schedule a quick call — we&apos;ll verify your investor status
                personally
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-md px-4 py-8">
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-6">
                {leadId && eventTypeUri ? (
                  <CalendlyBooking
                    eventTypeUri={eventTypeUri}
                    invitee={{
                      name: `${formData.firstName} ${formData.lastName}`.trim(),
                      email: formData.email,
                      phone: formData.phone,
                    }}
                    leadId={leadId}
                    programSource="qualified-investors"
                    programName="DirectList Qualified Investors"
                    onBooked={handleBooked}
                    onError={handleBookingError}
                    meetingInfo={{ type: "phone" }}
                    hostInfo={{ name: "Solutions Expert" }}
                  />
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-red-600">
                      Booking configuration is missing. Please contact support.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ALWAYS RENDERED: Checkout Modal ─────────────────────── */}
      <EmbeddedCheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        plan="investor_1995"
        planName="Investor"
        source="qualified-investors"
        leadId={leadId || undefined}
        promotekitReferral={promotekitReferral}
      />
    </div>
  );
}
