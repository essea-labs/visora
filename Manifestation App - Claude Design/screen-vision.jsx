// screen-vision.jsx — CANONICAL Vision Board.
//
// Replaces the earlier scattered-collage explorations
// (concept-a "scrapbook" and concept-c "future self with golden threads").
// Concept-b survives as the immersive Vision Player you reach by tapping a
// card. The board itself is now a calm 2-column grid of life areas — one
// photo per area, identity line beneath. Reading it top-to-bottom is
// supposed to feel like reading a self-portrait:
//   "I am sought-after. I am strong. I am chosen. I am free. I am lit up."
//
// Layout primitives reused from screen-vision-concept-c.jsx
// (CollagePiece sizing, label/identity stack, terra-light eyebrow).

function ScreenVision({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  const areas = [
    { area: 'Career',  identity: 'Sought-after', wins: 14, src: 'assets/work-paris.jpg'    },
    { area: 'Health',  identity: 'Strong',        wins: 9,  src: 'assets/health-runner.jpg' },
    { area: 'Love',    identity: 'Chosen',        wins: 7,  src: 'assets/love-hero.jpg'     },
    { area: 'Finance', identity: 'Free',          wins: 5,  src: 'assets/work-window.jpg'   },
    { area: 'Joy',     identity: 'Lit up',        wins: 11, src: 'assets/work-coffee.jpg'   },
  ];
  const totalProofs = areas.reduce((acc, a) => acc + a.wins, 0);

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Cosmic warm gradient — same family as ritual/settings/capture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(80% 50% at 50% 100%, ${p.cosmicC}aa 0%, ${p.cosmicB}88 35%, ${p.cosmicA}ff 75%, ${p.cosmicA}ff 100%),
          radial-gradient(60% 40% at 50% 0%, ${p.terraDeep}55 0%, transparent 60%),
          ${p.cosmicA}
        `,
      }} />
      {/* Soft starfield grain */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'overlay',
        backgroundImage: `radial-gradient(circle at 22% 18%, ${p.amber}22 0%, transparent 4%),
                          radial-gradient(circle at 82% 12%, ${p.terraLight}22 0%, transparent 3%),
                          radial-gradient(circle at 38% 52%, ${p.amber}22 0%, transparent 2.5%),
                          radial-gradient(circle at 86% 68%, ${p.amber}22 0%, transparent 3%)`,
      }} />

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="3:42" />

        {/* Header */}
        <div style={{ padding: '6px 24px 0', textAlign: 'center' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.55)', marginBottom: 8,
          }}>
            Your vision board · {areas.length} areas · {totalProofs} proofs
          </div>
          <h1 style={{
            margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.1,
            color: '#FAF6EF',
          }}>
            Who you're becoming.
          </h1>
        </div>

        {/* 2-col grid */}
        <div style={{
          padding: '24px 20px 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
        }}>
          {areas.map((a, i) => (
            <AreaCard key={a.area} {...a} palette={p} />
          ))}
          <AddAreaCard palette={p} />
        </div>

        <window.TabBar active="vision" tone="light" palette={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

// ─── Area card — full-bleed photo, dark gradient overlay,
// AREA eyebrow + identity title + N proofs. Aspect ratio 0.78 (taller than
// square, shorter than 4:5) so a 5-card grid + add-tile fits in one scroll.
function AreaCard({ area, identity, wins, src, palette }) {
  const p = palette;
  return (
    <div style={{
      position: 'relative',
      aspectRatio: '0.78',
      borderRadius: 16, overflow: 'hidden',
      boxShadow: `0 14px 30px -6px rgba(0,0,0,0.45), 0 0 0 1px rgba(250,246,239,0.10)`,
      cursor: 'pointer',
    }}>
      <img src={src} alt="" style={{
        width: '100%', height: '100%', objectFit: 'cover',
        filter: 'saturate(0.88) brightness(0.92)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 38%, rgba(20,12,6,0.82) 100%)`,
      }} />
      <div style={{
        position: 'absolute', left: 12, right: 12, bottom: 12,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
          color: p.terraLight, marginBottom: 4,
        }}>{area}</div>
        <div style={{
          fontSize: 16, fontWeight: 600, color: '#FAF6EF',
          letterSpacing: -0.3, fontStyle: 'italic', lineHeight: 1.15,
          marginBottom: 6,
        }}>{identity}</div>
        <div style={{
          fontSize: 9.5, fontWeight: 600, color: 'rgba(250,246,239,0.62)',
          letterSpacing: 0.2,
        }}>{wins} proofs</div>
      </div>
    </div>
  );
}

// ─── Add-area placeholder — dashed, centered "+" + label.
// Empty state for the 6th tile (or any unfilled tile after onboarding).
function AddAreaCard({ palette }) {
  const p = palette;
  return (
    <div style={{
      position: 'relative',
      aspectRatio: '0.78',
      borderRadius: 16,
      background: 'rgba(250,246,239,0.04)',
      border: '1.5px dashed rgba(250,246,239,0.22)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 10, cursor: 'pointer', textAlign: 'center', padding: 16,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 99,
        background: `${p.amber}22`, border: `1px solid ${p.amber}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600, color: 'rgba(250,246,239,0.70)',
        letterSpacing: 0.2, lineHeight: 1.3,
      }}>Add an area</div>
    </div>
  );
}

window.ScreenVision = ScreenVision;
