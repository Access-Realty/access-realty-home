// ABOUTME: Inline Calendly embed component using react-calendly
// ABOUTME: Displays scheduling widget directly on the page

"use client";

import { InlineWidget } from "react-calendly";

interface CalendlyEmbedProps {
  url: string;
  styles?: {
    height?: string;
    minWidth?: string;
    minHeight?: string;
  };
}

export default function CalendlyEmbed({
  url,
  styles = { height: "700px", minWidth: "320px" },
}: CalendlyEmbedProps) {
  // Ensure URL has https:// prefix and add GDPR banner hiding
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const embedUrl = `${fullUrl}${fullUrl.includes("?") ? "&" : "?"}hide_gdpr_banner=1`;

  return (
    <div className="calendly-embed-container">
      <InlineWidget url={embedUrl} styles={styles} />
    </div>
  );
}
