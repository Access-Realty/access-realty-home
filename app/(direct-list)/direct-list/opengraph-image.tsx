// ABOUTME: Default OG image for all DirectList pages
// ABOUTME: Branded 1200x630 card — cascades to child routes unless overridden

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DirectList — Flat-Fee MLS Listing in DFW";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1e3a5f",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Diagonal accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "45%",
            height: "100%",
            background:
              "linear-gradient(135deg, transparent 40%, rgba(214,178,131,0.15) 40%, rgba(214,178,131,0.08) 55%, transparent 55%)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "64px 56px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "2px",
              marginBottom: 32,
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontSize: 36,
                fontStyle: "italic",
                fontFamily: "Georgia, serif",
              }}
            >
              Direct
            </span>
            <span
              style={{
                color: "#ffffff",
                fontSize: 36,
                fontWeight: 700,
                fontFamily: "sans-serif",
              }}
            >
              List
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              color: "#d6b283",
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 24,
              maxWidth: "70%",
            }}
          >
            Flat-Fee MLS Listing
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 22,
              fontFamily: "sans-serif",
              maxWidth: "65%",
              lineHeight: 1.5,
              marginBottom: 40,
            }}
          >
            Professional photos, full syndication, and expert support — without the 6% commission.
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 48 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#d6b283",
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                $495
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontFamily: "sans-serif",
                  marginTop: 4,
                }}
              >
                Upfront
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#ffffff",
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                72 hrs
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontFamily: "sans-serif",
                  marginTop: 4,
                }}
              >
                MLS Activation
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#ffffff",
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                100%
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontFamily: "sans-serif",
                  marginTop: 4,
                }}
              >
                Your Control
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 56px 36px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 16,
              fontFamily: "sans-serif",
            }}
          >
            direct-list.com
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#d6b283",
              color: "#1e3a5f",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "sans-serif",
            }}
          >
            Get Started →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
