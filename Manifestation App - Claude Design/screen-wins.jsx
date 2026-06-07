// screen-wins.jsx — The Archive.
// Cinematic, dark, editorial — same emotional register as Vision tab.
// Featured win at top (Vision Player feel), then a vertical "tape" of
// wins as large editorial cards beneath.

function ScreenWins({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Deep cosmic warm gradient — matches Vision */}
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
        <window.StatusBar tone="light" time="3:42" />

        {/* Header */}
        <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
              color: p.amber, marginBottom: 8,
            }}>The archive · 47 proofs</div>
            <h1 style={{
              margin: 0, color: '#FAF6EF',
              fontSize: 32, fontWeight: 500, letterSpacing: -0.7, lineHeight: 1.05,
            }}>
              Your <em style={{ fontStyle: 'italic', fontWeight: 400, color: p.terraLight }}>becoming.</em>
            </h1>
          </div>
          <button style={{
            width: 38, height: 38, borderRadius: 99,
            background: 'rgba(250,246,239,0.08)', border: '1px solid rgba(250,246,239,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>
            </svg>
          </button>
        </div>

        {/* Body — featured win + vertical tape of cards */}
        <div style={{
          padding: '22px 22px 110px',
          height: 'calc(100% - 76px - 88px)',
          overflow: 'hidden',
          maskImage: 'linear-gradient(180deg, black 0%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 92%, transparent 100%)',
        }}>
          {/* FEATURED — full-bleed editorial */}
          <FeaturedWin palette={p} />

          {/* DAY DIVIDER */}
          <DayDivider palette={p} day="Today" date="May 5" count={3} />

          {/* Pinterest-style masonry — varied heights, organic flow */}
          <Masonry palette={p}>
            <PhotoWinCard palette={p} src="assets/health-shoes.jpg" caption="6 miles before sunrise" area="Health" time="6:50 AM" h={220} />
            <TextWinCard  palette={p} body="Five quiet minutes before the laptop. Stayed off Slack." area="Growth" time="7:30 AM" h={140} />
            <TextWinCard  palette={p} body="Said no to the call." area="Career" time="11:02 AM" h={100} />
            <PhotoWinCard palette={p} src="assets/work-coffee.jpg" caption="Studio time, no phone" area="Career" time="2:14 PM" h={180} />
          </Masonry>

          {/* DAY DIVIDER */}
          <DayDivider palette={p} day="Yesterday" date="May 4" count={2} />

          <Masonry palette={p}>
            <TextWinCard  palette={p} body="Texted Mom just because." area="Love" time="2:18 PM" h={110} />
            <PhotoWinCard palette={p} src="assets/love-hero.jpg" caption="Walked to dinner together" area="Love" time="7:40 PM" h={240} />
            <TextWinCard  palette={p} body="Meditated 12 min." area="Growth" time="6:20 AM" h={90} />
          </Masonry>

          {/* DAY DIVIDER */}
          <DayDivider palette={p} day="Sunday" date="May 3" count={1} />

          <Masonry palette={p}>
            <PhotoWinCard palette={p} src="assets/health-runner.jpg" caption="Long run, no headphones" area="Health" time="morning" h={200} />
            <TextWinCard  palette={p} body="Read 30 pages by the window." area="Joy" time="afternoon" h={120} />
          </Masonry>
        </div>

        {/* FAB — anchored bottom-right, glowing terra */}
        <button style={{
          position: 'absolute', right: 22, bottom: 102,
          height: 56, padding: '0 22px 0 18px', borderRadius: 28,
          background: `linear-gradient(135deg, ${p.terra} 0%, ${p.terraDeep} 100%)`,
          color: '#FAF6EF',
          border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1,
          display: 'inline-flex', alignItems: 'center', gap: 9,
          boxShadow: `0 18px 40px ${p.terra}88, 0 4px 12px ${p.terraDeep}44, 0 1px 0 rgba(255,255,255,0.25) inset, 0 0 0 1px rgba(216,154,90,0.4)`,
          zIndex: 10,
        }}>
          <span style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(250,246,239,0.18)', border: '1px solid rgba(250,246,239,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <window.IconAnchor stroke="#FAF6EF" />
          </span>
          Add a win
        </button>

        <window.TabBar active="wins" tone="light" palette={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

// ─── Masonry — true Pinterest 2-col, organic varied heights ──
// Distributes children across 2 columns by lowest-height-first.
// Each child must accept its own height (we pass `h` props).
function Masonry({ children, palette }) {
  const items = React.Children.toArray(children);
  // Greedy column-balancing using the `h` prop.
  const colA = [], colB = [];
  let hA = 0, hB = 0;
  items.forEach(child => {
    const h = (child.props && child.props.h) || 160;
    if (hA <= hB) { colA.push(child); hA += h + 10; }
    else          { colB.push(child); hB += h + 10; }
  });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{colA}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{colB}</div>
    </div>
  );
}

// ─── Featured win (top of tab) ───────────────────────────────────
function FeaturedWin({ palette }) {
  const p = palette;
  return (
    <div style={{
      position: 'relative', height: 380, borderRadius: 22, overflow: 'hidden', marginBottom: 28,
      boxShadow: `0 22px 50px -10px rgba(0,0,0,0.55), 0 0 0 1px rgba(250,246,239,0.06)`,
    }}>
      <img src="assets/work-coffee.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.88) contrast(1.04)' }} />
      <div style={{ position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(20,12,6,0.4) 0%, transparent 30%, transparent 50%, rgba(20,12,6,0.92) 100%)`,
      }} />

      {/* top — area + recency */}
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
          color: '#FAF6EF', opacity: 0.92,
          padding: '5px 10px', borderRadius: 99,
          background: 'rgba(20,12,6,0.4)', border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
        }}>↳ Career</span>
        <span style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(250,246,239,0.7)',
        }}>Yesterday · 6:48 PM</span>
      </div>

      {/* bottom — title + identity quote */}
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 24 }}>
        <div style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
          color: p.amber, marginBottom: 10,
        }}>Most recent · Win #43</div>
        <h2 style={{
          margin: 0, color: '#FAF6EF',
          fontSize: 26, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.15,
          textShadow: '0 4px 18px rgba(0,0,0,0.5)',
          textWrap: 'pretty',
          marginBottom: 10,
        }}>
          First paying client<br/>
          <em style={{ fontStyle: 'italic', fontWeight: 400, color: p.terraLight }}>said yes.</em>
        </h2>
        <div style={{
          fontStyle: 'italic', fontSize: 13, lineHeight: 1.4,
          color: 'rgba(250,246,239,0.85)',
          paddingLeft: 12, borderLeft: `2px solid ${p.amber}aa`,
          textShadow: '0 1px 6px rgba(0,0,0,0.4)',
        }}>
          Proof toward<span style={{ color: '#FAF6EF', fontStyle: 'normal', fontWeight: 600 }}> The Studio of My Own.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Day divider — editorial all-caps with hairline ────────────
function DayDivider({ palette, day, date, count }) {
  const p = palette;
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 10, margin: '4px 0 16px',
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
        color: '#FAF6EF',
      }}>{day}</span>
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase',
        color: 'rgba(250,246,239,0.5)',
      }}>· {date}</span>
      <span style={{ flex: 1, height: 1, background: 'rgba(250,246,239,0.10)', marginBottom: 4 }} />
      <span style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
        color: p.amber,
      }}>{count} proof{count > 1 ? 's' : ''}</span>
    </div>
  );
}

// ─── Photo win card — full-bleed cinematic mini ───────────────
function PhotoWinCard({ palette, src, caption, area, time, h = 200 }) {
  const p = palette;
  return (
    <div style={{
      position: 'relative', height: h, borderRadius: 18, overflow: 'hidden',
      boxShadow: '0 14px 30px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(250,246,239,0.06)',
    }}>
      <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85)' }} />
      <div style={{ position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 40%, rgba(20,12,6,0.85) 100%)`,
      }} />
      <div style={{
        position: 'absolute', top: 10, left: 10,
        fontSize: 8.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
        color: '#FAF6EF',
        padding: '4px 8px', borderRadius: 99,
        background: 'rgba(20,12,6,0.45)', border: '1px solid rgba(255,255,255,0.16)',
        backdropFilter: 'blur(8px)',
      }}>↳ {area}</div>
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12 }}>
        {caption && (
          <div style={{
            color: '#FAF6EF', fontSize: 13.5, fontWeight: 500, lineHeight: 1.3,
            marginBottom: 4, textShadow: '0 1px 8px rgba(0,0,0,0.5)', letterSpacing: -0.1,
          }}>{caption}</div>
        )}
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
          color: 'rgba(250,246,239,0.65)',
        }}>{time}</div>
      </div>
    </div>
  );
}

// ─── Text win card — frosted, glass-like, identity-first ──────
function TextWinCard({ palette, body, area, time, h = 150 }) {
  const p = palette;
  const accent = area === 'Health' ? p.sage : area === 'Love' ? p.terraLight : p.amber;
  return (
    <div style={{
      position: 'relative', height: h, borderRadius: 18, padding: '16px 16px 14px',
      background: 'rgba(250,246,239,0.06)',
      border: '1px solid rgba(250,246,239,0.10)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxSizing: 'border-box',
    }}>
      <p style={{
        margin: 0, fontSize: 14, lineHeight: 1.4, fontWeight: 500, letterSpacing: -0.1,
        color: '#FAF6EF', textWrap: 'pretty',
      }}>{body}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{
          fontSize: 8.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
          color: accent,
        }}>↳ {area}</span>
        <span style={{
          fontSize: 9, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase',
          color: 'rgba(250,246,239,0.45)',
        }}>{time}</span>
      </div>
    </div>
  );
}

window.ScreenWins = ScreenWins;
