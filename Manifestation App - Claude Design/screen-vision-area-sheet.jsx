// screen-vision-area-sheet.jsx — Vision creation, take 2.
//
// Replaces the old 4-step "pick area → name → identity → photographs"
// vision-create flow with a single mini-sheet that opens over the board.
// One photo, one title, one identity line — all in one screen, scrim
// behind so the board stays visible.
//
// Three canvas states (state="..."):
//   "board-empty"   — onboarding step 6's grid, every tile empty
//   "sheet-open"    — mini-sheet over the board, mid-fill (Career)
//   "board-partial" — one tile filled (Career), the rest still tap-to-fill
//
// On the live app this is one component with internal state. On the
// design canvas we render the three snapshots side-by-side so the flow
// reads from left → right.

function ScreenVisionAreaSheet({ paletteKey = 'A', state = 'sheet-open' }) {
  const p = window.PALETTES[paletteKey];

  // Tiles change shape depending on state.
  const tiles = (function () {
    switch (state) {
      case 'board-partial':
        return [
          { area: 'Career',  identity: 'Sought-after', src: 'assets/work-paris.jpg',    filled: true  },
          { area: 'Health',  src: 'assets/health-runner.jpg', filled: false },
          { area: 'Love',    src: 'assets/love-hero.jpg',     filled: false },
          { area: 'Joy',     src: 'assets/work-coffee.jpg',   filled: false },
        ];
      case 'sheet-open':
        // Same as empty — the sheet is in front so what's underneath is
        // unfilled by design.
        return [
          { area: 'Career',  filled: false, focused: true },
          { area: 'Health',  filled: false },
          { area: 'Love',    filled: false },
          { area: 'Joy',     filled: false },
        ];
      case 'board-empty':
      default:
        return [
          { area: 'Career',  filled: false },
          { area: 'Health',  filled: false },
          { area: 'Love',    filled: false },
          { area: 'Joy',     filled: false },
        ];
    }
  })();

  const showSheet = state === 'sheet-open';

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Same cosmic gradient as the Vision board */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(80% 50% at 50% 100%, ${p.cosmicC}aa 0%, ${p.cosmicB}88 35%, ${p.cosmicA}ff 75%, ${p.cosmicA}ff 100%),
          radial-gradient(60% 40% at 50% 0%, ${p.terraDeep}55 0%, transparent 60%),
          ${p.cosmicA}
        `,
      }} />

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="3:42" />

        {/* Board header */}
        <div style={{ padding: '6px 24px 0', textAlign: 'center' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.55)', marginBottom: 8,
          }}>
            Your vision board · {tiles.length} areas
          </div>
          <h1 style={{
            margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.1,
            color: '#FAF6EF',
          }}>
            {state === 'board-partial' ? 'Building.' : "Let's begin."}
          </h1>
        </div>

        {/* The grid (always rendered — sheet floats over it for "sheet-open") */}
        <div style={{
          padding: '24px 20px 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
        }}>
          {tiles.map((t, i) => t.filled
            ? <FilledTile key={i} {...t} palette={p} />
            : <EmptyTile  key={i} {...t} palette={p} />
          )}
        </div>

        {/* Scrim + mini-sheet (only when state === "sheet-open") */}
        {showSheet && (
          <>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(20,12,6,0.62)',
              backdropFilter: 'blur(2px)',
            }} />
            <MiniSheet palette={p} />
          </>
        )}

        <window.TabBar active="vision" tone="light" palette={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

// ─── Board tiles (same shape as screen-vision.jsx) ────────────
function FilledTile({ area, identity, src, palette }) {
  const p = palette;
  return (
    <div style={{
      position: 'relative', aspectRatio: '0.78',
      borderRadius: 16, overflow: 'hidden',
      boxShadow: `0 14px 30px -6px rgba(0,0,0,0.45), 0 0 0 1px rgba(250,246,239,0.10)`,
    }}>
      <img src={src} alt="" style={{
        width: '100%', height: '100%', objectFit: 'cover',
        filter: 'saturate(0.88) brightness(0.92)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 38%, rgba(20,12,6,0.82) 100%)`,
      }} />
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
          color: p.terraLight, marginBottom: 4,
        }}>{area}</div>
        <div style={{
          fontSize: 16, fontWeight: 600, color: '#FAF6EF',
          letterSpacing: -0.3, fontStyle: 'italic', lineHeight: 1.15,
        }}>{identity}</div>
      </div>
    </div>
  );
}

function EmptyTile({ area, focused, palette }) {
  const p = palette;
  return (
    <div style={{
      position: 'relative', aspectRatio: '0.78',
      borderRadius: 16,
      background: 'rgba(250,246,239,0.04)',
      border: focused
        ? `1.5px solid ${p.amber}`
        : '1.5px dashed rgba(250,246,239,0.22)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 10, padding: 14, textAlign: 'center',
      boxShadow: focused ? `0 0 22px ${p.amber}55` : 'none',
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

// ─── Mini-sheet — one screen, three inputs (photo / name / identity)
function MiniSheet({ palette }) {
  const p = palette;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      borderRadius: '28px 28px 0 0',
      background: `linear-gradient(180deg, ${p.cosmicB}f8 0%, ${p.cosmicA}fc 100%)`,
      border: `1px solid ${p.amber}33`,
      borderBottom: 'none',
      boxShadow: `0 -22px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(250,246,239,0.04)`,
      padding: '12px 22px 28px',
      zIndex: 20,
    }}>
      {/* Drag handle */}
      <div style={{
        width: 44, height: 4, borderRadius: 99,
        background: 'rgba(250,246,239,0.28)',
        margin: '0 auto 16px',
      }} />

      {/* Eyebrow + headline */}
      <div style={{
        fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
        color: p.amber, marginBottom: 6,
      }}>Career</div>
      <h2 style={{
        margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.2,
        color: '#FAF6EF', marginBottom: 18,
      }}>
        Bring it to life.
      </h2>

      {/* Photo picker — single select */}
      <div style={{
        height: 132, borderRadius: 18, overflow: 'hidden',
        position: 'relative', marginBottom: 14,
        boxShadow: `0 14px 30px -6px rgba(0,0,0,0.5), 0 0 0 1px ${p.amber}33`,
      }}>
        <img src="assets/work-paris.jpg" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'saturate(0.9) brightness(0.95)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, transparent 50%, rgba(20,12,6,0.55) 100%)`,
        }} />
        <button style={{
          position: 'absolute', right: 10, bottom: 10,
          padding: '6px 12px', borderRadius: 99,
          background: 'rgba(20,12,6,0.65)',
          border: '1px solid rgba(250,246,239,0.22)',
          backdropFilter: 'blur(8px)',
          color: '#FAF6EF',
          fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
          letterSpacing: 0.3, cursor: 'pointer',
        }}>Replace</button>
      </div>

      {/* Name input */}
      <div style={{
        padding: '12px 14px',
        borderRadius: 12,
        background: 'rgba(250,246,239,0.06)',
        border: `1px solid ${p.amber}44`,
        backdropFilter: 'blur(8px)',
        marginBottom: 10,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
          color: 'rgba(250,246,239,0.5)', marginBottom: 4,
        }}>Name it</div>
        <div style={{
          fontSize: 16, fontWeight: 500, fontStyle: 'italic',
          color: '#FAF6EF', letterSpacing: -0.2, lineHeight: 1.3,
        }}>
          The Studio of My Own.<span style={{ color: p.amber, fontStyle: 'normal' }}>|</span>
        </div>
      </div>

      {/* Identity input */}
      <div style={{
        padding: '12px 14px',
        borderRadius: 12,
        background: 'rgba(250,246,239,0.06)',
        border: `1px solid rgba(250,246,239,0.12)`,
        backdropFilter: 'blur(8px)',
        marginBottom: 18,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
          color: 'rgba(250,246,239,0.5)', marginBottom: 4,
        }}>Who you're becoming</div>
        <div style={{
          fontSize: 14.5, fontWeight: 400, fontStyle: 'italic',
          color: 'rgba(250,246,239,0.88)', letterSpacing: -0.1, lineHeight: 1.35,
        }}>
          I am a sought-after designer.
        </div>
      </div>

      {/* CTA */}
      <button style={{
        width: '100%', height: 52, borderRadius: 26,
        background: `linear-gradient(135deg, ${p.terra} 0%, ${p.terraDeep} 100%)`,
        color: '#FAF6EF', border: 'none',
        fontFamily: 'inherit', fontSize: 15, fontWeight: 600, letterSpacing: 0.1,
        cursor: 'pointer',
        boxShadow: `0 14px 30px ${p.terra}55, 0 1px 0 rgba(255,255,255,0.22) inset`,
      }}>
        Add to board
      </button>
    </div>
  );
}

window.ScreenVisionAreaSheet = ScreenVisionAreaSheet;
