// components/direct-list/InvestorVettingFlow.tsx
// ABOUTME: Shared address-based investor vetting flow for /investors and /qualified-investors
// ABOUTME: Includes client-side attempt cap (3 max) and honeypot field for abuse prevention

"use client";

import { useState, useRef } from "react";
import { AddressInput } from "@/components/direct-list/AddressInput";
import type { AddressData } from "@/components/direct-list/AddressInput";
import type { InvestorVettingResponse } from "@/lib/investorVetting";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiPhone } from "react-icons/hi2";

const MAX_ATTEMPTS = 3;

type VettingState = "idle" | "loading" | "passed" | "failed" | "error" | "exhausted";

interface InvestorVettingFlowProps {
  /** Email collected by parent — required for per-email rate limiting */
  email: string;
  onPass: (parcelId: string, address: string, parcelData: { street_address?: string; city?: string; state?: string; zip?: string }) => void;
  onFail: (reason: string) => void;
  /** URL for the Book a Call fallback */
  bookCallHref?: string;
  /** Label for the address input */
  prompt?: string;
}

export function InvestorVettingFlow({
  email,
  onPass,
  onFail,
  bookCallHref = "/direct-list/investors/book",
  prompt = "Enter the property address you'd like to list",
}: InvestorVettingFlowProps) {
  const [state, setState] = useState<VettingState>("idle");
  const [address, setAddress] = useState<AddressData | null>(null);
  const [result, setResult] = useState<InvestorVettingResponse | null>(null);
  const [error, setError] = useState("");
  const attemptCount = useRef(0);
  const honeypotRef = useRef("");

  const handleAddressSelect = async (addressData: AddressData) => {
    attemptCount.current++;

    if (attemptCount.current > MAX_ATTEMPTS) {
      setState("exhausted");
      return;
    }

    setAddress(addressData);
    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/investor-vetting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          address: addressData.formattedAddress,
          website: honeypotRef.current,
        }),
      });

      if (response.status === 404) {
        setState("error");
        setError("We couldn't find that property. Please check the address and try again.");
        return;
      }

      if (response.status === 429) {
        setState("error");
        setError("Too many lookups. Please try again later or book a call.");
        return;
      }

      if (!response.ok) {
        setState("error");
        setError("Something went wrong. Please try again.");
        return;
      }

      const data: InvestorVettingResponse = await response.json();
      setResult(data);

      if (data.vetting.passed) {
        setState("passed");
        onPass(data.parcel.parcel_id, addressData.formattedAddress, {
          street_address: data.parcel.street_address,
          city: data.parcel.city,
          state: data.parcel.state,
          zip: data.parcel.zip,
        });
      } else {
        setState("failed");
        onFail(data.vetting.reason);
      }
    } catch {
      setState("error");
      setError("Something went wrong. Please try again.");
    }
  };

  const handleReset = () => {
    if (attemptCount.current >= MAX_ATTEMPTS) {
      setState("exhausted");
      return;
    }
    setState("idle");
    setAddress(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-4">
      {/* Honeypot — invisible to humans, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
        aria-hidden="true"
        onChange={(e) => { honeypotRef.current = e.target.value; }}
      />

      {/* Address Input — shown when idle or error */}
      {(state === "idle" || state === "error") && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">{prompt}</p>
          <AddressInput
            onAddressSelect={handleAddressSelect}
            placeholder="123 Main St, Fort Worth, TX"
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )}

      {/* Loading */}
      {state === "loading" && (
        <div className="flex items-center gap-3 py-6 justify-center">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Verifying property...</span>
        </div>
      )}

      {/* Passed */}
      {state === "passed" && result && (
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <HiOutlineCheckCircle className="h-6 w-6 text-green-600 shrink-0" />
            <p className="font-semibold text-green-800">Qualified for Investor Pricing</p>
          </div>
          <p className="text-sm text-green-700">
            {address?.formattedAddress}
          </p>
          {result.parcel.living_area_sqft && (
            <p className="text-xs text-green-600">
              {result.parcel.bedrooms} bed · {result.parcel.living_area_sqft?.toLocaleString()} sqft
              {result.parcel.year_built ? ` · Built ${result.parcel.year_built}` : ""}
            </p>
          )}
        </div>
      )}

      {/* Failed */}
      {state === "failed" && (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <HiOutlineXCircle className="h-6 w-6 text-amber-600 shrink-0" />
            <p className="font-semibold text-amber-800">Additional Verification Needed</p>
          </div>
          <p className="text-sm text-amber-700">
            We weren&apos;t able to automatically verify investor qualification for this property.
            Schedule a quick call and we&apos;ll get you sorted.
          </p>
          <button
            onClick={handleReset}
            className="text-sm text-primary font-medium hover:underline"
          >
            Try a different address
          </button>
        </div>
      )}

      {/* Exhausted — max attempts reached */}
      {state === "exhausted" && (
        <div className="rounded-xl border border-border bg-muted/50 p-5 text-center space-y-3">
          <p className="font-medium text-foreground">
            Having trouble qualifying?
          </p>
          <p className="text-sm text-muted-foreground">
            No worries — schedule a quick call and we&apos;ll verify your investor status personally.
          </p>
          <a
            href={bookCallHref}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            <HiPhone className="h-4 w-4" />
            Book a Call
          </a>
        </div>
      )}
    </div>
  );
}
