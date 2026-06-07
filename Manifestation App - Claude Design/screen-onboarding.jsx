// screen-onboarding.jsx — 8-beat cinematic onboarding (Innerproof).
//
// THE STORY: there's a future version of you, already in motion.
// The Anchor Method is how you reach it. Three acts:
// Manifest (build the picture), Visualize (step into it daily),
// Document (capture proof of becoming).
//
// v2 change (feedback round 1): the old per-vision setup (O05–O09:
// pick one area → name → identity → 3–5 photos → reveal) became
// decision fatigue. Replaced with a multi-select Areas screen + a
// build-the-board canvas where the user fills any area in any order
// via a single mini-sheet. The board they see at O06 is *the same
// board* they'll live with in the Vision tab — no "reveal" needed.
//
//  1: Welcome — "The future you, already in motion"
//  2: The Method — Manifest · Visualize · Document (3-act loop named)
//  3: Why this works — manifestation → action bridge
//  4: The daily loop — what each day feels like
//  5: Pick the areas of life that matter (multi-select 3–5)
//  6: Build your vision board (canvas — tap any tile to fill it)
//  7: Witness invite (skip-able)
//  8: Morning ritual time

function ScreenOnboarding({ paletteKey = 'A', step = 1 }) {
  const p = window.PALETTES[paletteKey];
  return (
    <window.Phone paletteKey={paletteKey}>
      {step === 1 && <Onb1 p={p} />}
      {step === 2 && <Onb2 p={p} />}
      {step === 3 && <Onb3 p={p} />}
      {step === 4 && <Onb4 p={p} />}
      {step === 5 && <Onb5 p={p} />}
      {step === 6 && <Onb6 p={p} />}
      {step === 7 && <Onb7 p={p} />}
      {step === 8 && <Onb8 p={p} />}
    </window.Phone>
  );
}

const TOTAL = 8;

// ─── 1: Welcome ──────────────────────────────────────────────
function Onb1({ p }) {
  return (
    <>
      <img src="assets/onboarding-hero.jpg" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', filter: 'saturate(0.85) contrast(1.05)',
      }} />
      <div style={{ position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(20,12,6,0.25) 0%, transparent 35%, rgba(20,12,6,0.85) 100%)`,
      }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', color: '#FAF6EF' }}>
        <window.StatusBar tone="light" time="7:14" />
        <div style={{ flex: 1 }} />
        <div style={{ padding: '0 32px 36px' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
            color: p.amber, marginBottom: 16,
          }}>Innerproof</div>
          <h1 style={{
            margin: '0 0 16px', fontSize: 36, fontWeight: 500, letterSpacing: -0.8, lineHeight: 1.05,
            textShadow: '0 4px 22px rgba(0,0,0,0.5)',
          }}>
            A daily practice for<br/>becoming who you<br/>want to be.
          </h1>
          <p style={{
            margin: '0 0 40px', fontSize: 16, lineHeight: 1.55,
            color: 'rgba(250,246,239,0.85)', textWrap: 'pretty',
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}>
            90 seconds in the morning. Capture small wins all day. Watch yourself change.
          </p>
          <button style={{
            width: '100%', height: 60, borderRadius: 30,
            background: '#FAF6EF', color: p.terraDeep, border: 'none',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 600, letterSpacing: 0.1,
            cursor: 'pointer', boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
          }}>Begin</button>
          <button style={{
            width: '100%', marginTop: 12, padding: 12, background: 'transparent',
            border: 'none', color: 'rgba(250,246,239,0.7)', fontFamily: 'inherit',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>I already have an account</button>
        </div>
        <window.HomeIndicator tone="light" />
      </div>
    </>
  );
}

// ─── 2: The Method (3-act loop) ──────────────────────────────
function Onb2({ p }) {
  return (
    <>
      <CosmicBg p={p} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', color: '#FAF6EF' }}>
        <window.StatusBar tone="light" time="7:14" />
        <OnbHeader step={2} p={p} />
        <div style={{ padding: '28px 32px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
            color: p.amber, marginBottom: 12,
          }}>How it works</div>
          <h1 style={{
            margin: '0 0 8px', fontSize: 30, fontWeight: 500, letterSpacing: -0.8, lineHeight: 1.1,
          }}>
            Three steps.<br/>
            Repeated daily.
          </h1>
          <p style={{ margin: '0 0 32px', fontSize: 14.5, color: 'rgba(250,246,239,0.7)', lineHeight: 1.55, textWrap: 'pretty' }}>
            Set up once. Practice every morning. Build proof over time.
          </p>

          {/* Three acts as numbered cards with connecting thread */}
          <div style={{ position: 'relative', flex: 1 }}>
            {/* connecting thread */}
            <svg style={{ position: 'absolute', left: 22, top: 22, bottom: 16, width: 2 }} preserveAspectRatio="none" viewBox="0 0 2 380">
              <line x1="1" y1="0" x2="1" y2="380" stroke={p.amber} strokeWidth="1" strokeDasharray="2 4" opacity="0.45"/>
            </svg>
            <ActCard num="01" title="Manifest" cadence="One-time setup"
              body="Build a vision board. The ritual draws from it."
              accent={p.amber} p={p} />
            <ActCard num="02" title="Visualize" cadence="Every morning"
              body="A 90-second voice-guided practice."
              accent={p.terraLight} p={p} />
            <ActCard num="03" title="Document" cadence="Throughout the day"
              body="Capture small wins as proof."
              accent={p.sage} p={p} />
          </div>
        </div>
        <OnbCta label="Continue" p={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </>
  );
}

function ActCard({ num, title, cadence, body, accent, p }) {
  return (
    <div style={{
      position: 'relative', display: 'flex', gap: 16, alignItems: 'flex-start',
      padding: '0 0 24px 0',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${accent} 55%, ${accent}cc)`,
        boxShadow: `0 4px 14px ${accent}66, inset 0 2px 6px rgba(255,236,210,0.4)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
        color: '#1F1308', flexShrink: 0, zIndex: 1,
      }}>{num}</div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <div style={{
            fontSize: 18, fontWeight: 600, color: '#FAF6EF', letterSpacing: -0.3,
          }}>{title}</div>
          {cadence && (
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
              color: accent,
            }}>· {cadence}</div>
          )}
        </div>
        <div style={{
          fontSize: 13.5, lineHeight: 1.5, color: 'rgba(250,246,239,0.75)',
          textWrap: 'pretty',
        }}>{body}</div>
      </div>
    </div>
  );
}

// ─── 3: Why this works ───────────────────────────────────────
function Onb3({ p }) {
  return (
    <>
      <CosmicBg p={p} terra />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', color: '#FAF6EF' }}>
        <window.StatusBar tone="light" time="7:14" />
        <OnbHeader step={3} p={p} />
        <div style={{ padding: '28px 32px 0', flex: 1 }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
            color: p.amber, marginBottom: 14,
          }}>Why this works</div>
          <h1 style={{
            margin: '0 0 18px', fontSize: 30, fontWeight: 500, letterSpacing: -0.8, lineHeight: 1.1,
          }}>
            Identity drives action.
          </h1>
          <p style={{
            margin: '0 0 22px', fontSize: 15, color: 'rgba(250,246,239,0.84)',
            lineHeight: 1.55, textWrap: 'pretty',
          }}>
            Goals fade. Identity sticks. When you can picture who you're becoming, your day points there.
          </p>

          {/* three soft proof points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            <ProofRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/></svg>}
              title="Visualization rewires"
              body="Athletes use mental imagery. Your brain rehearses the version of you who already does it."
              p={p}
            />
            <ProofRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l4 4 14-14"/></svg>}
              title="Small wins compound"
              body="Daily proof builds identity faster than big milestones."
              p={p}
            />
            <ProofRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>}
              title="Identity beats discipline"
              body="When the action matches who you are, you don't push. You do."
              p={p}
            />
          </div>
        </div>
        <OnbCta label="Continue" p={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </>
  );
}

function ProofRow({ icon, title, body, p }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 99,
        background: `${p.amber}1f`, border: `1px solid ${p.amber}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 2,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: '#FAF6EF', marginBottom: 3, letterSpacing: -0.1 }}>{title}</div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(250,246,239,0.66)', textWrap: 'pretty' }}>{body}</div>
      </div>
    </div>
  );
}

// ─── 4: The daily loop ───────────────────────────────────────
function Onb4({ p }) {
  return (
    <>
      <CosmicBg p={p} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', color: '#FAF6EF' }}>
        <window.StatusBar tone="light" time="7:14" />
        <OnbHeader step={4} p={p} />
        <div style={{ padding: '28px 32px 0', flex: 1 }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
            color: p.amber, marginBottom: 12,
          }}>What your days will look like</div>
          <h1 style={{
            margin: '0 0 14px', fontSize: 28, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.15,
          }}>
            Set up once.<br/>Practice every day.
          </h1>
          <p style={{
            margin: '0 0 24px', fontSize: 14, color: 'rgba(250,246,239,0.78)',
            lineHeight: 1.55, textWrap: 'pretty',
          }}>
            Set up your vision once. It powers your daily practice.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <PromiseRow num="ONE-TIME · ~5 MIN" title="Set up your vision"
              body="Pick an area, name it, write your identity, choose photos." p={p} />
            <PromiseRow num="DAILY · 90 SEC" title="Morning ritual"
              body="Listen, visualize your vision, set today's intention." p={p} />
            <PromiseRow num="DAILY · ALL DAY" title="Capture small wins"
              body="Note small actions that show you're getting there." p={p} />
          </div>
        </div>
        <OnbCta label="Set up my vision" p={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </>
  );
}

function PromiseRow({ num, title, body, p }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6, color: p.amber, textTransform: 'uppercase',
      }}>{num}</div>
      <div style={{
        fontSize: 17, fontWeight: 600, color: '#FAF6EF', letterSpacing: -0.2, marginBottom: 2,
      }}>{title}</div>
      <div style={{
        fontSize: 13.5, lineHeight: 1.5, color: 'rgba(250,246,239,0.75)', textWrap: 'pretty',
      }}>{body}</div>
    </div>
  );
}

// ─── 5: Pick the areas of life that matter (multi-select 3–5) ─
function Onb5({ p }) {
  const areas = [
    { label: 'Career',  sub: "work, what you're building",         img: 'assets/work-paris.jpg',    selected: true  },
    { label: 'Health',  sub: 'body, energy, sleep',                 img: 'assets/health-runner.jpg', selected: true  },
    { label: 'Love',    sub: 'relationships, family, dating',       img: 'assets/love-hero.jpg',     selected: true  },
    { label: 'Finance', sub: 'money, freedom, security',            img: 'assets/work-window.jpg',   selected: false },
    { label: 'Joy',     sub: 'play, hobbies, what lights you up',   img: 'assets/work-coffee.jpg',   selected: true  },
  ];
  const count = areas.filter(a => a.selected).length;
  return (
    <>
      <CosmicBg p={p} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', color: '#FAF6EF' }}>
        <window.StatusBar tone="light" time="7:14" />
        <OnbHeader step={5} p={p} />
        <div style={{ padding: '28px 24px 0', flex: 1, overflow: 'hidden' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
            color: p.amber, marginBottom: 12,
          }}>Step 1 of 2 · Vision setup · {count} picked</div>
          <h1 style={{
            margin: '0 0 8px', fontSize: 26, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.2,
          }}>
            Pick the areas of life<br/>that matter most.
          </h1>
          <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'rgba(250,246,239,0.75)', lineHeight: 1.5, textWrap: 'pretty' }}>
            Choose 3 to 5. You can add more anytime.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {areas.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 14px', borderRadius: 16,
                background: a.selected ? `${p.amber}1f` : 'rgba(250,246,239,0.05)',
                border: `1px solid ${a.selected ? p.amber + '88' : 'rgba(250,246,239,0.10)'}`,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                  boxShadow: a.selected ? `0 0 14px ${p.amber}aa` : 'none' }}>
                  <img src={a.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{a.label}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(250,246,239,0.55)', fontStyle: 'italic' }}>{a.sub}</div>
                </div>
                {a.selected && (
                  <span style={{
                    width: 22, height: 22, borderRadius: 99, background: p.amber,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 10px ${p.amber}aa`,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1F1308" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                  </span>
                )}
              </div>
            ))}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 16,
              background: 'rgba(250,246,239,0.03)',
              border: '1px dashed rgba(250,246,239,0.22)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'rgba(250,246,239,0.04)',
                border: '1px dashed rgba(250,246,239,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(250,246,239,0.7)" strokeWidth="1.6" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(250,246,239,0.92)' }}>Something else</div>
                <div style={{ fontSize: 11.5, color: 'rgba(250,246,239,0.5)', fontStyle: 'italic' }}>name your own area</div>
              </div>
            </div>
          </div>
        </div>
        <OnbCta label="Continue" p={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </>
  );
}

// ─── 6: Build your vision board (canvas — tap any tile to fill it) ─
//
// Showing one tile (Career) already filled and the rest as empty
// placeholders. The "tap to fill" affordance hints at the mini-sheet
// flow detailed in screen-vision-area-sheet.jsx. Skip-friendly: ≥1 area
// filled is enough to continue, the rest can be filled from the Vision
// tab over time.
function Onb6_Build_Board({ p }) {
  const tiles = [
    { area: 'Career',  identity: 'Sought-after', src: 'assets/work-paris.jpg',    filled: true  },
    { area: 'Health',  src: 'assets/health-runner.jpg', filled: false },
    { area: 'Love',    src: 'assets/love-hero.jpg',     filled: false },
    { area: 'Joy',     src: 'assets/work-coffee.jpg',   filled: false },
  ];
  return (
    <>
      <CosmicBg p={p} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', color: '#FAF6EF' }}>
        <window.StatusBar tone="light" time="7:14" />
        <OnbHeader step={6} p={p} />
        <div style={{ padding: '24px 20px 0', flex: 1, overflow: 'hidden' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
            color: p.amber, marginBottom: 10,
          }}>Step 2 of 2 · Build · 1 of 4 filled</div>
          <h1 style={{
            margin: '0 0 6px', fontSize: 26, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.2,
          }}>
            Build your vision board.
          </h1>
          <p style={{ margin: '0 0 22px', fontSize: 13.5, color: 'rgba(250,246,239,0.75)', lineHeight: 1.5, textWrap: 'pretty' }}>
            Tap each area to bring it to life. Skip what you're not ready for.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {tiles.map((t, i) => t.filled
              ? <FilledBoardTile key={i} {...t} palette={p} />
              : <EmptyBoardTile  key={i} {...t} palette={p} />
            )}
          </div>
        </div>
        <OnbCta label="Continue" p={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </>
  );
}
const Onb6 = Onb6_Build_Board;

// Filled tile — same visual as the canonical board card.
function FilledBoardTile({ area, identity, src, palette }) {
  const p = palette;
  return (
    <div style={{
      position: 'relative', aspectRatio: '0.78',
      borderRadius: 14, overflow: 'hidden',
      boxShadow: `0 14px 30px -6px rgba(0,0,0,0.45), 0 0 0 1px ${p.amber}55, 0 0 18px ${p.amber}33`,
    }}>
      <img src={src} alt="" style={{
        width: '100%', height: '100%', objectFit: 'cover',
        filter: 'saturate(0.88) brightness(0.92)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 38%, rgba(20,12,6,0.82) 100%)`,
      }} />
      <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
        <div style={{
          fontSize: 8.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
          color: p.terraLight, marginBottom: 3,
        }}>{area}</div>
        <div style={{
          fontSize: 14, fontWeight: 600, color: '#FAF6EF',
          letterSpacing: -0.2, fontStyle: 'italic', lineHeight: 1.15,
        }}>{identity}</div>
      </div>
    </div>
  );
}

// Empty tile — area name + dashed border + "Tap to fill" affordance.
function EmptyBoardTile({ area, palette }) {
  const p = palette;
  return (
    <div style={{
      position: 'relative', aspectRatio: '0.78',
      borderRadius: 14,
      background: 'rgba(250,246,239,0.04)',
      border: '1.5px dashed rgba(250,246,239,0.22)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 10, padding: 14, textAlign: 'center',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 99,
        background: `${p.amber}22`, border: `1px solid ${p.amber}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: '#FAF6EF' }}>
        {area}
      </div>
      <div style={{
        fontSize: 10, color: 'rgba(250,246,239,0.50)',
        letterSpacing: 0.2, lineHeight: 1.3, fontStyle: 'italic',
      }}>Tap to fill</div>
    </div>
  );
}

// ─── 7: Witness invite (skip-able) ───────────────────────────
// Was Onb10 in the 11-beat version.
function Onb7({ p }) {
  return (
    <>
      <CosmicBg p={p} terra />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', color: '#FAF6EF' }}>
        <window.StatusBar tone="light" time="7:14" />
        <OnbHeader step={7} p={p} />
        <div style={{ padding: '40px 32px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', height: 140, marginBottom: 28 }}>
            <div style={{
              position: 'absolute', left: '50%', top: '50%', transform: 'translate(-72%, -50%)',
              width: 110, height: 110, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${p.terra} 60%, ${p.terraDeep})`,
              boxShadow: `0 6px 18px ${p.terra}88, inset 0 4px 10px rgba(255,236,210,0.5)`,
            }} />
            <div style={{
              position: 'absolute', left: '50%', top: '50%', transform: 'translate(-28%, -50%)',
              width: 110, height: 110, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${p.amber} 55%, ${p.amberDeep})`,
              boxShadow: `0 6px 18px ${p.amber}88, inset 0 4px 10px rgba(255,236,210,0.5)`,
            }} />
          </div>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
            color: p.amber, marginBottom: 12, textAlign: 'center',
          }}>Optional · Accountability</div>
          <h1 style={{
            margin: '0 0 16px', fontSize: 26, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.15,
            textAlign: 'center', textWrap: 'balance',
          }}>
            Want one person to see your wins?
          </h1>
          <p style={{
            margin: '0 0 28px', fontSize: 14, color: 'rgba(250,246,239,0.78)',
            lineHeight: 1.55, textAlign: 'center', textWrap: 'pretty', padding: '0 8px',
          }}>
            If you pick someone, they'll see the wins you mark as shared. They won't see your vision, your photos, or anything else. You can skip and add someone later from Settings.
          </p>
          <button style={{
            width: '100%', height: 56, borderRadius: 28,
            background: `linear-gradient(135deg, ${p.terra} 0%, ${p.terraDeep} 100%)`,
            color: '#FAF6EF', border: 'none', fontFamily: 'inherit',
            fontSize: 15.5, fontWeight: 600, cursor: 'pointer',
            boxShadow: `0 18px 40px ${p.terra}55, 0 1px 0 rgba(255,255,255,0.25) inset`,
            marginBottom: 12,
          }}>Invite someone</button>
          <button style={{
            width: '100%', height: 50, background: 'transparent', border: 'none',
            color: 'rgba(250,246,239,0.6)', fontFamily: 'inherit',
            fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
          }}>Skip for now</button>
        </div>
        <window.HomeIndicator tone="light" />
      </div>
    </>
  );
}

// ─── 8: Morning ritual time ──────────────────────────────────
// Was Onb11 in the 11-beat version.
function Onb8({ p }) {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(60% 50% at 50% 50%, ${p.terra}55 0%, transparent 50%),
          radial-gradient(80% 60% at 50% 100%, ${p.cosmicC}aa 0%, ${p.cosmicA} 70%),
          ${p.cosmicA}
        `,
      }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', color: '#FAF6EF' }}>
        <window.StatusBar tone="light" time="7:14" />
        <OnbHeader step={8} p={p} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -40, borderRadius: '50%',
              background: `radial-gradient(circle, ${p.amberPale}66, transparent 70%)`, filter: 'blur(20px)',
            }} />
            <window.BreathingOrb size={180} palette={p} />
          </div>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase',
            color: p.amber, marginTop: 36, marginBottom: 14, textAlign: 'center',
          }}>You're all set</div>
          <h1 style={{
            margin: '0 0 16px', fontSize: 26, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.15,
            textAlign: 'center', textWrap: 'balance',
            textShadow: '0 2px 16px rgba(0,0,0,0.5)',
          }}>
            When do you want your morning ritual?
          </h1>
          <p style={{
            margin: '0 0 20px', fontSize: 14, color: 'rgba(250,246,239,0.8)',
            lineHeight: 1.55, textAlign: 'center', textWrap: 'pretty', padding: '0 12px',
          }}>
            Pick a time between 5am and 10am. Each night, we'll prepare your 90-second ritual so it's ready when you wake up.
          </p>
        </div>
        <div style={{ padding: '0 22px 24px' }}>
          <button style={{
            width: '100%', height: 60, borderRadius: 30,
            background: `linear-gradient(135deg, ${p.terra} 0%, ${p.terraDeep} 100%)`,
            color: '#FAF6EF', border: 'none', fontFamily: 'inherit',
            fontSize: 16, fontWeight: 600, cursor: 'pointer',
            boxShadow: `0 18px 40px ${p.terra}55, 0 1px 0 rgba(255,255,255,0.25) inset`,
          }}>Save my time</button>
        </div>
        <window.HomeIndicator tone="light" />
      </div>
    </>
  );
}

// ─── shared bg + header + CTA ────────────────────────────────
function CosmicBg({ p, terra }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: terra
        ? `radial-gradient(80% 60% at 50% 30%, ${p.terra}44 0%, transparent 60%), ${p.cosmicA}`
        : `radial-gradient(70% 50% at 50% 0%, ${p.terraDeep}55 0%, transparent 55%), ${p.cosmicA}`,
    }} />
  );
}

function OnbHeader({ step, p }) {
  return (
    <div style={{ padding: '6px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button style={{
        width: 36, height: 36, borderRadius: 99,
        background: 'rgba(250,246,239,0.08)', border: '1px solid rgba(250,246,239,0.16)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span key={i} style={{
            width: i + 1 === step ? 18 : 5, height: 3, borderRadius: 99,
            background: i + 1 <= step ? p.amber : 'rgba(250,246,239,0.18)',
          }} />
        ))}
      </div>
      <div style={{ width: 36 }} />
    </div>
  );
}

function OnbCta({ label, p }) {
  return (
    <div style={{ padding: '0 22px 24px' }}>
      <button style={{
        width: '100%', height: 60, borderRadius: 30,
        background: `linear-gradient(135deg, ${p.terra} 0%, ${p.terraDeep} 100%)`,
        color: '#FAF6EF', border: 'none', fontFamily: 'inherit',
        fontSize: 16, fontWeight: 600, cursor: 'pointer',
        boxShadow: `0 18px 40px ${p.terra}55, 0 1px 0 rgba(255,255,255,0.25) inset`,
      }}>{label}</button>
    </div>
  );
}

window.ScreenOnboarding = ScreenOnboarding;
