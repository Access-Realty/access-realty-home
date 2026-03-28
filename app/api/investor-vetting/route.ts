// app/api/investor-vetting/route.ts
// ABOUTME: API route that looks up property data and runs investor vetting logic
// ABOUTME: Requires email (contact gate) and limits vetting attempts per email address

import { NextRequest, NextResponse } from "next/server";
import { vetInvestor, type InvestorVettingResponse } from "@/lib/investorVetting";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// --- Per-email rate limiting ---
const MAX_ATTEMPTS_PER_EMAIL = 5;
const WINDOW_MS = 24 * 60 * 60_000; // 24 hours
const emailBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(email: string): boolean {
  const key = email.toLowerCase().trim();
  const now = Date.now();
  const bucket = emailBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    emailBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count++;
  return bucket.count > MAX_ATTEMPTS_PER_EMAIL;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // --- Honeypot check: reject bots that fill hidden fields ---
    if (body.website) {
      return NextResponse.json({ error: "Verification failed" }, { status: 422 });
    }

    // --- Contact gate: email is required ---
    const { email, address, street, city, state, zip } = body;
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required for property verification" },
        { status: 400 }
      );
    }

    // --- Per-email rate limit ---
    if (isRateLimited(email)) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please book a call instead." },
        { status: 429 }
      );
    }

    if (!address && (!street || !city || !state)) {
      return NextResponse.json(
        { error: "Address or address components (street, city, state) required" },
        { status: 400 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }

    // Call parcel-lookup Edge Function with upsert to persist parcel data for lead linkage.
    // Always fetches fresh BatchData (upsert overwrites any cached row).
    const response = await fetch(`${SUPABASE_URL}/functions/v1/parcel-lookup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        ...(address ? { address } : { street, city, state, zip }),
        upsert: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Property not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Property lookup failed" },
        { status: response.status }
      );
    }

    const parcelData = await response.json();

    // Run vetting logic
    const vetting = vetInvestor({
      owner_status_type: parcelData.owner_status_type,
      ql_corporate_owned: parcelData.ql_corporate_owned,
      ql_trust_owned: parcelData.ql_trust_owned,
      last_transfer_date: parcelData.last_transfer_date,
      raw_response: parcelData.raw_response,
    });

    return NextResponse.json({
      vetting,
      parcel: {
        parcel_id: parcelData.parcel_id,
        street_address: parcelData.street_address,
        city: parcelData.city,
        state: parcelData.state,
        zip: parcelData.zip,
        bedrooms: parcelData.bedrooms,
        bathrooms_total: parcelData.bathrooms_total,
        living_area_sqft: parcelData.living_area_sqft,
        year_built: parcelData.year_built,
        avm_value: parcelData.avm_value,
        owner_1_full_name: parcelData.owner_1_full_name,
      },
    } satisfies InvestorVettingResponse);
  } catch (error) {
    console.error("Investor vetting error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
