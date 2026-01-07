// ABOUTME: Staff contact section with 3-card layout
// ABOUTME: Book Online card opens Calendly's native popup (no scrolling issues)

"use client";

import { useCallback } from "react";
import { HiPhone, HiEnvelope, HiCalendarDays } from "react-icons/hi2";

// Calendly global type
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface ContactSectionProps {
  agentName: string;
  phone: string | null;
  email: string;
  calendlyPhoneUrl: string | null;
  calendlyRemoteUrl: string | null;
}

function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function formatPhoneTel(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

export default function ContactSection({
  agentName,
  phone,
  email,
  calendlyPhoneUrl,
  calendlyRemoteUrl,
}: ContactSectionProps) {
  const formattedPhone = phone ? formatPhoneDisplay(phone) : "(972) 820-7902";
  const telPhone = phone ? formatPhoneTel(phone) : "+19728207902";

  const hasCalendly = calendlyPhoneUrl || calendlyRemoteUrl;
  const calendlyUrl = calendlyPhoneUrl || calendlyRemoteUrl;

  // Open Calendly's native popup widget (no scrolling issues)
  const openCalendlyPopup = useCallback(() => {
    if (!calendlyUrl) return;

    // Build URL with GDPR banner hidden
    const fullUrl = calendlyUrl.startsWith("http") ? calendlyUrl : `https://${calendlyUrl}`;
    const popupUrl = `${fullUrl}${fullUrl.includes("?") ? "&" : "?"}hide_gdpr_banner=1`;

    // If Calendly is already loaded, open popup
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: popupUrl });
      return;
    }

    // Load Calendly script dynamically
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url: popupUrl });
      }
    };
    document.head.appendChild(script);

    // Also load Calendly CSS
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, [calendlyUrl]);

  return (
    <section id="contact" className="py-16 bg-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-foreground/70 tracking-widest mb-2">
            LET&apos;S CONNECT
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Whether you&apos;re ready to buy, sell, or simply want to explore your options, I&apos;m here
            to help. Reach out today for a no-obligation consultation.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Call Me Card */}
          <a
            href={`tel:${telPhone}`}
            className="group bg-primary-foreground/10 hover:bg-card rounded-xl p-8 text-center transition-all duration-300 border border-primary-foreground/20 hover:border-transparent hover:shadow-xl"
          >
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 group-hover:bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-colors">
              <HiPhone className="h-7 w-7 text-primary-foreground group-hover:text-primary" />
            </div>
            <p className="text-sm font-semibold text-primary-foreground/70 group-hover:text-muted-foreground tracking-widest mb-2">
              CALL ME
            </p>
            <p className="text-xl font-bold text-primary-foreground group-hover:text-foreground">
              {formattedPhone}
            </p>
          </a>

          {/* Email Me Card */}
          <a
            href={`mailto:${email}`}
            className="group bg-primary-foreground/10 hover:bg-card rounded-xl p-8 text-center transition-all duration-300 border border-primary-foreground/20 hover:border-transparent hover:shadow-xl"
          >
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 group-hover:bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-colors">
              <HiEnvelope className="h-7 w-7 text-primary-foreground group-hover:text-primary" />
            </div>
            <p className="text-sm font-semibold text-primary-foreground/70 group-hover:text-muted-foreground tracking-widest mb-2">
              EMAIL ME
            </p>
            <p className="text-xl font-bold text-primary-foreground group-hover:text-foreground break-all">
              {email}
            </p>
          </a>

          {/* Book Online Card - opens Calendly popup */}
          {hasCalendly ? (
            <button
              onClick={openCalendlyPopup}
              className="group bg-primary-foreground/10 hover:bg-card rounded-xl p-8 text-center transition-all duration-300 border border-primary-foreground/20 hover:border-transparent hover:shadow-xl cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20 group-hover:bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-colors">
                <HiCalendarDays className="h-7 w-7 text-primary-foreground group-hover:text-primary" />
              </div>
              <p className="text-sm font-semibold text-primary-foreground/70 group-hover:text-muted-foreground tracking-widest mb-2">
                BOOK ONLINE
              </p>
              <p className="text-xl font-bold text-primary-foreground group-hover:text-foreground">
                Schedule a Call
              </p>
            </button>
          ) : (
            <a
              href={`mailto:${email}?subject=Consultation Request`}
              className="group bg-primary-foreground/10 hover:bg-card rounded-xl p-8 text-center transition-all duration-300 border border-primary-foreground/20 hover:border-transparent hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20 group-hover:bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-colors">
                <HiCalendarDays className="h-7 w-7 text-primary-foreground group-hover:text-primary" />
              </div>
              <p className="text-sm font-semibold text-primary-foreground/70 group-hover:text-muted-foreground tracking-widest mb-2">
                BOOK ONLINE
              </p>
              <p className="text-xl font-bold text-primary-foreground group-hover:text-foreground">
                Schedule a Call
              </p>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
