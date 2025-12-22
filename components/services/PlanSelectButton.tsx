// ABOUTME: Client component for plan selection buttons that trigger Stripe Checkout
// ABOUTME: Handles API call to create checkout session and redirects to Stripe
// ABOUTME: Captures UTM parameters from URL for marketing attribution

"use client";

import { useState } from "react";

// Standard UTM parameter names
const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

// Extract UTM parameters from current URL
function getUTMParams(): UTMData {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utmData: UTMData = {};

  for (const param of UTM_PARAMS) {
    const value = params.get(param);
    if (value) {
      utmData[param] = value;
    }
  }

  return utmData;
}

interface PlanSelectButtonProps {
  planId: string; // e.g., "direct-list", "direct-list-plus", "full-service"
  className?: string;
  children: React.ReactNode;
}

export function PlanSelectButton({
  planId,
  className = "",
  children,
}: PlanSelectButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    // Capture UTM params at the moment of click
    const utmParams = getUTMParams();

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planId,
          source: "services-page",
          utmParams,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      // Redirect to Stripe Checkout or app signup
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${className} ${loading ? "opacity-70 cursor-wait" : ""}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
      {error && (
        <span className="block text-xs text-red-500 mt-1">{error}</span>
      )}
    </button>
  );
}
