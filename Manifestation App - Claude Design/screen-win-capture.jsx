// screen-win-capture.jsx — Unified composer.
// Text + photo, single field. No segmentation. The simplest possible
// capture surface, in the cinematic dark style.

function ScreenWinCapture({ paletteKey = 'A', mode = 'empty' /* 'empty'|'typing'|'photo' */ }) {
  const p = window.PALETTES[paletteKey];
  const hasPhoto = mode === 'photo';
  const hasText  = mode !== 'empty';

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Cinematic dark backdrop, soft warm vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(70% 50% at 50% 0%, ${p.terraDeep}55 0%, transparent 55%),
          radial-gradient(60% 40% at 50% 110%, ${p.amber}33 0%, transparent 60%),
          ${p.cosmicA}
        `,
      }} />

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="3:42" />

        {/* Top chrome — close only. (The headline below already orients
            the user; the "Drop the anchor" eyebrow was off-spec.) */}
        <div style={{
          padding: '6px 24px 0', display: 'flex', alignItems: 'center',
        }}>
          <button style={{
            width: 38, height: 38, borderRadius: 99,
            background: 'rgba(250,246,239,0.10)',
            border: '1px solid rgba(250,246,239,0.18)',
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>
          </button>
        </div>

        {/* Prompt — editorial */}
        <div style={{ padding: '40px 28px 0' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
            color: p.amber, marginBottom: 14,
          }}>Capture a win</div>
          <h1 style={{
            margin: 0, color: '#FAF6EF',
            fontSize: 30, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.15,
            textWrap: 'pretty',
          }}>
            What's a small win<br/>from today?
          </h1>
        </div>

        {/* The composer */}
        <div style={{
          margin: '32px 22px 0',
          borderRadius: 22,
          background: 'rgba(250,246,239,0.06)',
          border: '1px solid rgba(250,246,239,0.10)',
          backdropFilter: 'blur(20px)',
          padding: hasPhoto ? '0 0 16px' : '24px',
          minHeight: hasPhoto ? 380 : 240,
          overflow: 'hidden',
        }}>
          {hasPhoto && (
            <div style={{
              position: 'relative', height: 240, marginBottom: 16,
              borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: 'hidden',
            }}>
              <img src="assets/work-laptop.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.88)' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 50%, ${p.cosmicA}aa 100%)` }} />
              <button style={{
                position: 'absolute', top: 12, right: 12,
                width: 32, height: 32, borderRadius: 99,
                background: 'rgba(20,12,6,0.55)', border: '1px solid rgba(255,255,255,0.16)',
                color: '#FAF6EF', cursor: 'pointer', fontSize: 14,
                backdropFilter: 'blur(8px)',
              }}>×</button>
            </div>
          )}

          {hasPhoto && <div style={{ padding: '0 22px' }}>
            <p style={{
              margin: 0, color: '#FAF6EF',
              fontSize: 18, lineHeight: 1.4, fontWeight: 500, letterSpacing: -0.2,
              textWrap: 'pretty',
            }}>
              Shipped the landing page<span style={{ color: p.amber, marginLeft: 1 }}>|</span>
            </p>
          </div>}

          {!hasPhoto && hasText && (
            <p style={{
              margin: 0, color: '#FAF6EF',
              fontSize: 19, lineHeight: 1.45, fontWeight: 500, letterSpacing: -0.2,
              textWrap: 'pretty',
            }}>
              Said no to the meeting that wasn't mine. Stayed with the <span style={{ background: p.amber + '33', color: p.amber, padding: '0 4px', borderRadius: 3 }}>real work</span> for a full hour<span style={{ color: p.amber, marginLeft: 1 }}>|</span>
            </p>
          )}

          {!hasText && (
            <p style={{
              margin: 0, color: 'rgba(250,246,239,0.4)',
              fontSize: 19, lineHeight: 1.45, fontWeight: 500, letterSpacing: -0.2,
              fontStyle: 'italic',
            }}>
              A small no. A quiet yes. The thing that took courage…
            </p>
          )}
        </div>

        {/* Tool rail — under composer, glassy chips */}
        <div style={{
          margin: '14px 22px 0',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <ToolChip palette={p} active={hasPhoto}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h4l1.5-2h7L17 7h4v12H3z"/><circle cx="12" cy="13" r="3.5"/></svg>}
            label={hasPhoto ? "Photo" : "Add photo"}
          />
          <span style={{ flex: 1 }} />
          {hasText && <span style={{ fontSize: 11, color: 'rgba(250,246,239,0.45)', fontWeight: 500, letterSpacing: 0.2 }}>108/240</span>}
        </div>

        {/* PROOF TOWARD link */}
        {hasText && (
          <div style={{
            position: 'absolute', left: 22, right: 22, bottom: 124,
            padding: '14px 16px', borderRadius: 18,
            background: 'rgba(250,246,239,0.06)',
            border: '1px solid rgba(216,154,90,0.28)',
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.16)',
            }}>
              <img src="assets/work-paris.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
                color: p.amber, marginBottom: 2,
              }}>↳ Proof toward</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#FAF6EF', letterSpacing: -0.1 }}>
                The Studio of My Own
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(250,246,239,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </div>
        )}

        {/* Save CTA — neutral label, no anchor metaphor on the button. */}
        <button style={{
          position: 'absolute', left: 22, right: 22, bottom: 50,
          height: 60, borderRadius: 30,
          background: hasText
            ? `linear-gradient(135deg, ${p.terra} 0%, ${p.terraDeep} 100%)`
            : 'rgba(250,246,239,0.08)',
          color: hasText ? '#FAF6EF' : 'rgba(250,246,239,0.35)',
          border: hasText ? 'none' : '1px solid rgba(250,246,239,0.10)',
          fontFamily: 'inherit', fontSize: 16, fontWeight: 600, letterSpacing: 0.1,
          cursor: 'pointer',
          boxShadow: hasText ? `0 18px 40px ${p.terra}66, 0 1px 0 rgba(255,255,255,0.25) inset` : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          Save
        </button>

        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

function ToolChip({ palette, icon, label, active }) {
  const p = palette;
  return (
    <button style={{
      height: 36, padding: '0 14px 0 11px',
      borderRadius: 99,
      background: active ? `${p.amber}22` : 'rgba(250,246,239,0.06)',
      border: `1px solid ${active ? p.amber + '55' : 'rgba(250,246,239,0.10)'}`,
      color: active ? p.amber : 'rgba(250,246,239,0.7)',
      fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, letterSpacing: 0.1,
      display: 'inline-flex', alignItems: 'center', gap: 7,
      backdropFilter: 'blur(20px)', cursor: 'pointer',
    }}>
      {icon} {label}
    </button>
  );
}

window.ScreenWinCapture = ScreenWinCapture;
