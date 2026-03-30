import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'otopro - Premium Mobile Car Detailing'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111111',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Accent gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(58, 130, 255, 0.15) 0%, transparent 60%)',
            display: 'flex',
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-2px',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          otopro
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#94908d',
            marginBottom: 48,
            display: 'flex',
          }}
        >
          Premium Mobile Car Detailing
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
          }}
        >
          {['Certified Detailers', 'Transparent Pricing', 'At Your Door'].map(
            (text) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 20,
                  color: '#3A82FF',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#3A82FF',
                    display: 'flex',
                  }}
                />
                {text}
              </div>
            )
          )}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#615e5c',
            display: 'flex',
          }}
        >
          otopro.ca
        </div>
      </div>
    ),
    { ...size }
  )
}
