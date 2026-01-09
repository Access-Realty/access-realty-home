// ABOUTME: Proxies Calendly API to fetch available time slots for booking
// ABOUTME: Keeps API token server-side and returns simplified slot data to frontend

import { NextRequest, NextResponse } from "next/server";

interface CalendlyAvailableTime {
  status: string;
  start_time: string;
  invitees_remaining: number;
  scheduling_url: string;
}

interface CalendlyAvailableTimesResponse {
  collection: CalendlyAvailableTime[];
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

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const startTime = searchParams.get("start_time");
  const endTime = searchParams.get("end_time");
  const eventType = searchParams.get("event_type");

  if (!eventType) {
    return NextResponse.json(
      { error: "event_type is required" },
      { status: 400 }
    );
  }

  // Validate event_type URI format
  if (!eventType.startsWith("https://api.calendly.com/event_types/")) {
    return NextResponse.json(
      { error: "Invalid event_type URI format" },
      { status: 400 }
    );
  }

  if (!startTime || !endTime) {
    return NextResponse.json(
      { error: "start_time and end_time are required" },
      { status: 400 }
    );
  }

  // Validate dates
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  // Calendly limits to 7 days max
  const diffDays =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > 7) {
    return NextResponse.json(
      { error: "Date range cannot exceed 7 days" },
      { status: 400 }
    );
  }

  try {
    const url = new URL("https://api.calendly.com/event_type_available_times");
    url.searchParams.set("event_type", eventType);
    url.searchParams.set("start_time", startDate.toISOString());
    url.searchParams.set("end_time", endDate.toISOString());

    console.log("Fetching Calendly available times:", url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Calendly API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Calendly API error", details: errorText },
        { status: response.status }
      );
    }

    const data: CalendlyAvailableTimesResponse = await response.json();

    // Return simplified slots for frontend
    const slots = data.collection
      .filter((slot) => slot.status === "available" && slot.invitees_remaining > 0)
      .map((slot) => ({
        start_time: slot.start_time,
      }));

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching available times:", error);
    return NextResponse.json(
      { error: "Failed to fetch available times" },
      { status: 500 }
    );
  }
}
