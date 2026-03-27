// ABOUTME: Default OG image for Solutions pages
// ABOUTME: Branded 1200x630 card — cascades to all /solutions/* routes

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Selling Solutions — Access Realty";
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
          backgroundColor: "#284b70",
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
              "linear-gradient(135deg, transparent 40%, rgba(214,178,131,0.12) 40%, rgba(214,178,131,0.06) 55%, transparent 55%)",
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
                fontSize: 28,
                fontStyle: "italic",
                fontFamily: "Georgia, serif",
              }}
            >
              Access
            </span>
            <span
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontWeight: 700,
                fontFamily: "sans-serif",
              }}
            >
              Realty
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              color: "#d6b283",
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 24,
              maxWidth: "70%",
            }}
          >
            Selling Solutions
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 22,
              fontFamily: "sans-serif",
              maxWidth: "65%",
              lineHeight: 1.5,
            }}
          >
            Creative strategies for every seller situation in Dallas–Fort Worth.
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
            access.realty/solutions
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#d6b283",
              color: "#284b70",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "sans-serif",
            }}
          >
            Explore Options →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
