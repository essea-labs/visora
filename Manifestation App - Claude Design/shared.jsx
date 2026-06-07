// shared.jsx — tokens, primitives, icons, frame chrome.
// Everything that more than one screen reads/uses lives here.

// ─────────────────────────────────────────────────────────────
// Palette presets (Tweaks can swap)
// A — Cream / Terracotta / Sage  (the locked default per spec)
// B — Blush / Sand / Gold        (warmer, softer)
// C — Butter / Rust / Olive      (deeper, more autumnal)
// ─────────────────────────────────────────────────────────────
const PALETTES = {
  A: {
    bg: '#FAF6EF', bgSoft: '#F4EEE2', surface: '#FFFFFF', paper: '#FCF5E8',
    hairline: 'rgba(62,47,34,0.08)',
    terra: '#C06848', terraDeep: '#9E4F32', terraLight: '#E8A07A', terraPale: '#F5DBC9',
    sage: '#7A9470', sageDeep: '#556B4F', sagePale: '#D8E4D2',
    amber: '#D89A5A', amberDeep: '#9B6B2F', amberPale: '#F5E4CF',
    ink: '#3E2F22', inkSoft: '#6B5847', muted: '#9A8D7E', mutedSoft: '#C9BEB0',
    cosmicA: '#2A1F15', cosmicB: '#4B2E1E', cosmicC: '#7A4530',
  },
  B: {
    bg: '#FBF4EE', bgSoft: '#F4E8DD', surface: '#FFFFFF', paper: '#FBEFE0',
    hairline: 'rgba(74,52,38,0.08)',
    terra: '#B66B57', terraDeep: '#8C4A3C', terraLight: '#E5A18B', terraPale: '#F4D8C8',
    sage: '#9CA679', sageDeep: '#6E7A4F', sagePale: '#E0E2C7',
    amber: '#D9A467', amberDeep: '#9C7233', amberPale: '#F5E5CB',
    ink: '#3D2A20', inkSoft: '#6E5544', muted: '#A2917F', mutedSoft: '#CCBFAE',
    cosmicA: '#241A12', cosmicB: '#43271A', cosmicC: '#7B4A2C',
  },
  C: {
    bg: '#F8F1E2', bgSoft: '#EFE6D2', surface: '#FFFFFF', paper: '#F5EAD3',
    hairline: 'rgba(60,42,28,0.08)',
    terra: '#B65A3B', terraDeep: '#8E3F25', terraLight: '#DD8E66', terraPale: '#F0CFB7',
    sage: '#84915A', sageDeep: '#5C6840', sagePale: '#D9DEBC',
    amber: '#CE9050', amberDeep: '#8C5E22', amberPale: '#EEDDB7',
    ink: '#382518', inkSoft: '#664E37', muted: '#94836E', mutedSoft: '#C4B69E',
    cosmicA: '#1F160E', cosmicB: '#3F2515', cosmicC: '#74402A',
  },
};

// CSS-variable helper — apply a palette to a wrapper div.
function paletteVars(p) {
  return {
    '--bg': p.bg, '--bg-soft': p.bgSoft, '--surface': p.surface, '--paper': p.paper,
    '--hairline': p.hairline,
    '--terra': p.terra, '--terra-deep': p.terraDeep, '--terra-light': p.terraLight, '--terra-pale': p.terraPale,
    '--sage': p.sage, '--sage-deep': p.sageDeep, '--sage-pale': p.sagePale,
    '--amber': p.amber, '--amber-deep': p.amberDeep, '--amber-pale': p.amberPale,
    '--ink': p.ink, '--ink-soft': p.inkSoft, '--muted': p.muted, '--muted-soft': p.mutedSoft,
    '--cosmic-a': p.cosmicA, '--cosmic-b': p.cosmicB, '--cosmic-c': p.cosmicC,
  };
}

// ─────────────────────────────────────────────────────────────
// iOS chrome — status bar (cleaner than starter for our look)
// ─────────────────────────────────────────────────────────────
function StatusBar({ tone = 'dark' /* 'dark' | 'light' */, time = '7:14' }) {
  const c = tone === 'light' ? '#FAF6EF' : '#3E2F22';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px 8px', height: 54, boxSizing: 'border-box',
      position: 'relative', zIndex: 5,
    }}>
      <span style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui', fontWeight: 600, fontSize: 16, color: c, letterSpacing: 0.2 }}>
        {time}
      </span>
      <div style={{ width: 122, height: 36, borderRadius: 999, background: '#000' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
          <rect x="0" y="6" width="3" height="5" rx="0.6" fill={c}/>
          <rect x="5" y="4" width="3" height="7" rx="0.6" fill={c}/>
          <rect x="10" y="2" width="3" height="9" rx="0.6" fill={c}/>
          <rect x="15" y="0" width="3" height="11" rx="0.6" fill={c}/>
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path d="M8 2.6c2.1 0 4 .8 5.4 2.2l1-1A8 8 0 0 0 8 1.4 8 8 0 0 0 1.6 3.8l1 1A7.6 7.6 0 0 1 8 2.6z" fill={c}/>
          <path d="M8 5.8c1.3 0 2.4.5 3.3 1.3l1-1A6 6 0 0 0 8 4.6a6 6 0 0 0-4.3 1.5l1 1A4.7 4.7 0 0 1 8 5.8z" fill={c}/>
          <circle cx="8" cy="9.4" r="1.4" fill={c}/>
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke={c} strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill={c}/>
          <path d="M24 4v4c.7-.3 1.2-1 1.2-2s-.5-1.7-1.2-2z" fill={c} fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}

// Home indicator
function HomeIndicator({ tone = 'dark' }) {
  return (
    <div style={{
      position: 'absolute', bottom: 6, left: 0, right: 0,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 30,
    }}>
      <div style={{
        width: 134, height: 5, borderRadius: 99,
        background: tone === 'light' ? 'rgba(250,246,239,0.9)' : 'rgba(62,47,34,0.85)',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// iOS Device — 390x844, 47px radius, warm shadow
// Uses overflow hidden so absolutely-positioned tab bars sit on the
// inner edge.
// ─────────────────────────────────────────────────────────────
function Phone({ children, paletteKey = 'A', style = {} }) {
  const p = PALETTES[paletteKey];
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 47,
      position: 'relative', overflow: 'hidden',
      background: p.bg,
      boxShadow: '0 0 0 1px rgba(62,47,34,0.05), 0 1px 0 rgba(255,255,255,0.85) inset, 0 30px 60px -10px rgba(62,47,34,0.18), 0 6px 14px rgba(62,47,34,0.08)',
      fontFamily: "'General Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: p.ink,
      ...paletteVars(p),
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab Bar — 3 tabs, frosted, terra-deep active
// active = 'home' | 'wins' | 'vision'
// Optional `tone` 'dark'|'light' for over-photo placement.
// ─────────────────────────────────────────────────────────────
function TabBar({ active = 'home', tone = 'dark', palette }) {
  const p = palette;
  const isLight = tone === 'light';
  const ink = isLight ? '#FAF6EF' : p.ink;
  const muted = isLight ? 'rgba(250,246,239,0.55)' : p.muted;
  const activeColor = isLight ? '#FAF6EF' : p.terraDeep;

  const Item = ({ id, icon, label }) => {
    const on = active === id;
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        color: on ? activeColor : muted,
      }}>
        <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon(on)}</div>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase',
        }}>{label}</span>
      </div>
    );
  };

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 88, padding: '10px 14px 24px', boxSizing: 'border-box',
      background: isLight ? 'rgba(30,20,14,0.45)' : 'rgba(250,246,239,0.88)',
      backdropFilter: 'blur(24px) saturate(140%)',
      WebkitBackdropFilter: 'blur(24px) saturate(140%)',
      borderTop: `1px solid ${isLight ? 'rgba(255,255,255,0.08)' : p.hairline}`,
      display: 'flex', alignItems: 'center',
      zIndex: 20,
    }}>
      <Item id="home" label="Today" icon={(on) => <IconHome stroke={on ? activeColor : muted} active={on} />} />
      <Item id="vision" label="Vision" icon={(on) => <IconCompass stroke={on ? activeColor : muted} active={on} />} />
      <Item id="wins" label="Wins" icon={(on) => <IconAnchor stroke={on ? activeColor : muted} active={on} />} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Icons (Lucide-flavor, hand-tuned strokes)
// ─────────────────────────────────────────────────────────────
function IconHome({ stroke = '#3E2F22', active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.7} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>
    </svg>
  );
}
function IconAnchor({ stroke = '#3E2F22', active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.7} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v15"/>
      <path d="M5 12h14"/>
      <path d="M5 12a7 7 0 0 0 14 0"/>
    </svg>
  );
}
function IconCompass({ stroke = '#3E2F22', active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.7} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M15.5 8.5l-2 5-5 2 2-5z"/>
    </svg>
  );
}
function IconPlus({ stroke = '#FAF6EF', size = 18, sw = 2.2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={sw} stroke={stroke} strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}
function IconChevronRight({ stroke = '#3E2F22', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6"/>
    </svg>
  );
}
function IconPlay({ fill = '#FAF6EF', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <path d="M7 4.5v15a1 1 0 0 0 1.55.83l12-7.5a1 1 0 0 0 0-1.66l-12-7.5A1 1 0 0 0 7 4.5z"/>
    </svg>
  );
}
function IconFlame({ fill = '#9B6B2F', size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <path d="M12 2.5s4.5 4 4.5 8.5a4.5 4.5 0 0 1-9 0c0-1.6.6-2.7 1.3-3.6.7.9 1.7 1.6 1.7 1.6S10 7 12 2.5z"/>
      <path d="M12 22a6 6 0 0 0 6-6c0-2.3-1.4-4.2-3-5.7.4 2.4-.7 4.4-2.5 5.5C11 16.6 10 18 10 19.5A2.5 2.5 0 0 0 12 22z" opacity=".4"/>
    </svg>
  );
}
function IconSparkle({ stroke = '#3E2F22', size = 16, sw = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={sw} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Paper slip — for morning intentions
// ─────────────────────────────────────────────────────────────
function Slip({ kind = 'am' /* 'am' | 'do' */, label, body, rotate = 0, palette }) {
  const p = palette;
  const labelColor = kind === 'am' ? p.amberDeep : p.terraDeep;
  const dotColor = kind === 'am' ? p.amber : p.terra;
  return (
    <div style={{
      position: 'relative',
      background: p.paper,
      border: `1px solid rgba(216,154,90,0.18)`,
      borderRadius: 10,
      padding: '16px 18px 18px',
      boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 16px rgba(62,47,34,0.07), 0 1px 2px rgba(62,47,34,0.06)',
      transform: `rotate(${rotate}deg)`,
    }}>
      {/* tape */}
      <div style={{
        position: 'absolute', top: -7, left: '50%',
        transform: 'translateX(-50%) rotate(-3deg)',
        width: 38, height: 12,
        background: 'linear-gradient(180deg, rgba(216,154,90,0.32), rgba(216,154,90,0.18))',
        borderRadius: 1,
        boxShadow: '0 1px 2px rgba(62,47,34,0.08)',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <span style={{ width: 5, height: 5, borderRadius: 99, background: dotColor }} />
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
          color: labelColor,
        }}>{label}</span>
      </div>
      <p style={{
        margin: 0, fontSize: 16.5, lineHeight: 1.4, color: p.ink, fontWeight: 500,
        textWrap: 'pretty',
      }}>{body}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Breathing orb — used on Ritual + onboarding teases
// Pulses 4s in / 6s out.
// ─────────────────────────────────────────────────────────────
function BreathingOrb({ size = 220, palette, intensity = 1 }) {
  const p = palette;
  // Inject the keyframes once
  React.useEffect(() => {
    if (document.getElementById('orb-keyframes')) return;
    const s = document.createElement('style');
    s.id = 'orb-keyframes';
    s.textContent = `
      @keyframes orb-pulse {
        0%   { transform: scale(0.86); filter: blur(0px); }
        40%  { transform: scale(1.06); filter: blur(0px); }
        100% { transform: scale(0.86); filter: blur(0px); }
      }
      @keyframes orb-halo {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50%      { opacity: 0.85; transform: scale(1.12); }
      }
      @keyframes orb-shine {
        0%, 100% { opacity: 0.7; }
        50%      { opacity: 1; }
      }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <div style={{
      position: 'relative', width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* outer halo */}
      <div style={{
        position: 'absolute', inset: -size * 0.25,
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 55%, ${p.terraLight}33 0%, ${p.amberPale}22 35%, transparent 65%)`,
        animation: 'orb-halo 10s ease-in-out infinite',
        filter: 'blur(20px)',
      }} />
      {/* mid halo */}
      <div style={{
        position: 'absolute', inset: -size * 0.08,
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%, ${p.amber}55 0%, ${p.terra}33 50%, transparent 75%)`,
        animation: 'orb-halo 10s ease-in-out infinite 0.4s',
        filter: 'blur(8px)',
        opacity: intensity,
      }} />
      {/* core orb */}
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `
          radial-gradient(circle at 38% 32%, rgba(255,240,220,0.95) 0%, rgba(255,210,170,0.6) 18%, transparent 38%),
          radial-gradient(circle at 50% 50%, ${p.amber} 0%, ${p.terra} 45%, ${p.terraDeep} 80%, ${p.sageDeep} 110%)
        `,
        boxShadow: `
          inset 0 -20px 60px rgba(85,107,79,0.35),
          inset 0 12px 30px rgba(255,236,210,0.45),
          0 30px 80px -10px ${p.terra}55,
          0 8px 24px rgba(192,104,72,0.25)
        `,
        animation: 'orb-pulse 10s ease-in-out infinite',
        position: 'relative',
      }}>
        {/* highlight glints */}
        <div style={{
          position: 'absolute', top: '14%', left: '24%',
          width: '24%', height: '14%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,250,240,0.7) 0%, transparent 70%)',
          filter: 'blur(2px)', animation: 'orb-shine 5s ease-in-out infinite',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Vision photo card — handmade rotation
// ─────────────────────────────────────────────────────────────
function VisionCard({ src, title, identity, area, rotate = 0, width = 220, height = 280, palette }) {
  const p = palette;
  return (
    <div style={{
      width, height, borderRadius: 18, position: 'relative', overflow: 'hidden',
      background: '#000',
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 1px 0 rgba(255,255,255,0.7) inset, 0 14px 30px -8px rgba(62,47,34,0.25), 0 4px 10px rgba(62,47,34,0.10)`,
    }}>
      <img src={src} alt="" style={{
        width: '100%', height: '100%', objectFit: 'cover',
        filter: 'saturate(0.82) contrast(1.03)',
      }} />
      {/* warm tint overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 35%, rgba(62,47,34,0.0) 50%, rgba(62,47,34,0.55) 100%)`,
        mixBlendMode: 'multiply',
      }} />
      {/* slight amber wash */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(216,154,90,0.06)' }} />
      {/* area label */}
      {area && (
        <span style={{
          position: 'absolute', top: 16, left: 16,
          fontSize: 9.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase',
          color: '#FAF6EF', opacity: 0.85,
          padding: '5px 9px',
          background: 'rgba(62,47,34,0.28)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(6px)',
          borderRadius: 99,
        }}>{area}</span>
      )}
      {/* title block */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '20px 18px 18px',
      }}>
        <h3 style={{
          margin: 0, color: '#FAF6EF',
          fontSize: 21, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.15,
          textShadow: '0 2px 14px rgba(0,0,0,0.45)',
        }}>{title}</h3>
        {identity && (
          <p style={{
            margin: '6px 0 0', fontStyle: 'italic',
            fontSize: 12.5, lineHeight: 1.4,
            color: 'rgba(250,246,239,0.86)',
            textShadow: '0 1px 6px rgba(0,0,0,0.35)',
          }}>{identity}</p>
        )}
      </div>
    </div>
  );
}

// Small "streak" pill
function StreakPill({ days, palette }) {
  const p = palette;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 10px 5px 8px',
      background: p.amberPale,
      border: `1px solid ${p.amber}55`,
      borderRadius: 99,
      fontSize: 12, fontWeight: 600, color: p.amberDeep,
      letterSpacing: 0.1,
    }}>
      <IconFlame fill={p.amberDeep} />
      <span>{days}-day streak</span>
    </div>
  );
}

Object.assign(window, {
  PALETTES, paletteVars,
  StatusBar, HomeIndicator, Phone, TabBar,
  IconHome, IconAnchor, IconCompass, IconPlus, IconChevronRight, IconPlay, IconFlame, IconSparkle,
  Slip, BreathingOrb, VisionCard, StreakPill,
});
