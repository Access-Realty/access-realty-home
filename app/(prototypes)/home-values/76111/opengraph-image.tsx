// ABOUTME: Dynamic OG image for 76111 zip code page
// ABOUTME: Branded card with key stats — renders as 1200x630 PNG

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Home Values in 76111 — Fort Worth, TX'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1e3a5f',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Diagonal accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(135deg, transparent 45%, rgba(214,178,131,0.15) 45%, rgba(214,178,131,0.08) 55%, transparent 55%)',
          }}
        />

        {/* Top bar — brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '32px 48px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ color: '#ffffff', fontSize: 22, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Direct</span>
            <span style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, fontFamily: 'sans-serif' }}>List</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'sans-serif' }}>direct-list.com</span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 48px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Location label */}
          <div
            style={{
              color: '#d6b283',
              fontSize: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontFamily: 'sans-serif',
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Fort Worth · Near Northside · Tarrant County
          </div>

          {/* Zip code */}
          <div
            style={{
              color: '#ffffff',
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            76111
          </div>

          <div
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 18,
              fontFamily: 'sans-serif',
              marginBottom: 40,
            }}
          >
            Home Values & Market Trends
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: 48,
            }}
          >
            {/* Median Price — hero stat */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontFamily: 'sans-serif',
                  marginBottom: 4,
                }}
              >
                Median Sale Price
              </span>
              <span
                style={{
                  color: '#d6b283',
                  fontSize: 48,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                $285,000
              </span>
            </div>

            {/* Supporting stats */}
            <div style={{ display: 'flex', gap: 36, alignItems: 'flex-end', paddingBottom: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 700 }}>26</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>Days on Market</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 700 }}>98.2%</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>Sale-to-List</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 700 }}>2.1 mo</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>Supply</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 48px 28px',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'sans-serif' }}>
            Data through Mar 2026 · Source: NTREIS MLS
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#d6b283',
              color: '#1e3a5f',
              padding: '8px 20px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'sans-serif',
            }}
          >
            View Market Data →
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
