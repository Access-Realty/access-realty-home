// ABOUTME: Modal component wrapping Stripe's EmbeddedCheckout for seamless payment
// ABOUTME: Keeps users on access.realty during checkout instead of redirecting to Stripe

"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { HiXMark } from "react-icons/hi2";

// Initialize Stripe outside component to avoid recreation
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface EmbeddedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
  planName: string;
  source?: string;
  utmParams?: UTMParams;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

export function EmbeddedCheckoutModal({
  isOpen,
  onClose,
  plan,
  planName,
  source = "services-page",
  utmParams,
  onSuccess,
  onError,
}: EmbeddedCheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch client secret when modal opens
  useEffect(() => {
    if (isOpen && !clientSecret && !loading) {
      setLoading(true);
      setError(null);

      fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          source,
          utmParams,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to create checkout session");
          return res.json();
        })
        .then((data) => {
          if (data.noPaymentRequired && data.redirectUrl) {
            // Full Service - no payment needed, redirect to app
            window.location.href = data.redirectUrl;
          } else if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            throw new Error("No client secret returned");
          }
        })
        .catch((err) => {
          console.error("Checkout session error:", err);
          const errorMsg = err instanceof Error ? err.message : "Failed to load checkout";
          setError(errorMsg);
          onError?.(errorMsg);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, plan, source, utmParams, clientSecret, loading, onError]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Handle checkout completion
  const handleComplete = useCallback(() => {
    // Payment completed - Stripe will redirect to return_url
    // The onSuccess callback can be used for analytics tracking
    onSuccess?.("completed");
  }, [onSuccess]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="checkout-title" className="text-lg font-semibold text-gray-900">
            Complete Your {planName} Purchase
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close checkout"
          >
            <HiXMark className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-600 mb-4 text-center">{error}</div>
              <button
                onClick={() => {
                  setError(null);
                  setClientSecret(null);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : loading || !clientSecret ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
              <p className="text-gray-500">Loading checkout...</p>
            </div>
          ) : (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                clientSecret,
                onComplete: handleComplete,
              }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  );
}
