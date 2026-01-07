// ABOUTME: API route for capturing leads from DirectList get-started flow
// ABOUTME: Uses service role to bypass RLS, stores lead with parcel FK
// ABOUTME: Supports multi-touch attribution (first touch, latest touch, converting touch)

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Valid source values per DB constraint
type LeadSource =
  | "website"
  | "referral"
  | "seo"
  | "paid_search"
  | "social_media"
  | "direct_mail"
  | "cold_call"
  | "zillow"
  | "realtor_com"
  | "other";

// Tracking params for multi-touch attribution
interface TouchParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_url?: string;
  captured_at?: string;
}

interface LeadPayload {
  // Contact info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Address components
  street?: string;
  city?: string;
  state?: string;
  zip?: string;

  // Property link
  parcelId?: string;

  // Tracking
  source?: LeadSource;
  landingUrl?: string;

  // Multi-touch attribution
  originalTouch?: TouchParams;
  latestTouch?: TouchParams;
  convertingTouch?: TouchParams;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadPayload = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zip,
      parcelId,
      source,
      landingUrl,
      originalTouch,
      latestTouch,
      convertingTouch,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "First name, last name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Determine source - map known sources or default to website
    const validSource: LeadSource = source && isValidSource(source) ? source : "website";

    // Get admin client (bypasses RLS)
    const supabaseAdmin = getSupabaseAdmin();

    const now = new Date().toISOString();

    // Build insert payload
    const leadData = {
      // Contact info
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone_1: phone.replace(/\D/g, ""),

      // Address
      street: street || null,
      city: city || null,
      state: state || null,
      zip: zip || null,

      // Property FK
      parcel_id: parcelId || null,

      // Status & source
      source: validSource,
      status: "new_untouched",

      // Landing URL
      landing_url: landingUrl || convertingTouch?.landing_url || null,

      // Original touch attribution (first touch, protected from remarketing/nurture)
      original_source: originalTouch?.utm_source || null,
      original_medium: originalTouch?.utm_medium || null,
      original_campaign: originalTouch?.utm_campaign || null,
      original_term: originalTouch?.utm_term || null,
      original_content: originalTouch?.utm_content || null,
      original_touch_at: originalTouch?.captured_at || null,

      // Latest touch attribution (uses existing utm_* columns)
      utm_source: latestTouch?.utm_source || null,
      utm_medium: latestTouch?.utm_medium || null,
      utm_campaign: latestTouch?.utm_campaign || null,
      utm_term: latestTouch?.utm_term || null,
      utm_content: latestTouch?.utm_content || null,

      // Converting touch (at form submission)
      converting_source: convertingTouch?.utm_source || null,
      converting_medium: convertingTouch?.utm_medium || null,
      converting_campaign: convertingTouch?.utm_campaign || null,
      converting_term: convertingTouch?.utm_term || null,
      converted_at: now,

      // Click IDs (prefer original touch for attribution)
      gclid: originalTouch?.gclid || convertingTouch?.gclid || null,
      fbclid: originalTouch?.fbclid || convertingTouch?.fbclid || null,
    };

    // Insert lead
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert(leadData)
      .select("id, email")
      .single();

    if (error) {
      console.error("Lead insert error:", error);

      // Handle unique constraint violation (duplicate email)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already registered. We'll be in touch soon!" },
          { status: 409 }
        );
      }

      // Handle FK violation (invalid parcel_id)
      if (error.code === "23503") {
        console.error("Invalid parcel_id FK:", parcelId);
        // Retry without parcel_id
        const { data: retryData, error: retryError } = await supabaseAdmin
          .from("leads")
          .insert({ ...leadData, parcel_id: null })
          .select("id, email")
          .single();

        if (retryError) {
          console.error("Lead retry insert error:", retryError);
          return NextResponse.json(
            { error: "Failed to save lead" },
            { status: 500 }
          );
        }

        console.log("Lead captured (without parcel):", retryData.id, retryData.email);
        return NextResponse.json({
          success: true,
          leadId: retryData.id,
        });
      }

      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    console.log("Lead captured:", data.id, data.email, parcelId ? `parcel:${parcelId}` : "");

    return NextResponse.json({
      success: true,
      leadId: data.id,
    });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function isValidSource(source: string): source is LeadSource {
  const validSources: LeadSource[] = [
    "website", "referral", "seo", "paid_search", "social_media",
    "direct_mail", "cold_call", "zillow", "realtor_com", "other"
  ];
  return validSources.includes(source as LeadSource);
}
