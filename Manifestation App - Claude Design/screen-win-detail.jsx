// screen-win-detail.jsx — opening one win.
// Full-bleed cinematic. Hero photo fills top, content sits over a smooth
// transition into deep cosmic warm gradient. Editorial typography.

function ScreenWinDetail({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Cosmic backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(70% 40% at 50% 100%, ${p.cosmicC}aa 0%, ${p.cosmicB}77 40%, ${p.cosmicA} 80%),
          ${p.cosmicA}
        `,
      }} />

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="3:42" />

        {/* Hero photo — extends behind status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 480, overflow: 'hidden',
        }}>
          <img src="assets/work-coffee.jpg" style={{
            width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.88) contrast(1.04)',
          }} />
          {/* deep cinematic gradient — dark at top + bottom */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, rgba(20,12,6,0.55) 0%, transparent 22%, transparent 50%, ${p.cosmicA}ff 100%)`,
          }} />
          <div style={{ position: 'absolute', inset: 0, background: `${p.terra}10`, mixBlendMode: 'overlay' }} />

          {/* nav row */}
          <div style={{ position: 'absolute', top: 60, left: 20, right: 20, display: 'flex', justifyContent: 'space-between' }}>
            <button style={{
              width: 38, height: 38, borderRadius: 99,
              background: 'rgba(20,12,6,0.45)', border: '1px solid rgba(255,255,255,0.16)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(12px)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
              color: 'rgba(250,246,239,0.78)',
              padding: '8px 12px', borderRadius: 99,
              background: 'rgba(20,12,6,0.4)', border: '1px solid rgba(255,255,255,0.16)',
              backdropFilter: 'blur(12px)',
            }}>Win #43 · Career</span>
            <button style={{
              width: 38, height: 38, borderRadius: 99,
              background: 'rgba(20,12,6,0.45)', border: '1px solid rgba(255,255,255,0.16)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(12px)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FAF6EF"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
            </button>
          </div>
        </div>

        {/* Content panel — sits over photo bottom + extends down */}
        <div style={{
          position: 'absolute', top: 380, left: 0, right: 0, bottom: 0,
          padding: '0 28px 28px',
          overflow: 'hidden',
        }}>
          {/* date eyebrow */}
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
            color: p.amber, marginBottom: 14,
          }}>Yesterday · 6:48 PM</div>

          {/* Title */}
          <h1 style={{
            margin: '0 0 14px', color: '#FAF6EF',
            fontSize: 32, fontWeight: 500, letterSpacing: -0.7, lineHeight: 1.1,
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
            textWrap: 'pretty',
          }}>
            First paying client<br/>
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: p.terraLight }}>said yes.</em>
          </h1>

          {/* Body */}
          <p style={{
            margin: '0 0 22px', fontSize: 15, lineHeight: 1.55, color: 'rgba(250,246,239,0.82)', fontWeight: 400,
            textWrap: 'pretty',
            paddingLeft: 14, borderLeft: `1px solid ${p.amber}55`,
          }}>
            $2,400 contract, signed at the kitchen table with cold coffee. Three weeks
            ago I would've said this was for someone else.
          </p>

          {/* PROOF TOWARD — frosted dark card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            borderRadius: 18,
            background: 'rgba(250,246,239,0.06)',
            border: `1px solid ${p.amber}44`,
            backdropFilter: 'blur(20px)',
            marginBottom: 18, cursor: 'pointer',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.16), 0 0 18px rgba(216,154,90,0.4)',
            }}>
              <img src="assets/work-paris.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
                color: p.amber, marginBottom: 3,
              }}>↳ Proof toward</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: '#FAF6EF', letterSpacing: -0.1, marginBottom: 1 }}>
                The Studio of My Own
              </div>
              <div style={{ fontSize: 11, fontStyle: 'italic', color: 'rgba(250,246,239,0.55)' }}>
                I am a sought-after designer.
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(250,246,239,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </div>

          {/* The pattern — soft sage-tinted observation */}
          <div style={{
            padding: '14px 18px', borderRadius: 16,
            background: 'rgba(122,148,112,0.10)',
            border: '1px solid rgba(122,148,112,0.22)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
              color: p.sage, marginBottom: 5,
            }}>The pattern</div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'rgba(250,246,239,0.85)', fontStyle: 'italic', textWrap: 'pretty' }}>
              Three of your last five wins came after you said no to something else.
            </p>
          </div>
        </div>

        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

window.ScreenWinDetail = ScreenWinDetail;
