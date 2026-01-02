// ABOUTME: API route to handle contact form submissions
// ABOUTME: Saves inquiry to Supabase and sends Slack notification to needs-attention channel

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  inquiry: string;
}

async function sendSlackNotification(data: ContactFormData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_NEEDS_ATTENTION;

  if (!webhookUrl) {
    console.log("Slack webhook not configured, skipping notification");
    return;
  }

  const message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: ":email: New Contact Form Inquiry",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Name:*\n${data.firstName} ${data.lastName}`,
          },
          {
            type: "mrkdwn",
            text: `*Email:*\n<mailto:${data.email}|${data.email}>`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Inquiry:*\n${data.inquiry}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Submitted via access.realty/contact • ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT`,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Slack notification failed:", response.status);
    }
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, inquiry } = body as ContactFormData;

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !inquiry?.trim()) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Save to Supabase
    const { error: dbError } = await supabase.from("inquiries").insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      inquiry: inquiry.trim(),
      source: "contact-page",
    });

    if (dbError) {
      console.error("Failed to save inquiry to database:", dbError);
      // Continue anyway - we still want to send Slack notification
    }

    // Send Slack notification
    await sendSlackNotification({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      inquiry: inquiry.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}
