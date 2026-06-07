// screen-buddy.jsx — The Witness.
// One person you've invited to witness your wins. They see yours;
// you see theirs. Nothing else. Same emotional register as Wins:
// cinematic, dark, intimate. Two breathing orbs at the top to
// signify the bond, then an interleaved feed of recent wins from
// both of you, with a soft visual distinction between you and them.

function ScreenBuddy({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Same cosmic warm gradient as Wins/Vision */}
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
        backgroundImage: `radial-gradient(circle at 22% 18%, ${p.amber}22 0%, transparent 4%),
                          radial-gradient(circle at 82% 12%, ${p.terraLight}22 0%, transparent 3%),
                          radial-gradient(circle at 38% 52%, ${p.amber}22 0%, transparent 2.5%),
                          radial-gradient(circle at 86% 68%, ${p.amber}22 0%, transparent 3%)`,
      }} />

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="3:42" />

        {/* Header — back + title + settings */}
        <div style={{ padding: '6px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={{
            width: 38, height: 38, borderRadius: 99,
            background: 'rgba(250,246,239,0.08)', border: '1px solid rgba(250,246,239,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.6)',
          }}>The witness</div>
          <button style={{
            width: 38, height: 38, borderRadius: 99,
            background: 'rgba(250,246,239,0.08)', border: '1px solid rgba(250,246,239,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>

        {/* Pair hero — two orbs, names, bond meta */}
        <div style={{ padding: '14px 24px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', height: 92, width: 200, marginBottom: 14 }}>
            {/* you */}
            <div style={{
              position: 'absolute', left: 0, top: 6,
              width: 80, height: 80, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${p.amber} 55%, ${p.amberDeep})`,
              boxShadow: `0 6px 18px ${p.amber}88, inset 0 4px 10px rgba(255,236,210,0.5)`,
            }} />
            {/* them */}
            <div style={{
              position: 'absolute', right: 0, top: 6,
              width: 80, height: 80, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${p.terra} 60%, ${p.terraDeep})`,
              boxShadow: `0 6px 18px ${p.terra}88, inset 0 4px 10px rgba(255,236,210,0.5)`,
            }} />
            {/* connecting thread */}
            <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 200 92">
              <defs>
                <linearGradient id="bThread" x1="0" x2="1">
                  <stop offset="0%" stopColor={p.amber} stopOpacity="0.0"/>
                  <stop offset="50%" stopColor={p.amber} stopOpacity="0.7"/>
                  <stop offset="100%" stopColor={p.terraLight} stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 80 46 Q 100 36 120 46" fill="none" stroke="url(#bThread)" strokeWidth="1.2" strokeDasharray="2 3"/>
            </svg>
          </div>
          <div style={{
            fontSize: 16, fontWeight: 600, color: '#FAF6EF', letterSpacing: -0.2, marginBottom: 4,
          }}>
            You <span style={{ color: 'rgba(250,246,239,0.4)', fontWeight: 400, padding: '0 6px' }}>·</span> Sam
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.5)',
          }}>
            <span style={{ color: p.amber }}>34 days</span> witnessing each other
          </div>
        </div>

        {/* Toggle row — "Both" / "Yours" / "Hers" — like a soft tab */}
        <div style={{ padding: '0 22px 16px' }}>
          <div style={{
            display: 'flex', borderRadius: 99,
            background: 'rgba(20,12,6,0.4)', border: '1px solid rgba(250,246,239,0.10)',
            padding: 4, backdropFilter: 'blur(12px)',
          }}>
            {['Both', 'Yours', 'Hers'].map((t, i) => (
              <div key={i} style={{
                flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 99,
                fontSize: 12, fontWeight: 600, letterSpacing: 0.1,
                color: i === 0 ? '#1F1308' : 'rgba(250,246,239,0.6)',
                background: i === 0 ? p.amber : 'transparent',
                cursor: 'pointer',
              }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Feed — interleaved wins, "you" vs "them" with subtle distinction */}
        <div style={{
          padding: '0 22px 110px',
          height: 'calc(100% - 76px - 92px - 14px - 28px - 36px - 48px)',
          overflow: 'hidden',
          maskImage: 'linear-gradient(180deg, black 0%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 90%, transparent 100%)',
        }}>
          {/* DAY DIVIDER */}
          <DayMarker palette={p} day="Today" />

          <BuddyEntry
            palette={p} who="theirs" name="Sam" time="2 hr ago"
            kind="photo" src="assets/health-runner.jpg"
            caption="First 5K since the surgery."
            area="Health"
          />

          <BuddyEntry
            palette={p} who="yours" name="You" time="4 hr ago"
            kind="text"
            body="Said no to the call. Held the calendar."
            area="Career"
          />

          <BuddyEntry
            palette={p} who="theirs" name="Sam" time="6 hr ago"
            kind="text"
            body="Cooked dinner without checking my phone."
            area="Joy"
          />

          <DayMarker palette={p} day="Yesterday" />

          <BuddyEntry
            palette={p} who="yours" name="You" time="May 4 · 6:48 PM"
            kind="photo" src="assets/work-coffee.jpg"
            caption="First paying client said yes."
            area="Career"
          />
        </div>

        {/* Whisper composer — tiny private note input */}
        <div style={{
          position: 'absolute', left: 16, right: 16, bottom: 100,
          padding: '10px 12px 10px 16px', borderRadius: 99,
          background: 'rgba(20,12,6,0.65)',
          border: '1px solid rgba(250,246,239,0.14)',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 14px 30px -10px rgba(0,0,0,0.5)',
        }}>
          <span style={{
            fontSize: 13, fontWeight: 500, color: 'rgba(250,246,239,0.55)',
            fontStyle: 'italic', flex: 1,
          }}>Send Sam a quiet "I see you"…</span>
          <button style={{
            width: 34, height: 34, borderRadius: 99,
            background: `linear-gradient(135deg, ${p.terra}, ${p.terraDeep})`,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px ${p.terra}66`,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        </div>

        <window.TabBar active="wins" tone="light" palette={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

// ─── Day marker ──────────────────────────────────────────────
function DayMarker({ palette, day }) {
  const p = palette;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '0 0 14px' }}>
      <span style={{
        fontSize: 10.5, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
        color: '#FAF6EF',
      }}>{day}</span>
      <span style={{ flex: 1, height: 1, background: 'rgba(250,246,239,0.10)', marginBottom: 3 }} />
    </div>
  );
}

// ─── Buddy entry — "yours" or "theirs" alignment ───────────────
function BuddyEntry({ palette, who, name, time, kind, src, caption, body, area }) {
  const p = palette;
  const isYours = who === 'yours';
  const accent = area === 'Health' ? p.sage : area === 'Love' ? p.terraLight : p.amber;
  // theirs: left-aligned, terra-tinted; yours: right-aligned, amber-tinted
  return (
    <div style={{
      display: 'flex', justifyContent: isYours ? 'flex-end' : 'flex-start',
      marginBottom: 14,
    }}>
      <div style={{ maxWidth: '82%', minWidth: 220 }}>
        {/* avatar/name strip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 6, flexDirection: isYours ? 'row-reverse' : 'row',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: isYours
              ? `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${p.amber} 55%, ${p.amberDeep})`
              : `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${p.terra} 60%, ${p.terraDeep})`,
            boxShadow: `0 2px 6px ${(isYours ? p.amber : p.terra)}88`,
          }} />
          <span style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
            color: '#FAF6EF',
          }}>{name}</span>
          <span style={{
            fontSize: 9.5, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.42)',
          }}>· {time}</span>
        </div>

        {kind === 'photo' && (
          <div style={{
            position: 'relative', height: 200, borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 14px 30px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(250,246,239,0.06)',
          }}>
            <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85)' }} />
            <div style={{ position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, transparent 40%, rgba(20,12,6,0.85) 100%)` }} />
            <div style={{ position: 'absolute', left: 12, right: 12, bottom: 10 }}>
              <div style={{
                color: '#FAF6EF', fontSize: 13.5, fontWeight: 500, lineHeight: 1.3,
                marginBottom: 4, textShadow: '0 1px 8px rgba(0,0,0,0.5)',
              }}>{caption}</div>
              <span style={{
                fontSize: 8.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
                color: accent,
              }}>↳ {area}</span>
            </div>
          </div>
        )}

        {kind === 'text' && (
          <div style={{
            padding: '14px 16px 12px', borderRadius: 18,
            background: isYours ? `${p.amber}15` : 'rgba(250,246,239,0.06)',
            border: `1px solid ${isYours ? p.amber + '33' : 'rgba(250,246,239,0.10)'}`,
            backdropFilter: 'blur(20px)',
          }}>
            <p style={{
              margin: 0, fontSize: 14, lineHeight: 1.4, fontWeight: 500, letterSpacing: -0.1,
              color: '#FAF6EF', textWrap: 'pretty', marginBottom: 8,
            }}>{body}</p>
            <span style={{
              fontSize: 8.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
              color: accent,
            }}>↳ {area}</span>
          </div>
        )}

        {/* witness reaction — soft ack */}
        <div style={{
          marginTop: 6, display: 'flex',
          justifyContent: isYours ? 'flex-end' : 'flex-start',
          alignItems: 'center', gap: 5,
          fontSize: 10, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          color: 'rgba(250,246,239,0.42)',
        }}>
          <span style={{
            width: 14, height: 14, borderRadius: 99,
            background: 'rgba(250,246,239,0.08)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
          </span>
          {isYours ? 'Sam saw this' : 'You witnessed'}
        </div>
      </div>
    </div>
  );
}

window.ScreenBuddy = ScreenBuddy;
