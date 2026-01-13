// ABOUTME: Creates a Calendly booking by calling the Scheduling API
// ABOUTME: Accepts invitee details and time slot, returns booking confirmation

import { NextRequest, NextResponse } from "next/server";

interface BookingRequest {
  event_type: string;
  start_time: string;
  invitee: {
    name: string;
    email: string;
    phone?: string;
    timezone?: string;
  };
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
}

interface CalendlyInviteeResponse {
  resource: {
    uri: string;
    name: string;
    email: string;
    timezone: string;
    event: string;
    created_at: string;
    updated_at: string;
    canceled: boolean;
    reschedule_url: string;
    cancel_url: string;
  };
}

interface CalendlyScheduledEventResponse {
  resource: {
    uri: string;
    name: string;
    start_time: string;
    end_time: string;
    event_type: string;
    location?: {
      type: string;
      location?: string;
    };
    event_memberships?: Array<{
      user: string;
      user_email: string;
      user_name: string;
    }>;
  };
}

interface CalendlyEventTypeResponse {
  resource: {
    uri: string;
    locations: Array<{ kind: string; location?: string }> | null;
  };
}

export async function POST(request: NextRequest) {
  const apiToken = process.env.CALENDLY_API_TOKEN;

  if (!apiToken) {
    console.error("CALENDLY_API_TOKEN not configured");
    return NextResponse.json(
      { error: "Calendly API token not configured" },
      { status: 500 }
    );
  }

  let body: BookingRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate required fields
  if (!body.event_type) {
    return NextResponse.json(
      { error: "event_type is required" },
      { status: 400 }
    );
  }

  // Validate event_type URI format
  if (!body.event_type.startsWith("https://api.calendly.com/event_types/")) {
    return NextResponse.json(
      { error: "Invalid event_type URI format" },
      { status: 400 }
    );
  }

  if (!body.start_time) {
    return NextResponse.json(
      { error: "start_time is required" },
      { status: 400 }
    );
  }

  if (!body.invitee?.name || !body.invitee?.email) {
    return NextResponse.json(
      { error: "invitee name and email are required" },
      { status: 400 }
    );
  }

  // Validate start_time format
  const startTime = new Date(body.start_time);
  if (isNaN(startTime.getTime())) {
    return NextResponse.json(
      { error: "Invalid start_time format" },
      { status: 400 }
    );
  }

  try {
    // Default timezone if not provided (America/Chicago for Texas-based business)
    const timezone = body.invitee.timezone || "America/Chicago";

    // Fetch event type to check if location is required
    let locationKind: string | null = null;
    try {
      const eventTypeResponse = await fetch(body.event_type, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      });

      if (eventTypeResponse.ok) {
        const eventTypeData: CalendlyEventTypeResponse =
          await eventTypeResponse.json();
        // If event type has locations configured, we must include location.kind in booking
        const firstLocation = eventTypeData.resource.locations?.[0];
        if (firstLocation) {
          locationKind = firstLocation.kind;
        }
      }
    } catch (eventTypeError) {
      console.warn("Failed to fetch event type details:", eventTypeError);
      // Continue without location - may fail if event type requires it
    }

    // Build the request body for Calendly API
    const calendlyRequestBody: {
      event_type: string;
      start_time: string;
      invitee: {
        name: string;
        email: string;
        timezone: string;
        text_reminder_number?: string;
      };
      location?: {
        kind: string;
        location?: string;
      };
    } = {
      event_type: body.event_type,
      start_time: startTime.toISOString(),
      invitee: {
        name: body.invitee.name,
        email: body.invitee.email,
        timezone: timezone,
      },
    };

    // Add location if event type requires it
    // These location kinds require a location.location value (phone number or address)
    const kindsRequiringLocation = ["outbound_call", "inbound_call", "ask_invitee", "physical", "custom"];
    console.log("=== BOOKING DEBUG ===");
    console.log("Location kind:", locationKind);
    console.log("Phone from request:", body.invitee.phone);
    console.log("Requires location.location:", kindsRequiringLocation.includes(locationKind || ""));

    if (locationKind) {
      if (kindsRequiringLocation.includes(locationKind) && body.invitee.phone) {
        // Format phone as E.164 for Calendly
        const digits = body.invitee.phone.replace(/\D/g, "");
        let phoneE164 = "";
        if (digits.length === 10) {
          phoneE164 = `+1${digits}`;
        } else if (digits.length === 11 && digits.startsWith("1")) {
          phoneE164 = `+${digits}`;
        } else if (digits.length > 10) {
          phoneE164 = `+${digits}`;
        }
        console.log("Formatted phone E164:", phoneE164);
        if (phoneE164) {
          calendlyRequestBody.location = { kind: locationKind, location: phoneE164 };
        } else {
          console.log("WARNING: Could not format phone, sending without location.location");
          calendlyRequestBody.location = { kind: locationKind };
        }
      } else if (kindsRequiringLocation.includes(locationKind)) {
        console.log("WARNING: Location kind requires phone but no phone provided!");
        calendlyRequestBody.location = { kind: locationKind };
      } else {
        calendlyRequestBody.location = { kind: locationKind };
      }
    }
    console.log("Final location object:", JSON.stringify(calendlyRequestBody.location));

    // Add phone number for SMS reminders if provided (must be E.164 format)
    if (body.invitee.phone) {
      // Strip non-digits and ensure E.164 format (+1XXXXXXXXXX for US)
      const digits = body.invitee.phone.replace(/\D/g, "");
      if (digits.length === 10) {
        // US number without country code
        calendlyRequestBody.invitee.text_reminder_number = `+1${digits}`;
      } else if (digits.length === 11 && digits.startsWith("1")) {
        // US number with country code
        calendlyRequestBody.invitee.text_reminder_number = `+${digits}`;
      } else if (digits.length > 10) {
        // Assume international with country code
        calendlyRequestBody.invitee.text_reminder_number = `+${digits}`;
      }
      // Skip if phone doesn't match expected formats
    }

    console.log(
      "Creating Calendly booking:",
      JSON.stringify(calendlyRequestBody, null, 2)
    );

    const response = await fetch("https://api.calendly.com/invitees", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendlyRequestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Calendly API error:", response.status, errorText);
      console.error("Request body was:", JSON.stringify(calendlyRequestBody, null, 2));

      // Parse error for better user feedback
      let errorMessage = "Failed to create booking";
      try {
        const errorJson = JSON.parse(errorText);
        // Calendly often returns details in various fields
        if (errorJson.details) {
          // Details array contains specific field errors
          const details = Array.isArray(errorJson.details)
            ? errorJson.details.map((d: { message?: string; parameter?: string }) => d.message || d.parameter).join(", ")
            : JSON.stringify(errorJson.details);
          errorMessage = details || errorJson.message || errorJson.title || errorMessage;
          console.error("Calendly error details:", errorJson.details);
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        } else if (errorJson.title) {
          errorMessage = errorJson.title;
        }
      } catch {
        // Use default error message
      }

      return NextResponse.json(
        { error: errorMessage, details: errorText },
        { status: response.status }
      );
    }

    const data: CalendlyInviteeResponse = await response.json();

    // Extract IDs from URIs
    const inviteeUri = data.resource.uri;
    const eventUri = data.resource.event;
    const inviteeId = inviteeUri.split("/").pop() || "";
    const eventId = eventUri.split("/").pop() || "";

    // Fetch the scheduled event to get start/end times and assigned host
    let startTimeResult = body.start_time;
    let endTimeResult: string | undefined;
    let assignedHost: { name: string; email: string } | undefined;

    try {
      const eventResponse = await fetch(eventUri, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      });

      if (eventResponse.ok) {
        const eventData: CalendlyScheduledEventResponse =
          await eventResponse.json();
        startTimeResult = eventData.resource.start_time;
        endTimeResult = eventData.resource.end_time;

        // Extract assigned host from event_memberships (first member is the assigned host)
        const membership = eventData.resource.event_memberships?.[0];
        if (membership) {
          assignedHost = {
            name: membership.user_name,
            email: membership.user_email,
          };
        }
      }
    } catch (eventError) {
      console.warn("Failed to fetch event details:", eventError);
      // Continue with original start_time, no end_time or host
    }

    console.log("Booking created successfully:", {
      eventId,
      inviteeId,
      assignedHost,
    });

    return NextResponse.json({
      event_id: eventId,
      invitee_id: inviteeId,
      start_time: startTimeResult,
      end_time: endTimeResult,
      assigned_host: assignedHost,
      reschedule_url: data.resource.reschedule_url,
      cancel_url: data.resource.cancel_url,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
