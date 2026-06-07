// screen-premium.jsx — Innerproof paywall.
// Hard paywall with 7-day free trial. Two tiers: monthly $2.99 / yearly $24.99.
// Above-the-fold strategy: pitch + pricing + CTA visible without scrolling.
// Benefits + trust scroll below.

function ScreenPremium({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Warm cosmic gradient — slightly more amber-forward */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(80% 55% at 50% -5%, ${p.amber}55 0%, ${p.terraDeep}77 30%, transparent 65%),
          radial-gradient(70% 45% at 50% 100%, ${p.cosmicC}cc 0%, ${p.cosmicB}99 30%, ${p.cosmicA}ff 70%),
          ${p.cosmicA}
        `,
      }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, mixBlendMode: 'screen',
        backgroundImage: `radial-gradient(circle at 18% 22%, ${p.amber}33 0%, transparent 4%),
                          radial-gradient(circle at 82% 16%, ${p.terraLight}33 0%, transparent 3%),
                          radial-gradient(circle at 75% 60%, ${p.amber}33 0%, transparent 3%)`,
      }} />

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="9:14" />

        {/* Close — top right */}
        <div style={{ padding: '4px 16px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{
            width: 34, height: 34, borderRadius: 99,
            background: 'rgba(250,246,239,0.06)', border: '1px solid rgba(250,246,239,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(12px)',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(250,246,239,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '0 22px 16px', height: 'calc(100% - 76px - 38px)', overflow: 'hidden' }}>

          {/* === ABOVE THE FOLD === */}

          {/* Hero — compact */}
          <div style={{ textAlign: 'center', paddingTop: 4, marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <window.BreathingOrb size={64} palette={p} />
            </div>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
              color: p.amber, marginBottom: 8,
            }}>Innerproof</div>
            <h1 style={{
              margin: 0, fontSize: 26, fontWeight: 500, color: '#FAF6EF',
              letterSpacing: -0.4, lineHeight: 1.15,
            }}>
              Become who you<br/>want to be.
            </h1>
            <p style={{
              margin: '10px auto 0', fontSize: 13.5, color: 'rgba(250,246,239,0.78)',
              lineHeight: 1.45, padding: '0 12px', maxWidth: 300, textWrap: 'pretty',
            }}>
              A daily 90-second practice. 7 days free, then choose your plan.
            </p>
          </div>

          {/* Pricing — 2 tiers, yearly highlighted, ABOVE the fold */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, marginTop: 18 }}>
            <PriceCard p={p} featured
              label="Yearly"
              price="$24.99"
              unit="per year · $2.08/mo"
              sublabel="Save 30%" />
            <PriceCard p={p}
              label="Monthly"
              price="$2.99"
              unit="per month"
              sublabel="" />
          </div>

          {/* CTA — primary action, above the fold */}
          <button style={{
            width: '100%', padding: '16px 22px', borderRadius: 99,
            background: `linear-gradient(135deg, ${p.amber} 0%, ${p.amberDeep} 100%)`,
            color: '#1F1308', border: 'none', fontFamily: 'inherit',
            fontSize: 15, fontWeight: 700, letterSpacing: 0.4, cursor: 'pointer',
            boxShadow: `0 14px 32px ${p.amber}55, inset 0 1px 0 rgba(255,236,210,0.5)`,
            marginBottom: 10,
          }}>
            Start 7-day free trial
          </button>

          {/* Trust — single line, above the fold */}
          <div style={{
            textAlign: 'center', fontSize: 11, color: 'rgba(250,246,239,0.55)',
            letterSpacing: 0.2, marginBottom: 18,
          }}>
            Cancel anytime · No charge during trial
          </div>

          {/* === BELOW THE FOLD (scrollable) === */}

          {/* Divider */}
          <div style={{
            height: 1, background: 'rgba(250,246,239,0.10)', marginBottom: 18,
          }} />

          {/* What's included — benefits */}
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.6)', marginBottom: 12, textAlign: 'center',
          }}>What's included</div>
          <div style={{ marginBottom: 18 }}>
            <Benefit p={p} text="Daily voice-guided morning ritual (90 seconds)" />
            <Benefit p={p} text="Up to 5 vision areas with personalized identity statements" />
            <Benefit p={p} text="Capture small wins, tagged to your vision" />
            <Benefit p={p} text="Optional witness — one person who sees your wins" />
            <Benefit p={p} text="Your archive is always yours, always exportable" />
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center', fontSize: 10.5, color: 'rgba(250,246,239,0.32)',
            letterSpacing: 0.3, paddingBottom: 8,
          }}>
            Restore purchase · Terms · Privacy
          </div>
        </div>

        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

// ─── pieces ──────────────────────────────────────────────────

function Benefit({ p, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '6px 0' }}>
      <span style={{
        width: 18, height: 18, borderRadius: 99, marginTop: 1, flexShrink: 0,
        background: `${p.amber}22`,
        border: `1px solid ${p.amber}66`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <span style={{
        fontSize: 13.5, color: '#FAF6EF', lineHeight: 1.4,
        fontWeight: 500, textWrap: 'pretty',
      }}>{text}</span>
    </div>
  );
}

function PriceCard({ p, featured, label, price, unit, sublabel }) {
  return (
    <div style={{
      flex: 1, position: 'relative',
      borderRadius: 16,
      background: featured
        ? `linear-gradient(160deg, ${p.amber}33 0%, ${p.terraDeep}55 100%)`
        : 'rgba(250,246,239,0.06)',
      border: featured ? `1.5px solid ${p.amber}` : '1px solid rgba(250,246,239,0.14)',
      padding: '18px 12px 14px',
      backdropFilter: 'blur(14px)',
      boxShadow: featured ? `0 12px 26px ${p.amber}33` : 'none',
      textAlign: 'center',
    }}>
      {sublabel && (
        <div style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          padding: '3px 10px', borderRadius: 99,
          background: p.amber,
          fontSize: 9.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
          color: '#1F1308', whiteSpace: 'nowrap',
          boxShadow: `0 4px 12px ${p.amber}66`,
        }}>{sublabel}</div>
      )}
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
        color: featured ? p.amber : 'rgba(250,246,239,0.65)', marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontSize: 24, fontWeight: 600, color: '#FAF6EF', letterSpacing: -0.5,
        lineHeight: 1.1,
      }}>{price}</div>
      <div style={{
        fontSize: 10.5, color: 'rgba(250,246,239,0.55)',
        marginTop: 3, lineHeight: 1.3,
      }}>{unit}</div>
    </div>
  );
}

window.ScreenPremium = ScreenPremium;
