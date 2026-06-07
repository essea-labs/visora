// screen-settings.jsx — Settings, the cinematic way.
// Warm cosmic dark register, anchored on the user's vision identity
// (their name + the morning time). Sections for Ritual, Vision Board,
// Witness, Account. No system-grid feel; intimate, soft, voiced.

function ScreenSettings({ paletteKey = 'A' }) {
  const p = window.PALETTES[paletteKey];

  return (
    <window.Phone paletteKey={paletteKey}>
      {/* Same cosmic warm gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(70% 50% at 50% 0%, ${p.terraDeep}66 0%, transparent 55%),
          radial-gradient(70% 40% at 50% 100%, ${p.cosmicC}aa 0%, ${p.cosmicB}77 35%, ${p.cosmicA}ff 75%, ${p.cosmicA} 100%),
          ${p.cosmicA}
        `,
      }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'screen',
        backgroundImage: `radial-gradient(circle at 22% 18%, ${p.amber}22 0%, transparent 4%),
                          radial-gradient(circle at 82% 12%, ${p.terraLight}22 0%, transparent 3%),
                          radial-gradient(circle at 38% 52%, ${p.amber}22 0%, transparent 2.5%),
                          radial-gradient(circle at 86% 68%, ${p.amber}22 0%, transparent 3%)`,
      }} />

      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <window.StatusBar tone="light" time="3:42" />

        {/* Header — back + title */}
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
          }}>Quiet keeping</div>
          <div style={{ width: 38 }} />
        </div>

        {/* Identity hero */}
        <div style={{ padding: '14px 24px 18px', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
            {/* hero orb (the user's "self") */}
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${p.amber} 55%, ${p.amberDeep})`,
              boxShadow: `0 8px 22px ${p.amber}88, inset 0 4px 10px rgba(255,236,210,0.5), 0 0 28px ${p.amber}44`,
            }} />
            <button style={{
              position: 'absolute', right: -2, bottom: -2,
              width: 28, height: 28, borderRadius: 99,
              background: 'rgba(20,12,6,0.85)', border: `1px solid ${p.amber}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
          <div style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
            color: p.amber, marginBottom: 4,
          }}>You are becoming</div>
          <div style={{
            fontSize: 22, fontWeight: 500, color: '#FAF6EF',
            letterSpacing: -0.4, fontStyle: 'italic',
          }}>
            The Studio of My Own.
          </div>
          <div style={{
            fontSize: 11.5, fontWeight: 500, color: 'rgba(250,246,239,0.5)',
            marginTop: 6, letterSpacing: 0.1,
          }}>
            34 days · 47 proofs · since April 1
          </div>
        </div>

        {/* Scrollable settings body */}
        <div style={{
          padding: '0 18px 110px',
          height: 'calc(100% - 76px - 220px)',
          overflow: 'hidden',
          maskImage: 'linear-gradient(180deg, black 0%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 92%, transparent 100%)',
        }}>
          {/* THE RITUAL */}
          <SectionHeader p={p} eyebrow="The ritual" hint="Visualize" />
          <Group p={p}>
            <Row p={p} label="Morning time"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>}
              value="7:00 AM" />
            <Row p={p} label="Voiced ritual"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v4M8 23h8"/></svg>}
              toggle on />
            <Row p={p} label="Voice"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10v4M7 6v12M11 8v8M15 4v16M19 9v6"/></svg>}
              value="Sage · soft, low" last />
            {/* Atmosphere row removed — MVP ships only the blurred-vision-photo atmosphere. */}
          </Group>

          {/* THE VISION */}
          <SectionHeader p={p} eyebrow="The vision" hint="Manifest" />
          <Group p={p}>
            <Row p={p} label="Areas"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/></svg>}
              value="5 active" chevron last />
            {/* "Re-read identity statements" removed — already reachable by tapping a vision card. */}
            {/* "Reshuffle photographs" removed — with one photo per area, nothing to shuffle. */}
          </Group>

          {/* THE WITNESS */}
          <SectionHeader p={p} eyebrow="The witness" hint="Document, together" />
          <Group p={p}>
            <Row p={p} label="Sam"
              avatar={<MiniOrb terra p={p} />}
              value="34 days · paired" chevron last />
          </Group>

          {/* THE ARCHIVE */}
          <SectionHeader p={p} eyebrow="The archive" hint="Document" />
          <Group p={p}>
            <Row p={p} label="Capture reminders"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              value="Twice daily" />
            <Row p={p} label="Export archive"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><path d="M12 15V3"/></svg>}
              chevron last />
          </Group>

          {/* MEMBERSHIP — links to premium */}
          <SectionHeader p={p} eyebrow="Membership" hint="" />
          <Group p={p} highlight>
            <PremiumRow p={p} />
          </Group>

          {/* ACCOUNT */}
          <SectionHeader p={p} eyebrow="Account" hint="" />
          <Group p={p}>
            <Row p={p} label="iris@anchor.so"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
              chevron />
            <Row p={p} label="Privacy"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
              chevron />
            <Row p={p} label="Help · the manual"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5"/></svg>}
              chevron last />
          </Group>

          {/* QUIET EXIT */}
          <div style={{ padding: '20px 6px 8px', textAlign: 'center' }}>
            <button style={{
              padding: '12px 24px', borderRadius: 99,
              background: 'transparent',
              border: '1px solid rgba(250,246,239,0.16)',
              color: 'rgba(250,246,239,0.55)',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
              letterSpacing: 1.4, textTransform: 'uppercase', cursor: 'pointer',
            }}>Step away · sign out</button>
            <div style={{
              marginTop: 18, fontSize: 11, color: 'rgba(250,246,239,0.32)',
              fontStyle: 'italic', letterSpacing: 0.1,
            }}>
              The Anchor Method · v1.0 · made quietly
            </div>
          </div>
        </div>

        <window.TabBar active="vision" tone="light" palette={p} />
        <window.HomeIndicator tone="light" />
      </div>
    </window.Phone>
  );
}

// ─── pieces ──────────────────────────────────────────────────

function SectionHeader({ p, eyebrow, hint }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 8,
      padding: '22px 6px 10px',
    }}>
      <span style={{
        fontSize: 10.5, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
        color: '#FAF6EF',
      }}>{eyebrow}</span>
      {hint && (
        <span style={{
          fontSize: 10, fontWeight: 600, color: p.amber, fontStyle: 'italic',
          letterSpacing: 0.4, opacity: 0.85,
        }}>· {hint}</span>
      )}
      <span style={{ flex: 1, height: 1, background: 'rgba(250,246,239,0.08)', marginBottom: 3 }} />
    </div>
  );
}

function Group({ children, p, highlight }) {
  return (
    <div style={{
      borderRadius: 18,
      background: highlight
        ? `linear-gradient(160deg, ${p.amber}1f 0%, rgba(250,246,239,0.04) 100%)`
        : 'rgba(250,246,239,0.05)',
      border: `1px solid ${highlight ? p.amber + '44' : 'rgba(250,246,239,0.08)'}`,
      backdropFilter: 'blur(14px)',
      overflow: 'hidden',
    }}>{children}</div>
  );
}

function Row({ p, label, value, icon, avatar, toggle, on, chevron, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 14px',
      borderBottom: last ? 'none' : '1px solid rgba(250,246,239,0.06)',
    }}>
      {icon && (
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${p.amber}1a`, border: `1px solid ${p.amber}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{icon}</div>
      )}
      {avatar}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 500, color: '#FAF6EF',
          letterSpacing: -0.1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{label}</div>
      </div>
      {value && (
        <span style={{
          fontSize: 12.5, fontWeight: 500,
          color: 'rgba(250,246,239,0.55)', fontStyle: 'italic',
        }}>{value}</span>
      )}
      {toggle && (
        <span style={{
          width: 38, height: 22, borderRadius: 99,
          background: on ? p.amber : 'rgba(250,246,239,0.18)',
          position: 'relative', flexShrink: 0,
          boxShadow: on ? `0 0 10px ${p.amber}88` : 'none',
        }}>
          <span style={{
            position: 'absolute', top: 2, left: on ? 18 : 2,
            width: 18, height: 18, borderRadius: '50%',
            background: '#FAF6EF', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            transition: 'left 0.2s',
          }} />
        </span>
      )}
      {chevron && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(250,246,239,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6"/>
        </svg>
      )}
    </div>
  );
}

function MiniOrb({ p, terra }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      background: terra
        ? `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${p.terra} 60%, ${p.terraDeep})`
        : `radial-gradient(circle at 35% 30%, rgba(255,240,220,0.95), ${p.amber} 55%, ${p.amberDeep})`,
      boxShadow: `0 2px 8px ${(terra ? p.terra : p.amber)}88`,
    }} />
  );
}

function PremiumRow({ p }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 14px',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `linear-gradient(135deg, ${p.amber} 0%, ${p.amberDeep} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, boxShadow: `0 4px 14px ${p.amber}66`,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F1308" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 16l-6.5 5 2-7.5L2 9h7z"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14.5, fontWeight: 600, color: '#FAF6EF',
          letterSpacing: -0.1, marginBottom: 2,
        }}>The Anchor · Devoted</div>
        <div style={{
          fontSize: 11.5, fontWeight: 500, color: p.amber,
          fontStyle: 'italic', letterSpacing: 0.1,
        }}>Unlocked · 34 days deep</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(250,246,239,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  );
}

window.ScreenSettings = ScreenSettings;
