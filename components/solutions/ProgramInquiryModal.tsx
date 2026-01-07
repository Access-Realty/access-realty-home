// ABOUTME: Reusable modal for Solutions program inquiries (Price Launch, 2% Payment, Uplist, etc.)
// ABOUTME: Collects contact info, sends Slack notification, opens Calendly with prefilled data

"use client";

import { useState, useCallback } from "react";
import { HiXMark } from "react-icons/hi2";
import type { AddressData } from "@/components/direct-list/AddressInput";

// Calendly global type
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface ProgramInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  programName: string; // e.g., "Price Launch", "2% Payment", "Uplist"
  programMessage: string; // e.g., "I'm interested in your Price Launch Program."
  addressData: AddressData | null;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function ProgramInquiryModal({
  isOpen,
  onClose,
  programName,
  programMessage,
  addressData,
}: ProgramInquiryModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCalendlyPopup = useCallback((url: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Send to Slack via API
      const response = await fetch("/api/program-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          programName,
          address: addressData?.formattedAddress || "",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit inquiry");
      }

      // Build Calendly URL with prefilled data
      const baseUrl = "https://calendly.com/dfw-experts/inquires";
      const params = new URLSearchParams();

      // Prefill name
      const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(" ");
      if (fullName) params.set("name", fullName);

      // Prefill email
      if (formData.email) params.set("email", formData.email);

      // Prefill custom answers (a1 = phone, a2 = meeting notes with program + address)
      if (formData.phone) params.set("a1", formData.phone);

      // Build a2 with program interest and address
      const meetingNotes = addressData?.formattedAddress
        ? `${programMessage} My property is at ${addressData.formattedAddress}`
        : programMessage;
      params.set("a2", meetingNotes);

      const calendlyUrl = `${baseUrl}?${params.toString()}`;

      // Close modal and open Calendly
      onClose();
      openCalendlyPopup(calendlyUrl);

      // Reset form
      setFormData({ firstName: "", lastName: "", email: "", phone: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-primary-foreground">
              Schedule Your Consultation
            </h3>
            <p className="text-sm text-primary-foreground/80 mt-1">
              {programName} Program
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <HiXMark className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Address Display */}
          {addressData && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Property Address</p>
              <p className="font-medium text-foreground">{addressData.formattedAddress}</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
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
              <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
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
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
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
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
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
            disabled={isSubmitting}
            className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              "Continue to Schedule"
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            We&apos;ll send you a confirmation email after you select a time.
          </p>
        </form>
      </div>
    </div>
  );
}
