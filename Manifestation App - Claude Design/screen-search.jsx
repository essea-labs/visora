// screen-search.jsx — search/filter wins. Cinematic dark.
// Search bar + filter chips by area + results list.

function ScreenSearch({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  return (
    <window.Phone paletteKey={paletteKey}>
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

        {/* Search header */}
        <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{
            width: 38, height: 38, borderRadius: 99,
            background: 'rgba(250,246,239,0.08)', border: '1px solid rgba(250,246,239,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            backdropFilter: 'blur(12px)', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <div style={{
            flex: 1, height: 44, borderRadius: 22,
            padding: '0 16px',
            background: 'rgba(250,246,239,0.08)', border: `1px solid ${p.amber}44`,
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: `0 0 18px ${p.amber}22`,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>
            </svg>
            <span style={{ color: '#FAF6EF', fontSize: 14.5, fontWeight: 500, letterSpacing: -0.1 }}>
              boundaries<span style={{ color: p.amber, marginLeft: 1 }}>|</span>
            </span>
            <span style={{ flex: 1 }} />
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
              color: 'rgba(250,246,239,0.5)',
            }}>5</span>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ padding: '18px 22px 0', display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          <FilterChip label="All" palette={p} />
          <FilterChip label="Career" palette={p} active />
          <FilterChip label="Health" palette={p} />
          <FilterChip label="Love" palette={p} />
          <FilterChip label="Growth" palette={p} />
        </div>

        {/* Result eyebrow */}
        <div style={{ padding: '24px 22px 10px' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase',
            color: p.amber, marginBottom: 4,
          }}>5 proofs · matching "boundaries"</div>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(250,246,239,0.6)', fontStyle: 'italic', textWrap: 'pretty' }}>
            A pattern is forming. Look at how often you've chosen yourself.
          </p>
        </div>

        {/* Results list */}
        <div style={{
          padding: '12px 22px 28px',
          height: 'calc(100% - 270px)', overflow: 'hidden',
          maskImage: 'linear-gradient(180deg, black 0%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 90%, transparent 100%)',
        }}>
          <Result palette={p} title="Said no to the meeting that wasn't mine."
                  area="Career" date="Today · 11:14 AM" snippet="…wasn't mine. Stayed with the real work." />
          <Result palette={p} title="Cancelled the trip I was dreading."
                  area="Career" date="Apr 28" snippet="…the trip. Felt like rest, not avoidance." />
          <Result palette={p} title="Closed laptop at 6, no exceptions."
                  area="Career" date="Apr 24" snippet="…at 6. Phone in the drawer." />
          <Result palette={p} title="Asked for the raise."
                  area="Career" date="Apr 12" highlight />
        </div>

        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

function FilterChip({ label, active, palette }) {
  const p = palette;
  return (
    <span style={{
      padding: '7px 14px', borderRadius: 99,
      background: active ? `${p.amber}22` : 'rgba(250,246,239,0.06)',
      border: `1px solid ${active ? p.amber + '88' : 'rgba(250,246,239,0.10)'}`,
      color: active ? p.amber : 'rgba(250,246,239,0.7)',
      fontSize: 12, fontWeight: 600, letterSpacing: 0.1,
      backdropFilter: 'blur(12px)', cursor: 'pointer',
    }}>{label}</span>
  );
}

function Result({ palette, title, area, date, snippet, highlight }) {
  const p = palette;
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 16, marginBottom: 8,
      background: highlight ? `${p.amber}10` : 'rgba(250,246,239,0.04)',
      border: `1px solid ${highlight ? p.amber + '33' : 'rgba(250,246,239,0.08)'}`,
      backdropFilter: 'blur(16px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: p.amber,
        }}>↳ {area}</span>
        <span style={{
          fontSize: 9.5, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
          color: 'rgba(250,246,239,0.5)',
        }}>{date}</span>
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 500, color: '#FAF6EF', letterSpacing: -0.1, lineHeight: 1.3, marginBottom: snippet ? 4 : 0 }}>
        {title}
      </div>
      {snippet && (
        <div style={{ fontSize: 12, color: 'rgba(250,246,239,0.55)', fontStyle: 'italic', textWrap: 'pretty' }}>
          {snippet}
        </div>
      )}
    </div>
  );
}

window.ScreenSearch = ScreenSearch;
