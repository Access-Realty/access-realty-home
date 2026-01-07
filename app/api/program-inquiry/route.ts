// ABOUTME: API route for Solutions program inquiries (Price Launch, 2% Payment, etc.)
// ABOUTME: Sends Slack notification to needs-attention channel

import { NextRequest, NextResponse } from "next/server";

interface ProgramInquiryData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programName: string;
  address: string;
  attribution?: {
    firstTouch: string | null;
    latestTouch: string | null;
  };
}

async function sendSlackNotification(data: ProgramInquiryData) {
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
          text: "New Program Inquiry",
          emoji: false,
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
            text: `*Program:*\n${data.programName}`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Email:*\n<mailto:${data.email}|${data.email}>`,
          },
          {
            type: "mrkdwn",
            text: `*Phone:*\n${data.phone}`,
          },
        ],
      },
      ...(data.address
        ? [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Property:*\n${data.address}`,
              },
            },
          ]
        : []),
      // Attribution info (if available)
      ...(data.attribution?.firstTouch || data.attribution?.latestTouch
        ? [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Attribution:*\n${
                  data.attribution.firstTouch
                    ? `First touch: ${data.attribution.firstTouch}`
                    : ""
                }${
                  data.attribution.firstTouch && data.attribution.latestTouch
                    ? "\n"
                    : ""
                }${
                  data.attribution.latestTouch &&
                  data.attribution.latestTouch !== data.attribution.firstTouch
                    ? `Latest touch: ${data.attribution.latestTouch}`
                    : ""
                }`,
              },
            },
          ]
        : []),
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Submitted via access.realty/solutions/${data.programName.toLowerCase().replace(/\s+/g, "-")} | ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT`,
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
    const { firstName, lastName, email, phone, programName, address, attribution } = body as ProgramInquiryData;

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !programName?.trim()) {
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

    // Send Slack notification
    await sendSlackNotification({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      programName: programName.trim(),
      address: address?.trim() || "",
      attribution,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Program inquiry submission failed:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}
