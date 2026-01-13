// ABOUTME: Fetches Calendly event type details (duration, name, locations)
// ABOUTME: Used by CalendlyBooking component to display accurate event information

import { NextRequest, NextResponse } from "next/server";

interface CalendlyCustomQuestion {
  name: string;
  type: string;
  position: number;
  enabled: boolean;
  required: boolean;
  answer_choices?: string[];
}

interface CalendlyEventTypeResponse {
  resource: {
    uri: string;
    name: string;
    duration: number;
    locations: Array<{ kind: string; location?: string }> | null;
    custom_questions?: CalendlyCustomQuestion[];
  };
}

// Map Calendly location kinds to human-readable names
function mapLocationKind(kind: string): string {
  const kindMap: Record<string, string> = {
    google_conference: "Google Meet",
    zoom: "Zoom",
    microsoft_teams_conference: "Microsoft Teams",
    webex_conference: "Webex",
    gotomeeting_conference: "GoToMeeting",
    physical: "In-person",
    inbound_call: "Phone (you call us)",
    outbound_call: "Phone (we call you)",
    custom: "Virtual Meeting",
  };
  return kindMap[kind] || "Video call";
}

export async function GET(request: NextRequest) {
  const apiToken = process.env.CALENDLY_API_TOKEN;

  if (!apiToken) {
    console.error("CALENDLY_API_TOKEN not configured");
    return NextResponse.json(
      { error: "Calendly API token not configured" },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const uri = searchParams.get("uri");

  if (!uri) {
    return NextResponse.json(
      { error: "uri parameter is required" },
      { status: 400 }
    );
  }

  // Validate event_type URI format
  if (!uri.startsWith("https://api.calendly.com/event_types/")) {
    return NextResponse.json(
      { error: "Invalid event_type URI format" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(uri, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Calendly API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch event type" },
        { status: response.status }
      );
    }

    const data: CalendlyEventTypeResponse = await response.json();

    // Map locations to include human-readable names
    const locations = data.resource.locations?.map((loc) => ({
      kind: loc.kind,
      location: loc.location,
      displayName: mapLocationKind(loc.kind),
    }));

    // Filter and map custom questions (only enabled ones)
    const customQuestions = (data.resource.custom_questions || [])
      .filter((q) => q.enabled)
      .map((q) => ({
        name: q.name,
        type: q.type,
        position: q.position,
        required: q.required,
        answerChoices: q.answer_choices || null,
      }));

    return NextResponse.json({
      uri: data.resource.uri,
      name: data.resource.name,
      duration: data.resource.duration,
      locations: locations || [],
      customQuestions,
    });
  } catch (error) {
    console.error("Error fetching event type:", error);
    return NextResponse.json(
      { error: "Failed to fetch event type" },
      { status: 500 }
    );
  }
}
