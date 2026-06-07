// app.jsx — mounts the canvas + tweaks panel.

const { useTweaks, TweaksPanel, TweakSection, TweakRadio } = window;

function App() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "palette": "A",
    "atmosphere": "photo"
  }/*EDITMODE-END*/);

  return (
    <React.Fragment>
      <window.DesignCanvas>

        {/* SECTION 0 — Onboarding */}
        <window.DCSection
          id="onboarding"
          title="Onboarding · First open"
          subtitle="8 beats. The Manifest · Visualize · Document loop, ending on the vision board canvas the user just built."
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <window.DCArtboard key={i} id={`onb-${i}`} label={`O${String(i).padStart(2, '0')} · ${['Welcome','The Method','Why this works','Daily loop','Pick areas','Build vision board','Witness invite','Morning time'][i-1]}`} width={390} height={844}>
              <window.ScreenOnboarding paletteKey={tweaks.palette} step={i} />
            </window.DCArtboard>
          ))}
        </window.DCSection>

        {/* SECTION 1 — The three tabs */}
        <window.DCSection
          id="tabs"
          title="The three tabs · Today / Vision / Wins"
          subtitle="The shell of the app — what you see when you open it"
        >
          <window.DCArtboard id="home" label="01 · Today (Home)" width={390} height={844}>
            <window.ScreenHome paletteKey={tweaks.palette} />
          </window.DCArtboard>

          <window.DCArtboard id="vision" label="02 · Vision Board" width={390} height={844}>
            <window.ScreenVision paletteKey={tweaks.palette} />
          </window.DCArtboard>

          <window.DCArtboard id="wins" label="03 · Wins (The Archive)" width={390} height={844}>
            <window.ScreenWins paletteKey={tweaks.palette} />
          </window.DCArtboard>
        </window.DCSection>

        {/* SECTION 2 — Morning Ritual full sequence */}
        <window.DCSection
          id="ritual"
          title="Morning Ritual · 5 beats"
          subtitle="Auto-generated from your vision. No input — passive, cinematic, voiced."
        >
          {[1, 2, 3, 4, 5].map(b => (
            <window.DCArtboard key={b} id={`ritual-${b}`} label={`R0${b} · ${['Settle','Breathe','Picture','Anchor','Send-off'][b-1]}`} width={390} height={844}>
              <window.ScreenRitual paletteKey={tweaks.palette} atmosphere={tweaks.atmosphere} beat={b} />
            </window.DCArtboard>
          ))}
        </window.DCSection>

        {/* SECTION 3 — Vision world */}
        <window.DCSection
          id="vision-flow"
          title="Vision · Tap a piece → enter it"
          subtitle="The grid is the gateway. Player is the immersive feeling. Detail is the manage view."
        >
          <window.DCArtboard id="vision-player" label="04 · Vision Player (immersive feeling)" width={390} height={844}>
            <window.ScreenVisionPlayer paletteKey={tweaks.palette} />
          </window.DCArtboard>

          <window.DCArtboard id="vision-detail" label="05 · Vision detail (linked wins)" width={390} height={844}>
            <window.ScreenVisionDetail paletteKey={tweaks.palette} />
          </window.DCArtboard>
        </window.DCSection>

        {/* SECTION 4 — Vision creation flow (now one mini-sheet on the board) */}
        <window.DCSection
          id="vision-create"
          title="Vision · Build the board"
          subtitle="Five tiles you can see from second one. Tap any empty tile → a single mini-sheet (photo + name + identity). Skip what you're not ready for."
        >
          <window.DCArtboard id="create-empty" label="06 · Empty board" width={390} height={844}>
            <window.ScreenVisionAreaSheet paletteKey={tweaks.palette} state="board-empty" />
          </window.DCArtboard>
          <window.DCArtboard id="create-sheet" label="07 · Sheet open" width={390} height={844}>
            <window.ScreenVisionAreaSheet paletteKey={tweaks.palette} state="sheet-open" />
          </window.DCArtboard>
          <window.DCArtboard id="create-filled" label="08 · One filled, the rest waiting" width={390} height={844}>
            <window.ScreenVisionAreaSheet paletteKey={tweaks.palette} state="board-partial" />
          </window.DCArtboard>
        </window.DCSection>

        {/* SECTION 5 — Wins flow */}
        <window.DCSection
          id="wins-flow"
          title="Wins · Capture & detail"
          subtitle="Single composer (text + photo). Cinematic detail view."
        >
          <window.DCArtboard id="capture-empty" label="10 · Capture · Empty" width={390} height={844}>
            <window.ScreenWinCapture paletteKey={tweaks.palette} mode="empty" />
          </window.DCArtboard>

          <window.DCArtboard id="capture-text" label="11a · Capture · Text" width={390} height={844}>
            <window.ScreenWinCapture paletteKey={tweaks.palette} mode="typing" />
          </window.DCArtboard>

          <window.DCArtboard id="capture-photo" label="11b · Capture · With photo" width={390} height={844}>
            <window.ScreenWinCapture paletteKey={tweaks.palette} mode="photo" />
          </window.DCArtboard>

          <window.DCArtboard id="win-detail" label="12 · Win detail" width={390} height={844}>
            <window.ScreenWinDetail paletteKey={tweaks.palette} />
          </window.DCArtboard>

          <window.DCArtboard id="search" label="13 · Search wins" width={390} height={844}>
            <window.ScreenSearch paletteKey={tweaks.palette} />
          </window.DCArtboard>
        </window.DCSection>

        {/* SECTION 6 — Witness (Buddy) */}
        <window.DCSection
          id="buddy"
          title="The Witness · Buddy pair"
          subtitle="One person. They see your wins. You see theirs. Nothing else."
        >
          <window.DCArtboard id="buddy" label="14 · The Witness" width={390} height={844}>
            <window.ScreenBuddy paletteKey={tweaks.palette} />
          </window.DCArtboard>
        </window.DCSection>

        {/* SECTION 7 — Settings + Premium */}
        <window.DCSection
          id="quiet"
          title="Settings & Devotion"
          subtitle="Quiet keeping (settings) and the devotion paywall — both in the warm cosmic register."
        >
          <window.DCArtboard id="settings" label="15 · Settings · Quiet keeping" width={390} height={844}>
            <window.ScreenSettings paletteKey={tweaks.palette} />
          </window.DCArtboard>

          <window.DCArtboard id="premium" label="16 · Devotion · Paywall" width={390} height={844}>
            <window.ScreenPremium paletteKey={tweaks.palette} />
          </window.DCArtboard>
        </window.DCSection>

      </window.DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette">
          <TweakRadio
            label="Color system"
            value={tweaks.palette}
            onChange={(v) => setTweak('palette', v)}
            options={[
              { value: 'A', label: 'Cream · Terra · Sage' },
              { value: 'B', label: 'Blush · Sand · Gold' },
              { value: 'C', label: 'Butter · Rust · Olive' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Ritual atmosphere">
          <TweakRadio
            label="Background"
            value={tweaks.atmosphere}
            onChange={(v) => setTweak('atmosphere', v)}
            options={[
              { value: 'photo', label: 'Vision photo blurred' },
              { value: 'orb',   label: 'Orb only (minimal)' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
