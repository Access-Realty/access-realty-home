// ABOUTME: Reusable modal for Solutions program inquiries (Price Launch, 2% Payment, Uplist, etc.)
// ABOUTME: Creates lead, then shows branded calendar booking (no Calendly branding visible)

"use client";

import { useState } from "react";
import { HiXMark, HiOutlineArrowLeft } from "react-icons/hi2";
import type { AddressData } from "@/components/direct-list/AddressInput";
import { useTrackingParams } from "@/lib/useTrackingParams";
import { CalendlyBooking } from "@/components/calendly/CalendlyBooking";
import type { CalendlyBookingResult } from "@/components/calendly/types";

interface ProgramInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  programName: string; // e.g., "Price Launch", "2% Payment", "Uplist"
  programSlug: string; // e.g., "price_launch" for tracking
  addressData: AddressData | null;
  calendlyEventTypeUri?: string; // Optional override for Calendly event type
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type ModalStep = "form" | "creating-lead" | "booking" | "success";

export function ProgramInquiryModal({
  isOpen,
  onClose,
  programName,
  programSlug,
  addressData,
  calendlyEventTypeUri,
}: ProgramInquiryModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [step, setStep] = useState<ModalStep>("form");
  const [error, setError] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<CalendlyBookingResult | null>(null);

  // Multi-touch attribution tracking
  const { originalTouch, latestTouch, currentParams } = useTrackingParams();

  // Get Calendly event type URI from props or environment
  const eventTypeUri =
    calendlyEventTypeUri || process.env.NEXT_PUBLIC_CALENDLY_EVENT_TYPE_URI || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("creating-lead");
    setError("");

    try {
      // Create lead via API with full attribution
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: addressData?.streetNumber && addressData?.streetName
            ? `${addressData.streetNumber} ${addressData.streetName}`
            : undefined,
          city: addressData?.city,
          state: addressData?.state,
          zip: addressData?.zipCode,
          source: "website",
          landingUrl: typeof window !== "undefined" ? window.location.href : undefined,
          // Multi-touch attribution
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

      // Also send Slack notification (optional - for immediate notification)
      try {
        await fetch("/api/program-inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            programName,
            address: addressData?.formattedAddress || "",
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
        // Slack notification is optional, don't fail the flow
        console.warn("Failed to send Slack notification");
      }

      // Transition to booking step
      setStep("booking");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
    }
  };

  const handleBooked = (result: CalendlyBookingResult) => {
    setBookingResult(result);
    setStep("success");
  };

  const handleBookingError = (errorMessage: string) => {
    console.error("Booking error:", errorMessage);
    // Stay on booking step, CalendlyBooking shows its own error
  };

  const handleBack = () => {
    setStep("form");
    setLeadId(null);
    setError("");
  };

  const handleClose = () => {
    // Reset state when closing
    setFormData({ firstName: "", lastName: "", email: "", phone: "" });
    setStep("form");
    setLeadId(null);
    setError("");
    setBookingResult(null);
    onClose();
  };

  if (!isOpen) return null;

  // Get header title based on step
  const getHeaderTitle = () => {
    switch (step) {
      case "form":
      case "creating-lead":
        return "Schedule Your Consultation";
      case "booking":
        return "Choose a Time";
      case "success":
        return "You're All Set!";
      default:
        return "Schedule Your Consultation";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {step === "booking" && (
              <button
                onClick={handleBack}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <HiOutlineArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-primary-foreground">
                {getHeaderTitle()}
              </h3>
              <p className="text-sm text-primary-foreground/80 mt-1">
                {programName} Program
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <HiXMark className="h-6 w-6" />
          </button>
        </div>

        {/* Content area with scroll */}
        <div className="p-6 overflow-y-auto">
          {/* Form Step */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Address Display */}
              {addressData && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Property Address</p>
                  <p className="font-medium text-foreground">
                    {addressData.formattedAddress}
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {/* First Name */}
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

                {/* Last Name */}
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

              {/* Email */}
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

              {/* Phone */}
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
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
              >
                Continue to Schedule
              </button>

              <p className="text-xs text-muted-foreground text-center">
                We&apos;ll send you a confirmation email after you select a time.
              </p>
            </form>
          )}

          {/* Creating Lead Step */}
          {step === "creating-lead" && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Setting up your consultation...</p>
            </div>
          )}

          {/* Booking Step */}
          {step === "booking" && leadId && eventTypeUri && (
            <CalendlyBooking
              eventTypeUri={eventTypeUri}
              invitee={{
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone,
              }}
              leadId={leadId}
              programSource={programSlug}
              onBooked={handleBooked}
              onError={handleBookingError}
              hostInfo={{
                name: null,
                isTeamCalendar: true,
              }}
            />
          )}

          {/* Missing config error */}
          {step === "booking" && (!eventTypeUri || !leadId) && (
            <div className="text-center py-8 space-y-4">
              <p className="text-red-600">
                Booking configuration is missing. Please contact support.
              </p>
              <button
                onClick={handleBack}
                className="text-primary font-medium hover:underline"
              >
                Go back
              </button>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && bookingResult && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <p className="text-muted-foreground">
                A confirmation email has been sent to{" "}
                <span className="font-medium text-foreground">{formData.email}</span>
              </p>
              <button
                onClick={handleClose}
                className="py-2 px-6 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
