// ABOUTME: Calendly webhook handler for booking events from marketing site
// ABOUTME: Verifies signatures and creates crm_meetings linked to leads via lead_id FK

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";

interface CalendlyWebhookPayload {
  event: string;
  created_at: string;
  created_by: string;
  payload: {
    uri: string;
    name?: string;
    status?: string;
    start_time?: string;
    end_time?: string;
    event_type?: {
      uuid: string;
      name: string;
    };
    invitee?: {
      uri: string;
      name: string;
      email: string;
      timezone: string;
    };
    questions_and_answers?: Array<{
      question: string;
      answer: string;
    }>;
    tracking?: {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_content?: string; // Contains lead_id
      utm_term?: string;
    };
    scheduled_event?: {
      uri: string;
      name?: string;
      start_time?: string;
      end_time?: string;
    };
    cancellation?: {
      canceled_by: string;
      reason?: string;
    };
  };
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("calendly-webhook-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Get raw body for signature verification
  const rawBody = await request.text();

  // Verify signature
  const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CALENDLY_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Calendly signature format: t=timestamp,v1=signature
  const signatureParts = signature.split(",");
  const timestamp = signatureParts
    .find((p) => p.startsWith("t="))
    ?.replace("t=", "");
  const providedSignature = signatureParts
    .find((p) => p.startsWith("v1="))
    ?.replace("v1=", "");

  if (!timestamp || !providedSignature) {
    console.error("Invalid signature format");
    return NextResponse.json(
      { error: "Invalid signature format" },
      { status: 400 }
    );
  }

  // Create expected signature
  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(providedSignature),
      Buffer.from(expectedSignature)
    )
  ) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Parse the body
  let payload: CalendlyWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("Failed to parse webhook body");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Initialize Supabase client with service role
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase credentials not configured");
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const eventUri =
    payload.payload.scheduled_event?.uri || payload.payload.uri;

  console.log(`Received Calendly webhook: ${payload.event} (${eventUri})`);

  // Process the event
  try {
    switch (payload.event) {
      case "invitee.created":
        await handleInviteeCreated(payload, supabase);
        break;
      case "invitee.canceled":
        await handleInviteeCanceled(payload, supabase);
        break;
      default:
        console.log(`Unhandled Calendly event type: ${payload.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    console.error(`Error processing Calendly event:`, error.message);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

async function handleInviteeCreated(
  webhookPayload: CalendlyWebhookPayload,
  supabase: any
) {
  const { payload } = webhookPayload;
  const tracking = payload.tracking;
  const invitee = payload.invitee;
  const scheduledEvent = payload.scheduled_event;

  // Extract IDs from URIs
  const eventUri = scheduledEvent?.uri || payload.uri;
  const inviteeUri = invitee?.uri || payload.uri;
  const eventId = eventUri.split("/").pop() || "";
  const inviteeId = inviteeUri.split("/").pop() || "";

  console.log(`Processing invitee.created: event=${eventId}, invitee=${inviteeId}`);

  // Extract lead_id from utm_content (this is how we link meetings to leads)
  const leadId = tracking?.utm_content;
  const programSource = tracking?.utm_source; // e.g., "price_launch"

  if (!leadId) {
    console.log(`No lead_id in utm_content for event ${eventId}, skipping meeting creation`);
    return;
  }

  // Verify lead exists
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id, first_name, last_name")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    console.error(`Lead ${leadId} not found:`, leadError);
    return;
  }

  // Check if meeting already exists (idempotency)
  const { data: existingMeeting } = await supabase
    .from("crm_meetings")
    .select("id")
    .eq("calendly_event_id", eventId)
    .single();

  if (existingMeeting) {
    console.log(`Meeting already exists for event ${eventId}`);
    return;
  }

  // Create meeting linked to lead
  const startTime = scheduledEvent?.start_time;
  const endTime = scheduledEvent?.end_time;

  const leadName = `${lead.first_name || ""} ${lead.last_name || ""}`.trim();

  const { error: insertError } = await supabase.from("crm_meetings").insert({
    lead_id: leadId,
    consultation_type: "inquiry",
    meeting_type: "phone",
    calendly_event_id: eventId,
    calendly_invitee_id: inviteeId,
    scheduled_at: startTime,
    end_time: endTime,
    status: "scheduled",
    notes: `${programSource === "price_launch" ? "Price Launch" : "Program"} inquiry — ${leadName}. Booked via marketing site.`,
  });

  if (insertError) {
    console.error("Failed to create meeting:", insertError);
    throw insertError;
  }

  console.log(`Created meeting for lead ${leadId}, event ${eventId}`);

  // Update lead status to contacted since they booked a meeting
  await supabase
    .from("leads")
    .update({ status: "contacted" })
    .eq("id", leadId);
}

async function handleInviteeCanceled(
  webhookPayload: CalendlyWebhookPayload,
  supabase: any
) {
  const { payload } = webhookPayload;
  const scheduledEvent = payload.scheduled_event;
  const eventUri = scheduledEvent?.uri || payload.uri;
  const eventId = eventUri.split("/").pop() || "";

  console.log(`Processing invitee.canceled: event=${eventId}`);

  const cancellation = payload.cancellation;

  // Find meeting by calendly_event_id
  const { data: meeting, error: findError } = await supabase
    .from("crm_meetings")
    .select("id")
    .eq("calendly_event_id", eventId)
    .single();

  if (findError || !meeting) {
    console.log(`No meeting found for Calendly event ${eventId}`);
    return;
  }

  // Mark meeting as cancelled with reason and timestamp
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("crm_meetings")
    .update({
      status: "cancelled",
      cancellation_reason: cancellation?.reason || null,
      canceled_at: now,
      updated_at: now,
    })
    .eq("id", meeting.id);

  if (error) {
    console.error("Failed to update meeting status:", error);
    throw error;
  }

  console.log(`Marked meeting ${meeting.id} as cancelled (Calendly event: ${eventId})`);
}
