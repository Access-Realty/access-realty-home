// ABOUTME: API route for program inquiries and investor lead notifications
// ABOUTME: Routes Slack notifications to needs-attention (actionable) or app-audit (informational)

import { NextRequest, NextResponse } from "next/server";

type SlackChannel = "needs-attention" | "app-audit";

const SLACK_WEBHOOKS: Record<SlackChannel, string | undefined> = {
  "needs-attention": process.env.SLACK_WEBHOOK_NEEDS_ATTENTION,
  "app-audit": process.env.SLACK_WEBHOOK_APP_AUDIT,
};

interface ProgramInquiryData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programName: string;
  address: string;
  channel?: SlackChannel;
  attribution?: {
    originalTouch: string | null;
    latestTouch: string | null;
  };
}

function buildInquiryBlocks(data: ProgramInquiryData) {
  return [
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
    ...(data.attribution?.originalTouch || data.attribution?.latestTouch
      ? [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Attribution:*\n${
                data.attribution.originalTouch
                  ? `Original: ${data.attribution.originalTouch}`
                  : ""
              }${
                data.attribution.originalTouch && data.attribution.latestTouch
                  ? "\n"
                  : ""
              }${
                data.attribution.latestTouch &&
                data.attribution.latestTouch !== data.attribution.originalTouch
                  ? `Latest: ${data.attribution.latestTouch}`
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
  ];
}

function buildAuditBlocks(data: ProgramInquiryData) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Investor lead entered checkout flow: *${data.firstName} ${data.lastName}* (${data.email})`,
      },
    },
    ...(data.attribution?.originalTouch
      ? [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Source: ${data.attribution.originalTouch} | ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT`,
              },
            ],
          },
        ]
      : [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
              },
            ],
          },
        ]),
  ];
}

async function sendSlackNotification(data: ProgramInquiryData) {
  const channel: SlackChannel = data.channel || "needs-attention";
  const webhookUrl = SLACK_WEBHOOKS[channel];

  if (!webhookUrl) {
    console.log(`Slack webhook for ${channel} not configured, skipping notification`);
    return;
  }

  const blocks = channel === "app-audit"
    ? buildAuditBlocks(data)
    : buildInquiryBlocks(data);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks }),
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
    const { firstName, lastName, email, phone, programName, address, attribution, channel } = body as ProgramInquiryData;

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
      channel,
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
