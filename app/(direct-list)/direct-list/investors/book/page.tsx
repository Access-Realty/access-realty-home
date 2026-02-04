// ABOUTME: Investor booking page — contact form with experience level → Calendly scheduling
// ABOUTME: Standalone page adapted from ProgramInquiryModal pattern, no property address required

"use client";

import { useState } from "react";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { useTrackingParams } from "@/lib/useTrackingParams";
import { CalendlyBooking } from "@/components/calendly/CalendlyBooking";
import type { CalendlyBookingResult } from "@/components/calendly/types";

const experienceOptions = [
  { value: "none", label: "None yet — this would be my first" },
  { value: "1-3", label: "1–3" },
  { value: "4-10", label: "4–10" },
  { value: "11-25", label: "11–25" },
  { value: "25+", label: "25+" },
];

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experienceLevel: string;
}

type PageStep = "form" | "creating-lead" | "booking" | "success";

export default function InvestorBookPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experienceLevel: "",
  });
  const [step, setStep] = useState<PageStep>("form");
  const [error, setError] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [bookingResult, setBookingResult] =
    useState<CalendlyBookingResult | null>(null);

  const { originalTouch, latestTouch, currentParams } = useTrackingParams();

  const eventTypeUri =
    process.env.NEXT_PUBLIC_CALENDLY_INQUIRIES_URI || "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
      digits = digits.slice(1);
    }
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        const expLabel =
          experienceOptions.find((o) => o.value === formData.experienceLevel)
            ?.label || formData.experienceLevel;
        await fetch("/api/program-inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            programName: "DirectList for Investors",
            address: "",
            experienceLevel: expLabel,
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
  };

  const expLabel =
    experienceOptions.find((o) => o.value === formData.experienceLevel)?.label ||
    formData.experienceLevel;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary pt-20">
        <div className="mx-auto max-w-md px-4 py-6">
          <Link
            href="/direct-list/investors"
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-4"
          >
            <HiArrowLeft className="h-4 w-4" />
            Back to DirectList for Investors
          </Link>
          <h1 className="text-2xl font-bold text-primary-foreground">
            Schedule a Call
          </h1>
          <p className="text-sm text-primary-foreground/80 mt-1">
            DirectList for Investors
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            {/* Form Step */}
            {step === "form" && (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div>
                  <label
                    htmlFor="experienceLevel"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    How many investment properties have you sold?
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    required
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    {experienceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
                >
                  Continue to Schedule
                </button>
              </form>
            )}

            {/* Creating Lead Step */}
            {step === "creating-lead" && (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
                programSource="investors"
                programName="DirectList for Investors"
                propertyAddress={
                  expLabel
                    ? `Investment experience: ${expLabel}`
                    : undefined
                }
                onBooked={handleBooked}
                onError={handleBookingError}
                meetingInfo={{ type: "phone" }}
                hostInfo={{ name: "Solutions Expert" }}
              />
            )}

            {/* Missing config */}
            {step === "booking" && (!eventTypeUri || !leadId) && (
              <div className="text-center py-8 space-y-4">
                <p className="text-red-600">
                  Booking configuration is missing. Please contact support.
                </p>
                <Link
                  href="/direct-list/investors"
                  className="text-primary font-medium hover:underline"
                >
                  Go back
                </Link>
              </div>
            )}

            {/* Success Step */}
            {step === "success" && bookingResult && (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-5">
                <div className="w-full bg-muted/50 rounded-xl p-5 space-y-3 text-left">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 shrink-0">
                      <svg
                        className="h-5 w-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {new Date(bookingResult.start_time).toLocaleDateString(
                          "en-US",
                          { weekday: "long", month: "long", day: "numeric" }
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(bookingResult.start_time).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                            timeZoneName: "short",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Host */}
                  {bookingResult.assigned_host && (
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2 shrink-0">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {bookingResult.assigned_host.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Solutions Expert
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone call */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 shrink-0">
                      <svg
                        className="h-5 w-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone Call</p>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll call {formData.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to{" "}
                  <span className="font-medium text-foreground">
                    {formData.email}
                  </span>
                </p>

                <Link
                  href="/direct-list/investors"
                  className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors text-center block"
                >
                  Done
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
