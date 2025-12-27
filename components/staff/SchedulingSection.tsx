// ABOUTME: Staff scheduling section with video/phone call tabs
// ABOUTME: Embeds Calendly inline widget with meeting type selector

"use client";

import { useState } from "react";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { HiVideoCamera, HiPhone } from "react-icons/hi2";

interface SchedulingSectionProps {
  agentName: string;
  calendlyRemoteUrl: string | null;
  calendlyPhoneUrl: string | null;
  email: string;
}

type MeetingType = "video" | "phone";

export default function SchedulingSection({
  agentName,
  calendlyRemoteUrl,
  calendlyPhoneUrl,
  email,
}: SchedulingSectionProps) {
  // Default to whichever is available, preferring video
  const defaultType: MeetingType = calendlyRemoteUrl ? "video" : "phone";
  const [meetingType, setMeetingType] = useState<MeetingType>(defaultType);

  const hasBothOptions = calendlyRemoteUrl && calendlyPhoneUrl;
  const currentUrl = meetingType === "video" ? calendlyRemoteUrl : calendlyPhoneUrl;

  // If neither URL exists, show email fallback
  if (!calendlyRemoteUrl && !calendlyPhoneUrl) {
    return (
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Let&apos;s discuss your real estate goals and create a plan tailored to your needs.
          </p>
          <a
            href={`mailto:${email}`}
            className="bg-secondary text-secondary-foreground px-8 py-3 rounded-md font-semibold hover:bg-secondary-dark transition-colors inline-block"
          >
            Contact {agentName}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Schedule a Consultation
          </h2>
          <p className="text-muted-foreground">
            Book a time to discuss your real estate goals with {agentName}.
          </p>
        </div>

        {/* Meeting type tabs - only show if both options available */}
        {hasBothOptions && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setMeetingType("video")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${
                meetingType === "video"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border-2 border-border text-foreground hover:border-primary"
              }`}
            >
              <HiVideoCamera className="h-5 w-5" />
              Video Call
            </button>
            <button
              onClick={() => setMeetingType("phone")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${
                meetingType === "phone"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border-2 border-border text-foreground hover:border-primary"
              }`}
            >
              <HiPhone className="h-5 w-5" />
              Phone Call
            </button>
          </div>
        )}

        {/* Calendly embed */}
        {currentUrl && (
          <div className="bg-card rounded-xl overflow-hidden shadow-lg">
            <CalendlyEmbed url={currentUrl} />
          </div>
        )}
      </div>
    </section>
  );
}
