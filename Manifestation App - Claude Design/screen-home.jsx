// screen-home.jsx — Today / Home tab.
// Cosmic-dark register, matching Vision + Wins. Warm gradient, light type,
// amber accents, glowing terra ritual card. Auto-generated intentions
// (read-only, "From your ritual" — no edit affordance).

function ScreenHome({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Deep cosmic warm gradient — matches Vision + Wins */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(70% 50% at 50% 0%, ${p.terraDeep}66 0%, transparent 55%),
          radial-gradient(70% 40% at 50% 100%, ${p.cosmicC}aa 0%, ${p.cosmicB}77 35%, ${p.cosmicA}ff 75%, ${p.cosmicA} 100%),
          ${p.cosmicA}
        `,
      }} />
      {/* faint star/grain */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'screen',
        backgroundImage: `radial-gradient(circle at 18% 22%, ${p.amber}22 0%, transparent 4%),
                          radial-gradient(circle at 78% 14%, ${p.terraLight}22 0%, transparent 3%),
                          radial-gradient(circle at 32% 48%, ${p.amber}22 0%, transparent 2.5%),
                          radial-gradient(circle at 88% 62%, ${p.amber}22 0%, transparent 3%)`,
      }} />

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="7:14" />

        {/* scrollable body */}
        <div style={{ padding: '4px 24px 110px', height: 'calc(100% - 54px)', overflow: 'hidden', position: 'relative' }}>

          {/* Greeting row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 8, marginBottom: 22 }}>
            <div>
              <div style={{
                fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
                color: p.amber, marginBottom: 8,
              }}>Tuesday · May 5</div>
              <h1 style={{
                margin: 0,
                fontSize: 32, fontWeight: 500, letterSpacing: -0.7, lineHeight: 1.05,
                color: '#FAF6EF',
              }}>
                Good morning,<br/>
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: p.terraLight }}>Shellena.</span>
              </h1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, paddingTop: 4 }}>
              {/* streak — dark version */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 11px 5px 9px', borderRadius: 99,
                background: 'rgba(250,246,239,0.08)',
                border: '1px solid rgba(250,246,239,0.14)',
                backdropFilter: 'blur(12px)',
                color: '#FAF6EF', fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: p.amber, boxShadow: `0 0 8px ${p.amber}` }} />
                7 days
              </div>
              {/* avatar */}
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: `linear-gradient(135deg, ${p.terraLight} 0%, ${p.terra} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FAF6EF', fontSize: 15, fontWeight: 600, letterSpacing: 0.3,
                boxShadow: `0 4px 12px ${p.terra}66, 0 0 0 1px rgba(250,246,239,0.14)`,
                position: 'relative',
              }}>
                S
              </div>
            </div>
          </div>

          {/* Sage framed-wisdom quote card — moved ABOVE the ritual so it's
              visible above the fold. The quote sets the day's tone before
              the user dives into the ritual CTA. */}
          <div style={{
            position: 'relative', borderRadius: 22, overflow: 'hidden',
            padding: '22px 22px 20px',
            background: 'rgba(250,246,239,0.06)',
            border: '1px solid rgba(250,246,239,0.10)',
            backdropFilter: 'blur(20px)',
            marginBottom: 22,
          }}>
            {/* large serif quote mark */}
            <span style={{
              position: 'absolute', top: -18, left: 14,
              fontFamily: 'Georgia, serif', fontSize: 120,
              color: 'rgba(250,246,239,0.10)', lineHeight: 1, fontWeight: 400,
              pointerEvents: 'none',
            }}>"</span>
            {/* amber radial glow bottom-right */}
            <div style={{
              position: 'absolute', right: -30, bottom: -30, width: 140, height: 140,
              borderRadius: '50%', background: `radial-gradient(circle, ${p.amber}33 0%, transparent 70%)`,
              filter: 'blur(12px)', pointerEvents: 'none',
            }} />
            <p style={{
              position: 'relative',
              margin: '0 0 12px', fontSize: 16, fontStyle: 'italic',
              color: '#FAF6EF', lineHeight: 1.5, letterSpacing: -0.1,
              textWrap: 'pretty',
            }}>
              The day you decide who you are is the day everything quietly begins to rearrange.
            </p>
            <div style={{
              position: 'relative',
              fontSize: 9.5, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
              color: p.amber,
            }}>Lao Tzu · today's wisdom</div>
          </div>

          {/* Ritual feature card — the heart, prominent */}
          <div style={{
            position: 'relative', borderRadius: 24, overflow: 'hidden',
            marginBottom: 26,
            boxShadow: `
              0 22px 50px -10px rgba(0,0,0,0.55),
              0 0 0 1px rgba(250,246,239,0.08),
              0 0 60px ${p.terra}33`,
          }}>
            {/* photo bg */}
            <img src="assets/hero-warm-bright.jpg" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'saturate(0.85) contrast(1.04)',
            }} />
            {/* dark vignette so type reads */}
            <div style={{ position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, rgba(20,12,6,0.35) 0%, rgba(20,12,6,0.55) 55%, rgba(20,12,6,0.92) 100%)`,
            }} />
            {/* terra glow accent */}
            <div style={{
              position: 'absolute', right: -50, top: -50, width: 220, height: 220,
              borderRadius: '50%', background: `radial-gradient(circle, ${p.terra}77, transparent 65%)`,
              filter: 'blur(24px)', mixBlendMode: 'screen',
            }} />
            <div style={{ position: 'relative', padding: '24px 24px 22px', color: '#FAF6EF', minHeight: 280 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 9.5, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                color: '#FAF6EF',
                padding: '5px 10px', borderRadius: 99,
                background: 'rgba(20,12,6,0.45)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                marginBottom: 18,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: p.amber, boxShadow: `0 0 6px ${p.amber}` }} />
                Your ritual · 90s
              </div>
              <h2 style={{
                margin: '0 0 10px', fontSize: 28, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.1,
                textShadow: '0 4px 18px rgba(0,0,0,0.5)',
              }}>
                Begin the day<br/>
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: p.terraLight }}>already there.</span>
              </h2>
              <p style={{
                margin: '0 0 22px', fontSize: 13.5, lineHeight: 1.5,
                color: 'rgba(250,246,239,0.85)', maxWidth: 280,
                textShadow: '0 1px 6px rgba(0,0,0,0.4)',
              }}>
                A 90-second visualization, voiced for you. Today's focus: <em style={{ color: p.amber, fontStyle: 'italic' }}>Work for myself.</em>
              </p>
              {/* Begin button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  height: 46, padding: '0 20px 0 16px', borderRadius: 99,
                  background: `linear-gradient(135deg, ${p.terra} 0%, ${p.terraDeep} 100%)`,
                  color: '#FAF6EF',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1,
                  boxShadow: `0 12px 28px ${p.terra}88, 0 1px 0 rgba(255,255,255,0.25) inset, 0 0 0 1px rgba(216,154,90,0.5)`,
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'rgba(250,246,239,0.18)', border: '1px solid rgba(250,246,239,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <window.IconPlay fill="#FAF6EF" size={10} />
                  </span>
                  Begin ritual
                </button>
                {/* mini orb hint */}
                <div style={{
                  position: 'relative', width: 56, height: 56, flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute', inset: -10, borderRadius: '50%',
                    background: `radial-gradient(circle, ${p.amber}55, transparent 70%)`,
                    filter: 'blur(10px)',
                  }} />
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), rgba(255,200,150,0.5) 25%, transparent 50%), radial-gradient(circle at 50% 50%, ${p.amberPale}, ${p.terra} 70%, ${p.terraDeep})`,
                    boxShadow: `inset 0 -6px 16px rgba(85,107,79,0.4), inset 0 4px 10px rgba(255,236,210,0.5), 0 6px 14px ${p.terra}88`,
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Today's intention (single card, simplified for above-the-fold) */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{
                margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: -0.2, color: '#FAF6EF',
              }}>Today's intention</h3>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
                color: p.amber,
              }}>From your ritual</span>
            </div>
            <div style={{
              borderRadius: 18,
              background: 'rgba(250,246,239,0.07)',
              border: '1px solid rgba(250,246,239,0.12)',
              backdropFilter: 'blur(20px)',
              padding: '22px 22px',
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}>
              <div style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase',
                color: p.amber, marginBottom: 8,
              }}>Today, I will</div>
              <p style={{
                margin: 0, fontSize: 18, color: '#FAF6EF', lineHeight: 1.4,
                fontWeight: 500, letterSpacing: -0.2, textWrap: 'pretty',
              }}>
                Ship the landing page. One quiet block. No checking metrics.
              </p>
            </div>
          </div>

          {/* (Quote moved above the ritual — see top of stack.) */}

        </div>

        <window.TabBar active="home" tone="light" palette={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

// ─── Intention card ─────────────────────────────────
function IntentionCardHome({ kind, label, body, palette }) {
  const p = palette;
  const accent = kind === 'am' ? p.terraLight : p.amber;
  return (
    <div style={{
      position: 'relative',
      borderRadius: 16,
      padding: '16px 18px 16px',
      background: `
        linear-gradient(180deg, rgba(250,246,239,0.06) 0%, rgba(250,246,239,0.04) 100%)
      `,
      border: '1px solid rgba(250,246,239,0.10)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 12px 28px -8px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.05) inset',
    }}>
      {/* hairline accent on left */}
      <div style={{
        position: 'absolute', left: 0, top: 14, bottom: 14, width: 2,
        background: accent, borderRadius: 2, opacity: 0.7,
      }} />
      <div style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
        color: accent, marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontSize: 15, lineHeight: 1.4, fontWeight: 500, letterSpacing: -0.1,
        color: '#FAF6EF', textWrap: 'pretty',
      }}>{body}</div>
    </div>
  );
}

window.ScreenHome = ScreenHome;
