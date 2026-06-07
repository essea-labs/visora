// screen-vision-detail.jsx — what you see when you tap a vision piece
// from the Future Self collage AFTER you've inhabited it via the Player.
// This is the "manage / linked-wins / progress" view.
//
// Cinematic dark, full-bleed photo hero, identity statement, then a
// scroll of all wins linked to this vision as a vertical tape.

function ScreenVisionDetail({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  return (
    <window.Phone paletteKey={paletteKey}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(70% 40% at 50% 100%, ${p.cosmicC}aa 0%, ${p.cosmicB}77 40%, ${p.cosmicA} 80%),
          ${p.cosmicA}
        `,
      }} />

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="3:42" />

        {/* Hero photo */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420, overflow: 'hidden' }}>
          <img src="assets/work-paris.jpg" style={{
            width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.88) contrast(1.04)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, rgba(20,12,6,0.55) 0%, transparent 25%, transparent 50%, ${p.cosmicA}ff 100%)`,
          }} />

          {/* nav */}
          <div style={{ position: 'absolute', top: 60, left: 20, right: 20, display: 'flex', justifyContent: 'space-between' }}>
            <button style={{
              width: 38, height: 38, borderRadius: 99,
              background: 'rgba(20,12,6,0.45)', border: '1px solid rgba(255,255,255,0.16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(12px)', cursor: 'pointer',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <button style={{
              padding: '0 14px', height: 38, borderRadius: 99,
              background: 'rgba(20,12,6,0.45)', border: '1px solid rgba(255,255,255,0.16)',
              color: '#FAF6EF', fontSize: 12, fontWeight: 600, letterSpacing: 0.4, fontFamily: 'inherit',
              backdropFilter: 'blur(12px)', cursor: 'pointer',
            }}>Edit</button>
          </div>

          {/* hero text */}
          <div style={{ position: 'absolute', left: 28, right: 28, bottom: 70 }}>
            <div style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
              color: p.amber, marginBottom: 12,
            }}>↳ Career</div>
            <h1 style={{
              margin: '0 0 14px', color: '#FAF6EF',
              fontSize: 32, fontWeight: 500, letterSpacing: -0.7, lineHeight: 1.05,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
              The Studio of <em style={{ fontStyle: 'italic', fontWeight: 400 }}>My Own.</em>
            </h1>
            <p style={{
              margin: 0, fontStyle: 'italic',
              fontSize: 15, lineHeight: 1.5, color: 'rgba(250,246,239,0.92)',
              paddingLeft: 12, borderLeft: `2px solid ${p.amber}aa`,
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
            }}>
              I am a sought-after designer.
            </p>
          </div>
        </div>

        {/* Stats row over the gradient transition */}
        <div style={{
          position: 'absolute', top: 396, left: 22, right: 22,
          padding: '14px 18px', borderRadius: 18,
          background: 'rgba(250,246,239,0.06)',
          border: '1px solid rgba(250,246,239,0.10)',
          backdropFilter: 'blur(20px)',
          display: 'flex', justifyContent: 'space-between',
          boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
        }}>
          <Stat palette={p} value="14" label="Total proofs" accent="amber" />
          <span style={{ width: 1, background: 'rgba(250,246,239,0.10)' }} />
          <Stat palette={p} value="3" label="This week" accent="terra" />
          <span style={{ width: 1, background: 'rgba(250,246,239,0.10)' }} />
          <Stat palette={p} value="8" label="This month" />
        </div>

        {/* Linked wins */}
        <div style={{
          position: 'absolute', top: 504, left: 0, right: 0, bottom: 0,
          padding: '0 22px 28px',
          overflow: 'hidden',
          maskImage: 'linear-gradient(180deg, black 0%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 90%, transparent 100%)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#FAF6EF',
            }}>Proof toward this</span>
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: p.amber,
            }}>14 wins</span>
          </div>

          <LinkedWin palette={p} title="First paying client said yes." date="Yesterday" highlight />
          <LinkedWin palette={p} title="Shipped the landing page." date="2h ago" />
          <LinkedWin palette={p} title="Said no to the wrong meeting." date="May 2" />
          <LinkedWin palette={p} title="Posted the work I was scared to share." date="Apr 28" />
        </div>

        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

function Stat({ palette, value, label, accent }) {
  const p = palette;
  const color = accent === 'amber' ? p.amber : accent === 'terra' ? p.terraLight : '#FAF6EF';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1 }}>
      <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5, color }}>{value}</span>
      <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(250,246,239,0.5)' }}>{label}</span>
    </div>
  );
}

function LinkedWin({ palette, title, date, highlight }) {
  const p = palette;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 14px',
      borderRadius: 14,
      background: highlight ? `rgba(216,154,90,0.10)` : 'rgba(250,246,239,0.04)',
      border: `1px solid ${highlight ? p.amber + '33' : 'rgba(250,246,239,0.08)'}`,
      marginBottom: 8,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: 99,
        background: highlight ? p.amber : 'rgba(250,246,239,0.4)',
        boxShadow: highlight ? `0 0 10px ${p.amber}` : 'none',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#FAF6EF', letterSpacing: -0.1, lineHeight: 1.3, marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(250,246,239,0.5)' }}>
          {date}
        </div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(250,246,239,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
    </div>
  );
}

window.ScreenVisionDetail = ScreenVisionDetail;
