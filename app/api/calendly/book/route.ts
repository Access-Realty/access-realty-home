// ABOUTME: Creates a Calendly booking by calling the Scheduling API
// ABOUTME: Accepts invitee details and time slot, returns booking confirmation

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  // Context for freeform "anything to help prepare" questions
  context?: {
    programName?: string; // e.g., "Price Launch"
    propertyAddress?: string; // e.g., "123 Main St, Dallas, TX 75001"
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

interface CalendlyCustomQuestion {
  name: string;
  type: string;
  position: number;
  enabled: boolean;
  required: boolean;
}

interface CalendlyEventTypeResponse {
  resource: {
    uri: string;
    locations: Array<{ kind: string; location?: string }> | null;
    custom_questions?: CalendlyCustomQuestion[];
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

    // Fetch event type to check if location and custom questions are required
    let locationKind: string | null = null;
    let customQuestions: CalendlyCustomQuestion[] = [];
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
        // Get custom questions (filter to enabled only)
        customQuestions = (eventTypeData.resource.custom_questions || []).filter(
          (q) => q.enabled
        );
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
      questions_and_answers?: Array<{
        question: string;
        answer: string;
        position: number;
      }>;
    } = {
      event_type: body.event_type,
      start_time: startTime.toISOString(),
      invitee: {
        name: body.invitee.name,
        email: body.invitee.email,
        timezone: timezone,
      },
    };

    // Build questions_and_answers if event type has custom questions
    if (customQuestions.length > 0) {
      const questionsAndAnswers: Array<{ question: string; answer: string; position: number }> = [];

      for (const q of customQuestions) {
        let answer = "";

        // Map known question types to our collected data
        if (q.type === "phone_number" && body.invitee.phone) {
          // Phone number question - format as E.164
          const digits = body.invitee.phone.replace(/\D/g, "");
          if (digits.length === 10) {
            answer = `+1${digits}`;
          } else if (digits.length === 11 && digits.startsWith("1")) {
            answer = `+${digits}`;
          } else if (digits.length > 10) {
            answer = `+${digits}`;
          }
        } else if (q.name.toLowerCase().includes("phone") && body.invitee.phone) {
          // Fallback: question name contains "phone"
          const digits = body.invitee.phone.replace(/\D/g, "");
          if (digits.length === 10) {
            answer = `+1${digits}`;
          } else if (digits.length === 11 && digits.startsWith("1")) {
            answer = `+${digits}`;
          } else if (digits.length > 10) {
            answer = `+${digits}`;
          }
        } else if (q.name.toLowerCase().includes("solution") || q.name.toLowerCase().includes("program")) {
          // Map solution/program question to context or utm_source
          if (body.context?.programName) {
            answer = body.context.programName;
          } else if (body.utm?.utm_source && body.utm.utm_source !== "marketing_site") {
            // Fallback: format slug nicely: "price-launch" -> "Price Launch"
            answer = body.utm.utm_source
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
        } else if (q.type === "text" && (q.name.toLowerCase().includes("anything") || q.name.toLowerCase().includes("prepare") || q.name.toLowerCase().includes("help"))) {
          // Freeform "anything to help prepare" question - only populate for inquiry bookings
          // (when context is explicitly provided)
          if (body.context?.programName || body.context?.propertyAddress) {
            const parts: string[] = [];
            if (body.context.programName) {
              parts.push(`Program: ${body.context.programName}`);
            }
            if (body.context.propertyAddress) {
              parts.push(`Property: ${body.context.propertyAddress}`);
            }
            // Include phone for field staff quick reference
            if (body.invitee.phone) {
              const digits = body.invitee.phone.replace(/\D/g, "");
              if (digits.length >= 10) {
                const formatted = digits.length === 10
                  ? `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
                  : `+${digits}`;
                parts.push(`Phone: ${formatted}`);
              }
            }
            answer = parts.join("\n");
          }
        }
        // Skip non-required questions we don't have answers for
        if (!answer && !q.required) {
          continue;
        }

        questionsAndAnswers.push({
          question: q.name,
          answer: answer,
          position: q.position,
        });
      }

      if (questionsAndAnswers.length > 0) {
        calendlyRequestBody.questions_and_answers = questionsAndAnswers;
        console.log("Questions and answers:", JSON.stringify(questionsAndAnswers, null, 2));
      }
    }

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

    // Fetch the scheduled event to get start/end times, assigned host, and location
    let startTimeResult = body.start_time;
    let endTimeResult: string | undefined;
    let assignedHost: { name: string; email: string } | undefined;
    let locationResult: { type: string; location?: string } | undefined;

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

        // Extract location info
        if (eventData.resource.location) {
          locationResult = {
            type: eventData.resource.location.type,
            location: eventData.resource.location.location,
          };
        }
      }
    } catch (eventError) {
      console.warn("Failed to fetch event details:", eventError);
      // Continue with original start_time, no end_time, host, or location
    }

    console.log("Booking created successfully:", {
      eventId,
      inviteeId,
      assignedHost,
      location: locationResult,
    });

    // Create crm_meetings record if this booking is linked to a lead
    const leadId = body.utm?.utm_content;
    if (leadId) {
      await createMeetingForLead({
        leadId,
        eventId,
        inviteeId,
        startTime: startTimeResult,
        endTime: endTimeResult,
        programSource: body.utm?.utm_source,
        inviteeName: body.invitee.name,
        rescheduleUrl: data.resource.reschedule_url,
        cancelUrl: data.resource.cancel_url,
        locationType: locationResult?.type ?? null,
        locationDetails: locationResult?.location ?? null,
        inviteeTimezone: body.invitee.timezone || "America/Chicago",
      });
    }

    return NextResponse.json({
      event_id: eventId,
      invitee_id: inviteeId,
      start_time: startTimeResult,
      end_time: endTimeResult,
      assigned_host: assignedHost,
      location: locationResult,
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

/**
 * Create a crm_meetings record linked to a marketing lead after successful Calendly booking.
 * Non-blocking: logs errors but never throws (booking already succeeded).
 */
async function createMeetingForLead(params: {
  leadId: string;
  eventId: string;
  inviteeId: string;
  startTime: string;
  endTime?: string;
  programSource?: string;
  inviteeName: string;
  rescheduleUrl: string;
  cancelUrl: string;
  locationType: string | null;
  locationDetails: string | null;
  inviteeTimezone: string;
}): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase credentials not configured, skipping meeting creation");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Verify lead exists
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, first_name, last_name")
      .eq("id", params.leadId)
      .single();

    if (leadError || !lead) {
      console.error(`Lead ${params.leadId} not found:`, leadError);
      return;
    }

    // Check idempotency — meeting may already exist from a retry
    const { data: existingMeeting } = await supabase
      .from("crm_meetings")
      .select("id")
      .eq("calendly_event_id", params.eventId)
      .maybeSingle();

    if (existingMeeting) {
      console.log(`Meeting already exists for Calendly event ${params.eventId}`);
      return;
    }

    const leadName = `${lead.first_name || ""} ${lead.last_name || ""}`.trim();
    const programLabel = params.programSource === "price_launch"
      ? "Price Launch"
      : params.programSource && params.programSource !== "marketing_site"
        ? params.programSource.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        : "Program";

    const { error: insertError } = await supabase.from("crm_meetings").insert({
      lead_id: params.leadId,
      consultation_type: "inquiry",
      meeting_type: "phone",
      calendly_event_id: params.eventId,
      calendly_invitee_id: params.inviteeId,
      scheduled_at: params.startTime,
      end_time: params.endTime || null,
      status: "scheduled",
      reschedule_url: params.rescheduleUrl,
      cancel_url: params.cancelUrl,
      location_type: params.locationType,
      location_details: params.locationDetails,
      invitee_timezone: params.inviteeTimezone,
      notes: `${programLabel} inquiry — ${leadName}. Booked via marketing site.`,
    });

    if (insertError) {
      console.error("Failed to create meeting for lead:", insertError);
      return;
    }

    console.log(`Created meeting for lead ${params.leadId}, Calendly event ${params.eventId}`);

    // Update lead status to contacted
    const { error: updateError } = await supabase
      .from("leads")
      .update({ status: "contacted" })
      .eq("id", params.leadId);

    if (updateError) {
      console.error("Failed to update lead status:", updateError);
    }
  } catch (error) {
    console.error("Error creating meeting for lead:", error);
  }
}
