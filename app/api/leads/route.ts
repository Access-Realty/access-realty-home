// ABOUTME: API route for capturing leads from DirectList get-started flow
// ABOUTME: Uses service role to bypass RLS, stores lead with parcel FK

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

  // Google tracking
  gclid?: string;
  ga4ClientId?: string;
  ga4SessionId?: string;

  // Facebook tracking
  fbclid?: string;
  fbAdId?: string;
  fbAdsetId?: string;
  fbCampaignId?: string;

  // UTM parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;

  // Analytics
  hotjarRecordingUrl?: string;
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
      gclid,
      ga4ClientId,
      ga4SessionId,
      fbclid,
      fbAdId,
      fbAdsetId,
      fbCampaignId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      hotjarRecordingUrl,
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

    // Insert lead with correct schema
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        // Contact info
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone_1: phone.replace(/\D/g, ""), // Store digits only

        // Address (parsed components)
        street: street || null,
        city: city || null,
        state: state || null,
        zip: zip || null,

        // Property FK (links to parcels table)
        parcel_id: parcelId || null,

        // Status & source
        source: validSource,
        status: "new_untouched",

        // Landing/referrer
        landing_url: landingUrl || null,

        // Google tracking
        gclid: gclid || null,
        ga4_client_id: ga4ClientId || null,
        ga4_session_id: ga4SessionId || null,

        // Facebook tracking
        fbclid: fbclid || null,
        fb_ad_id: fbAdId || null,
        fb_adset_id: fbAdsetId || null,
        fb_campaign_id: fbCampaignId || null,

        // UTM parameters
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        utm_term: utmTerm || null,
        utm_content: utmContent || null,

        // Analytics
        hotjar_recording_url: hotjarRecordingUrl || null,
      })
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
          .insert({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone_1: phone.replace(/\D/g, ""),
            street: street || null,
            city: city || null,
            state: state || null,
            zip: zip || null,
            parcel_id: null, // Skip invalid parcel
            source: validSource,
            status: "new_untouched",
            landing_url: landingUrl || null,
            gclid: gclid || null,
            ga4_client_id: ga4ClientId || null,
            ga4_session_id: ga4SessionId || null,
            fbclid: fbclid || null,
            fb_ad_id: fbAdId || null,
            fb_adset_id: fbAdsetId || null,
            fb_campaign_id: fbCampaignId || null,
            utm_source: utmSource || null,
            utm_medium: utmMedium || null,
            utm_campaign: utmCampaign || null,
            utm_term: utmTerm || null,
            utm_content: utmContent || null,
            hotjar_recording_url: hotjarRecordingUrl || null,
          })
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
