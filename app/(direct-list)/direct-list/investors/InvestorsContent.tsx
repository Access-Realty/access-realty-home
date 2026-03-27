// ABOUTME: Investors landing client component — flat-fee MLS for fix-and-flip sellers
// ABOUTME: Imported by page.tsx server wrapper which owns the metadata export

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection, Section } from "@/components/layout";
import { HiCheck, HiChevronDown } from "react-icons/hi2";
import { useBrandPath } from "@/lib/BrandProvider";
import { StyledTierName } from "@/components/services/StyledTierName";
import { InvestorVettingFlow } from "@/components/direct-list/InvestorVettingFlow";
import { EmbeddedCheckoutModal } from "@/components/checkout/EmbeddedCheckoutModal";
import { CalendlyBooking } from "@/components/calendly/CalendlyBooking";
import type { CalendlyBookingResult } from "@/components/calendly/types";
import { useTrackingParams } from "@/lib/useTrackingParams";

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

type InvestorStep = "info" | "contact" | "creating-lead" | "vetting" | "checkout" | "booking" | "success";

export default function InvestorsContent() {
  const bp = useBrandPath();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [step, setStep] = useState<InvestorStep>("info");
  const [contactData, setContactData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [leadId, setLeadId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [contactError, setContactError] = useState("");
  const [bookingResult, setBookingResult] = useState<CalendlyBookingResult | null>(null);
  const { originalTouch, latestTouch, currentParams } = useTrackingParams();
  const eventTypeUri = process.env.NEXT_PUBLIC_CALENDLY_INQUIRIES_URI || "";

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

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

            {/* CTA */}
            <div className="flex flex-col items-start gap-4">
              <button
                onClick={() => setStep("contact")}
                className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
              <p className="text-white/70">
                Verify your property for Investor Pricing.
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

      {/* How DirectList Works - Visual */}
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
            Real Estate Investors Get Special Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most sellers pay <span className="font-semibold text-foreground">$2,995</span> to
            list on MLS. But active investors qualify for{" "}
            <span className="font-semibold text-foreground">discounted pricing</span>.
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
                Pay Less
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
                <span className="text-xl text-muted-foreground" style={{ textDecorationLine: 'line-through', textDecorationThickness: '3px' }}>
                  $2,995
                </span>
                <div className="text-3xl font-bold text-primary mt-1">
                  $1,995
                </div>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <p className="text-sm font-medium text-muted-foreground mb-4 italic">
                Everything you need to list on MLS, without paying for extras
                you&apos;ll never use.
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
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-base"
              >
                Get Started
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                Verify your property to unlock investor pricing.
              </p>
            </div>
            </div>
          </div>
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

      {/* Multi-Step Flow Section */}
      {step !== "info" && (
        <Section variant="content" maxWidth="lg">
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6">
              {/* Contact Form */}
              {step === "contact" && (
                <div>
                  <button
                    onClick={() => setStep("info")}
                    className="text-sm text-primary hover:underline mb-4"
                  >
                    &larr; Back
                  </button>
                  <h3 className="text-xl font-bold text-foreground mb-1">Get Started</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter your contact information to verify your investor qualification.
                  </p>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setStep("creating-lead");
                    setContactError("");
                    try {
                      const res = await fetch("/api/leads", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          firstName: contactData.firstName,
                          lastName: contactData.lastName,
                          email: contactData.email,
                          phone: contactData.phone,
                          source: "website",
                          landingUrl: typeof window !== "undefined" ? window.location.href : undefined,
                          originalTouch, latestTouch, convertingTouch: currentParams,
                        }),
                      });
                      if (!res.ok) throw new Error((await res.json()).error || "Failed");
                      const { leadId: newId } = await res.json();
                      setLeadId(newId);
                      try {
                        await fetch("/api/program-inquiry", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            ...contactData, programName: "DirectList for Investors", address: "",
                            attribution: {
                              originalTouch: originalTouch?.utm_source ? `${originalTouch.utm_source}/${originalTouch.utm_medium || ""}/${originalTouch.utm_campaign || ""}` : null,
                              latestTouch: latestTouch?.utm_source ? `${latestTouch.utm_source}/${latestTouch.utm_medium || ""}/${latestTouch.utm_campaign || ""}` : null,
                            },
                          }),
                        });
                      } catch { /* Slack notification is best-effort */ }
                      setStep("vetting");
                    } catch (err) {
                      setContactError(err instanceof Error ? err.message : "Something went wrong");
                      setStep("contact");
                    }
                  }} className="space-y-4">
                    {contactError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{contactError}</div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="inv-firstName" className="block text-sm font-medium text-foreground mb-1">First Name</label>
                        <input type="text" id="inv-firstName" required value={contactData.firstName}
                          onChange={(e) => setContactData(p => ({ ...p, firstName: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="John" />
                      </div>
                      <div>
                        <label htmlFor="inv-lastName" className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                        <input type="text" id="inv-lastName" required value={contactData.lastName}
                          onChange={(e) => setContactData(p => ({ ...p, lastName: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="inv-email" className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                      <input type="email" id="inv-email" required value={contactData.email}
                        onChange={(e) => setContactData(p => ({ ...p, email: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label htmlFor="inv-phone" className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                      <input type="tel" id="inv-phone" required value={contactData.phone}
                        onChange={(e) => setContactData(p => ({ ...p, phone: formatPhone(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" placeholder="(555) 123-4567" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors">
                      Continue
                    </button>
                  </form>
                </div>
              )}

              {/* Creating Lead Spinner */}
              {step === "creating-lead" && (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Vetting */}
              {step === "vetting" && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Verify Your Property</h3>
                  <p className="text-sm text-muted-foreground mb-4">Enter the address of the property you&apos;d like to list.</p>
                  <InvestorVettingFlow
                    email={contactData.email}
                    onPass={() => setStep("checkout")}
                    onFail={() => setStep("booking")}
                  />
                </div>
              )}

              {/* Checkout */}
              {step === "checkout" && (
                <div className="text-center space-y-4 py-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                    <span className="text-green-700 font-semibold text-sm">Qualified for Investor Pricing</span>
                  </div>
                  <p className="text-muted-foreground text-sm">You&apos;re all set to proceed with the Investor package at $1,995.</p>
                  <button onClick={() => setShowCheckout(true)}
                    className="px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    Proceed to Checkout
                  </button>
                </div>
              )}

              {/* Booking (FAIL path) */}
              {step === "booking" && leadId && eventTypeUri && (
                <CalendlyBooking
                  eventTypeUri={eventTypeUri}
                  invitee={{
                    name: `${contactData.firstName} ${contactData.lastName}`.trim(),
                    email: contactData.email,
                    phone: contactData.phone,
                  }}
                  leadId={leadId}
                  programSource="investors"
                  programName="DirectList for Investors"
                  onBooked={(result) => { setBookingResult(result); setStep("success"); }}
                  onError={(err) => console.error("Booking error:", err)}
                  meetingInfo={{ type: "phone" }}
                  hostInfo={{ name: "Solutions Expert" }}
                />
              )}

              {/* Booking fallback */}
              {step === "booking" && (!eventTypeUri || !leadId) && (
                <div className="text-center py-8 space-y-4">
                  <p className="text-amber-700">We need to verify your qualification. Please book a call.</p>
                  <Link href={bp("/direct-list/investors/book")} className="text-primary font-medium hover:underline">Book a Call</Link>
                </div>
              )}

              {/* Success */}
              {step === "success" && bookingResult && (
                <div className="text-center space-y-4 py-4">
                  <h3 className="text-xl font-bold text-foreground">You&apos;re All Set</h3>
                  <p className="text-muted-foreground text-sm">
                    Your call is scheduled. A confirmation email has been sent to <span className="font-medium text-foreground">{contactData.email}</span>.
                  </p>
                  <button onClick={() => { setStep("info"); setContactData({ firstName: "", lastName: "", email: "", phone: "" }); }}
                    className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Bottom CTA - shown only in info step */}
      {step === "info" && (
        <Section variant="cta" maxWidth="4xl" className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Verify your property to unlock investor pricing.
          </p>
          <button
            onClick={() => setStep("contact")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started
            <span aria-hidden="true">&rarr;</span>
          </button>
        </Section>
      )}

      {/* Checkout Modal */}
      <EmbeddedCheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        plan="investor_1995"
        planName="Investor"
        source="investors-page"
        leadId={leadId || undefined}
      />
    </div>
  );
}
