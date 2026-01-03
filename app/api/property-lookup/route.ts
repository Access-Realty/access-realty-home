// ABOUTME: API route that proxies to Supabase parcel-lookup Edge Function
// ABOUTME: Stores parcel in shared DB to avoid duplicate BatchData calls

import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Response from parcel-lookup Edge Function
interface ParcelLookupResponse {
  parcel_id?: string;
  cached?: boolean;
  address_hash?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string;
  full_address?: string;
  latitude?: number;
  longitude?: number;
  property_type_detail?: string;
  living_area_sqft?: number;
  bedrooms?: number;
  bathrooms_full?: number;
  bathrooms_total?: number;
  stories?: number;
  lot_size_acres?: number;
  year_built?: number;
  avm_value?: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, street, city, state, zip } = body;

    // Require either full address or components
    if (!address && (!street || !city || !state)) {
      return NextResponse.json(
        { error: "Address or address components (street, city, state) required" },
        { status: 400 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Supabase credentials not configured");
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }

    console.log("Calling parcel-lookup Edge Function for:", address || `${street}, ${city}, ${state}`);

    // Call the Supabase Edge Function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/parcel-lookup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        // Pass address string or components
        ...(address ? { address } : { street, city, state, zip }),
        // Always upsert to store in shared DB
        upsert: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge Function error:", response.status, errorText);

      if (response.status === 404) {
        return NextResponse.json({ error: "Property not found" }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Property lookup failed" },
        { status: response.status }
      );
    }

    const parcelData: ParcelLookupResponse = await response.json();

    console.log(
      "Parcel lookup successful:",
      parcelData.parcel_id,
      parcelData.cached ? "(cached)" : "(fresh)"
    );

    return NextResponse.json(parcelData);
  } catch (error) {
    console.error("Property lookup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
