// ABOUTME: Client component button that opens Calendly's native popup
// ABOUTME: Used in staff page hero section

"use client";

import { useCallback } from "react";
import { HiCalendarDays } from "react-icons/hi2";

// Calendly global type
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface BookOnlineButtonProps {
  calendlyUrl: string;
  className?: string;
}

export function BookOnlineButton({ calendlyUrl, className }: BookOnlineButtonProps) {
  const openCalendlyPopup = useCallback(() => {
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
    <button
      onClick={openCalendlyPopup}
      className={className}
    >
      <HiCalendarDays className="h-5 w-5" />
      Book Online
    </button>
  );
}
