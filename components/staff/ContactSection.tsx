// ABOUTME: Staff contact section with 3-card layout
// ABOUTME: Book Online card opens modal with embedded Calendly

"use client";

import { useState } from "react";
import { HiPhone, HiEnvelope, HiCalendarDays, HiVideoCamera, HiXMark } from "react-icons/hi2";
import CalendlyEmbed from "@/components/CalendlyEmbed";

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

type MeetingType = "phone" | "video";

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
  const hasBothCalendly = calendlyPhoneUrl && calendlyRemoteUrl;
  const defaultMeetingType: MeetingType = calendlyPhoneUrl ? "phone" : "video";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetingType, setMeetingType] = useState<MeetingType>(defaultMeetingType);

  const currentCalendlyUrl = meetingType === "phone" ? calendlyPhoneUrl : calendlyRemoteUrl;

  return (
    <>
      <section className="py-16 bg-primary">
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

            {/* Book Online Card - opens modal */}
            {hasCalendly ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="group bg-card rounded-xl p-8 text-center transition-all duration-300 border border-transparent shadow-xl cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <HiCalendarDays className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
                  BOOK ONLINE
                </p>
                <p className="text-xl font-bold text-foreground">
                  Schedule a Call
                </p>
              </button>
            ) : (
              <a
                href={`mailto:${email}?subject=Consultation Request`}
                className="group bg-card rounded-xl p-8 text-center transition-all duration-300 border border-transparent shadow-xl"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <HiCalendarDays className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
                  BOOK ONLINE
                </p>
                <p className="text-xl font-bold text-foreground">
                  Schedule a Call
                </p>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Calendly Modal */}
      {isModalOpen && hasCalendly && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Schedule a Call with {agentName}
                </h3>
                {hasBothCalendly && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose your preferred meeting type
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close modal"
              >
                <HiXMark className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>

            {/* Meeting type tabs */}
            {hasBothCalendly && (
              <div className="flex gap-2 px-6 pt-4">
                <button
                  onClick={() => setMeetingType("phone")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
                    meetingType === "phone"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  <HiPhone className="h-4 w-4" />
                  Phone Call
                </button>
                <button
                  onClick={() => setMeetingType("video")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
                    meetingType === "video"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  <HiVideoCamera className="h-4 w-4" />
                  Video Call
                </button>
              </div>
            )}

            {/* Calendly embed */}
            <div className="p-4">
              {currentCalendlyUrl && (
                <CalendlyEmbed
                  url={currentCalendlyUrl}
                  styles={{ height: "500px" }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
