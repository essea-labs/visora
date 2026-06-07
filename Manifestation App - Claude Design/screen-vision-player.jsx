// screen-vision-player.jsx — Vision Player (immersive single-vision view).
//
// Reached by tapping a card on the canonical Vision Board (screen-vision.jsx).
// Full-screen card-stack feel: one vision = one full-bleed photo, big
// identity statement, parallax. Bottom: hold-to-enter immersive playback.
// Page indicator at top, swipe between visions.
//
// Voice: less browsing, more inhabiting.

function ScreenVisionPlayer({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Full-bleed photo */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="assets/work-paris.jpg" style={{
          width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.88) contrast(1.04) brightness(0.96)',
        }} />
        {/* gradient stack — top + bottom darken */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, rgba(20,12,6,0.55) 0%, rgba(20,12,6,0.0) 22%, rgba(20,12,6,0.0) 50%, rgba(20,12,6,0.85) 100%)`,
        }} />
        {/* warm wash */}
        <div style={{ position: 'absolute', inset: 0, background: `${p.terra}18`, mixBlendMode: 'overlay' }} />
      </div>

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="3:42" />

        {/* page indicators */}
        <div style={{
          position: 'absolute', top: 56, left: 16, right: 16,
          display: 'flex', gap: 4,
        }}>
          {[1, 0.4, 0.4, 0.4].map((opacity, i) => (
            <span key={i} style={{
              flex: 1, height: 3, borderRadius: 99,
              background: `rgba(250,246,239,${opacity})`,
            }} />
          ))}
        </div>

        {/* top chrome — close + edit */}
        <div style={{
          position: 'absolute', top: 76, left: 20, right: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
              color: '#FAF6EF', opacity: 0.78,
              padding: '4px 9px', borderRadius: 99,
              background: 'rgba(20,12,6,0.35)', border: '1px solid rgba(255,255,255,0.16)',
              backdropFilter: 'blur(8px)',
            }}>Career · 1 of 4</span>
          </div>
          <button style={{
            width: 36, height: 36, borderRadius: 99,
            background: 'rgba(20,12,6,0.4)', border: '1px solid rgba(255,255,255,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>
          </button>
        </div>

        {/* MAIN CONTENT — bottom-anchored editorial */}
        <div style={{
          position: 'absolute', left: 28, right: 28, bottom: 200,
        }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.7)', marginBottom: 14,
          }}>The vision</div>

          <h1 style={{
            margin: '0 0 18px', color: '#FAF6EF',
            fontSize: 38, fontWeight: 500, letterSpacing: -1, lineHeight: 1.05,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            textWrap: 'pretty',
          }}>
            The Studio of <em style={{ fontStyle: 'italic', fontWeight: 400 }}>My Own.</em>
          </h1>

          <p style={{
            margin: 0, fontStyle: 'italic',
            fontSize: 17, lineHeight: 1.5, color: 'rgba(250,246,239,0.92)',
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
            textWrap: 'pretty',
            paddingLeft: 14, borderLeft: '2px solid rgba(216,154,90,0.7)',
          }}>
            I am a sought-after designer.<br/>
            My calendar is mine. My work travels.
          </p>

          <div style={{
            marginTop: 20, display: 'flex', alignItems: 'center', gap: 14,
            color: 'rgba(250,246,239,0.78)', fontSize: 12.5, fontWeight: 500,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 6, height: 6, borderRadius: 99, background: p.amber,
                boxShadow: `0 0 8px ${p.amber}`,
              }}/>
              <strong style={{ fontWeight: 600, color: '#FAF6EF' }}>14 wins</strong> &nbsp;·&nbsp; 3 this week
            </span>
          </div>
        </div>

        {/* hold-to-enter immersive */}
        <div style={{
          position: 'absolute', left: 28, right: 28, bottom: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{
            flex: 1, height: 56, borderRadius: 28,
            background: 'rgba(250,246,239,0.16)',
            border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            color: '#FAF6EF', fontSize: 14, fontWeight: 600, letterSpacing: 0.1,
          }}>
            {/* breathing dot */}
            <span style={{
              width: 8, height: 8, borderRadius: 99, background: '#FAF6EF',
              boxShadow: '0 0 12px rgba(250,246,239,0.7)',
              animation: 'orb-halo 2.5s ease-in-out infinite',
            }} />
            Hold to play this vision
          </div>
          <button style={{
            width: 56, height: 56, borderRadius: 99,
            background: 'rgba(250,246,239,0.16)',
            border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>
            </svg>
          </button>
        </div>

        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

window.ScreenVisionPlayer = ScreenVisionPlayer;
