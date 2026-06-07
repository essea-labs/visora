// screen-ritual.jsx — Morning Ritual full sequence (5 beats).
// All beats are passive/auto-generated — no user input. Tap to advance.
// Beat 1: Settle (orb only, "Find a comfortable seat")
// Beat 2: Breathe (orb pulse with inhale/hold/exhale)
// Beat 3: Picture (vision photo blurred + I AM identity)
// Beat 4: Anchor (intention cards appear, voiced)
// Beat 5: Send-off (orb blooms, "Carry this with you")

function ScreenRitual({ paletteKey = 'A', atmosphere = 'photo', beat = 3 }) {
  const p = window.PALETTES[paletteKey];
  const showPhoto = atmosphere === 'photo' && (beat === 3 || beat === 4);

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Cinematic background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {showPhoto && (
          <img src="assets/hero-warm-bright.jpg" style={{
            position: 'absolute', inset: 0, width: '110%', height: '110%',
            top: '-5%', left: '-5%', objectFit: 'cover',
            filter: 'blur(28px) saturate(0.85) brightness(0.78)',
          }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(120% 80% at 50% 35%, ${p.terra}55 0%, transparent 60%),
            radial-gradient(100% 60% at 50% 100%, ${p.cosmicB} 0%, ${p.cosmicA} 80%),
            linear-gradient(180deg, ${p.cosmicB}cc 0%, ${p.cosmicA} 100%)
          `,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.45) 100%)',
        }} />
      </div>

      <div style={{ position: 'relative', height: '100%', color: '#FAF6EF', display: 'flex', flexDirection: 'column' }}>
        <window.StatusBar tone="light" time="7:14" />

        {/* Top chrome — beat indicator + Skip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 24px 0',
        }}>
          <div style={{ display: 'flex', gap: 7 }}>
            {[1, 2, 3, 4, 5].map(i => {
              const active = i === beat;
              const past = i < beat;
              return (
                <div key={i} style={{
                  width: active ? 22 : 6, height: 6, borderRadius: 99,
                  background: active ? p.amberPale : past ? 'rgba(250,246,239,0.55)' : 'rgba(250,246,239,0.22)',
                }} />
              );
            })}
          </div>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(250,246,239,0.55)',
            fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, letterSpacing: 1.4,
            textTransform: 'uppercase', padding: 4,
          }}>Skip</button>
        </div>

        {/* Beat content */}
        {beat === 1 && <BeatSettle palette={p} />}
        {beat === 2 && <BeatBreathe palette={p} />}
        {beat === 3 && <BeatPicture palette={p} />}
        {beat === 4 && <BeatAnchor palette={p} />}
        {beat === 5 && <BeatSendoff palette={p} />}

        {/* Bottom chrome — captions toggle + audio waveform */}
        <div style={{
          padding: '14px 24px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 14,
        }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 36, padding: '0 14px', borderRadius: 99,
            background: 'rgba(250,246,239,0.10)', color: 'rgba(250,246,239,0.85)',
            border: '1px solid rgba(250,246,239,0.18)',
            backdropFilter: 'blur(14px)', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, letterSpacing: 0.2,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="6" width="18" height="14" rx="2.5"/>
              <path d="M7 14h3M13 14h4M7 11h2M11 11h6"/>
            </svg>
            Captions on
          </button>

          <div style={{
            flex: 1, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
          }}>
            {Array.from({ length: 22 }).map((_, i) => {
              const seed = (Math.sin(i * 1.7 + beat) + 1) / 2;
              const center = 1 - Math.abs(i - 10.5) / 11;
              const h = 4 + seed * 14 + center * 12;
              const progress = beat / 5;
              const cutoff = Math.floor(22 * progress);
              return (
                <div key={i} style={{
                  width: 2.5, height: h, borderRadius: 2,
                  background: i < cutoff ? p.amberPale : 'rgba(250,246,239,0.28)',
                  opacity: i < cutoff ? 0.9 : 0.7,
                }} />
              );
            })}
          </div>

          <span style={{
            fontFamily: '-apple-system, "SF Mono", monospace',
            fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
            color: 'rgba(250,246,239,0.62)',
          }}>{['0:08', '0:24', '0:42', '1:08', '1:26'][beat - 1]} / 1:30</span>
        </div>

        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

// ─── Beat 1: Settle ──────────────────────────────────────────
function BeatSettle({ palette }) {
  const p = palette;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: '0 36px' }}>
      <BeatLabel n="01" name="Settle" palette={p} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <window.BreathingOrb size={180} palette={p} />
      </div>
      <p style={{
        margin: '0 0 18px', fontSize: 22, lineHeight: 1.32, letterSpacing: -0.5, fontWeight: 400,
        color: '#FAF6EF', textAlign: 'center', textWrap: 'balance',
        textShadow: '0 2px 16px rgba(0,0,0,0.45)',
      }}>
        Find a comfortable seat. <em style={{ color: p.amberPale, fontStyle: 'italic', fontWeight: 500 }}>Soften.</em>
      </p>
    </div>
  );
}

// ─── Beat 2: Breathe ─────────────────────────────────────────
function BeatBreathe({ palette }) {
  const p = palette;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: '0 36px' }}>
      <BeatLabel n="02" name="Breathe" palette={p} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <window.BreathingOrb size={232} palette={p} />
      </div>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
        color: 'rgba(250,246,239,0.50)', marginBottom: 12, textAlign: 'center',
      }}>
        <span style={{ color: p.amberPale, opacity: 0.95 }}>Inhale</span>&nbsp;·&nbsp;Hold&nbsp;·&nbsp;Exhale
      </div>
      <p style={{
        margin: '0 0 18px', fontSize: 22, lineHeight: 1.32, letterSpacing: -0.5, fontWeight: 400,
        color: '#FAF6EF', textAlign: 'center', textWrap: 'balance',
      }}>
        Three slow breaths. <em style={{ color: p.amberPale, fontStyle: 'italic', fontWeight: 500 }}>Arrive here.</em>
      </p>
    </div>
  );
}

// ─── Beat 3: Picture ─────────────────────────────────────────
function BeatPicture({ palette }) {
  const p = palette;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 0 }}>
      <div style={{ marginTop: 16 }}>
        <BeatLabel n="03" name="Picture" palette={p} />
      </div>
      <div style={{ textAlign: 'center', padding: '0 36px', marginBottom: 6 }}>
        <div style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
          color: p.amberPale, opacity: 0.78, marginBottom: 8,
        }}>I am</div>
        <p style={{
          margin: 0, fontStyle: 'italic',
          fontSize: 17.5, lineHeight: 1.45, fontWeight: 400,
          color: 'rgba(250,246,239,0.92)',
          textWrap: 'balance', textShadow: '0 1px 12px rgba(0,0,0,0.4)',
        }}>
          grounded, open, and unafraid to choose myself.
        </p>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: '12px 0' }}>
        <window.BreathingOrb size={232} palette={p} />
      </div>
      <p style={{
        margin: '0 36px 18px', fontSize: 22, lineHeight: 1.32, letterSpacing: -0.5, fontWeight: 400,
        color: '#FAF6EF', textAlign: 'center', textWrap: 'balance',
        textShadow: '0 2px 16px rgba(0,0,0,0.45)',
      }}>
        Picture yourself today, already <em style={{ color: p.amberPale, fontStyle: 'italic', fontWeight: 500 }}>working on your own terms</em>.
      </p>
    </div>
  );
}

// ─── Beat 4: Anchor (intention cards appear) ───────────────────
function BeatAnchor({ palette }) {
  const p = palette;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 0, padding: '0 28px' }}>
      <div style={{ marginTop: 16 }}>
        <BeatLabel n="04" name="Anchor" palette={p} />
      </div>
      <p style={{
        margin: '6px 0 24px', fontSize: 17, lineHeight: 1.4, letterSpacing: -0.2, fontWeight: 400,
        color: 'rgba(250,246,239,0.85)', textAlign: 'center', textWrap: 'balance',
        textShadow: '0 2px 12px rgba(0,0,0,0.45)',
        padding: '0 10px',
      }}>
        Today's intention.
      </p>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, padding: '0 6px' }}>
        <IntentionCard
          label="Today, I will"
          body="Ship the landing page. One quiet block. No checking metrics."
          accent={p.amber}
        />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{
        marginBottom: 12,
        fontSize: 10, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
        color: 'rgba(250,246,239,0.45)', textAlign: 'center',
      }}>
        Auto-set from your vision · 7am
      </div>
    </div>
  );
}

function IntentionCard({ label, body, accent }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 16, padding: '16px 18px',
      background: 'rgba(250,246,239,0.10)',
      border: '1px solid rgba(250,246,239,0.18)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 12px 28px -8px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08) inset',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 14, bottom: 14, width: 2,
        background: accent, borderRadius: 2, opacity: 0.85,
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

// ─── Beat 5: Send-off ────────────────────────────────────────
function BeatSendoff({ palette }) {
  const p = palette;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: '0 36px' }}>
      <BeatLabel n="05" name="Send-off" palette={p} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, position: 'relative' }}>
        {/* glowing aura behind the orb */}
        <div style={{
          position: 'absolute', width: 360, height: 360, borderRadius: '50%',
          background: `radial-gradient(circle, ${p.amberPale}55 0%, ${p.terra}33 35%, transparent 70%)`,
          filter: 'blur(30px)',
        }} />
        <window.BreathingOrb size={260} palette={p} />
      </div>
      <p style={{
        margin: '0 0 6px', fontSize: 24, lineHeight: 1.28, letterSpacing: -0.5, fontWeight: 400,
        color: '#FAF6EF', textAlign: 'center', textWrap: 'balance',
        textShadow: '0 2px 16px rgba(0,0,0,0.5)',
      }}>
        Carry this <em style={{ color: p.amberPale, fontStyle: 'italic', fontWeight: 500 }}>with you.</em>
      </p>
      <p style={{
        margin: '0 0 18px', fontSize: 14, fontStyle: 'italic',
        color: 'rgba(250,246,239,0.65)', textAlign: 'center',
      }}>
        Open your eyes when you're ready.
      </p>
    </div>
  );
}

function BeatLabel({ n, name, palette }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 22, marginBottom: 14 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 9.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
        color: 'rgba(250,246,239,0.55)',
      }}>
        <span style={{ width: 4, height: 4, borderRadius: 99, background: palette.amber }} />
        Beat {n} · {name}
      </div>
    </div>
  );
}

window.ScreenRitual = ScreenRitual;
