# Innerproof — Morning Ritual Script

Voice-over copy for the **single 90-second audio file** played for all users every morning. Recorded once via ElevenLabs library voice. Personalization is on-screen, not in the audio.

**Total runtime:** 90 seconds
**Voice direction:** calm, clear, slightly intimate — like a thoughtful coach, not a guru. Plain English over poetry. Pauses do the emotional work.
**Pacing:** ~145 wpm. Calm but not soporific.
**Tone reference:** Brené Brown's audiobook narration, not Calm/Headspace dreamy.

---

## R01 · Settle (15s)

**Visual:** Orb breathing slowly, cosmic dim background.

**VO copy:**

> Welcome back. Settle in.
>
> *(1s pause)*
>
> Take a slow breath in… and out.
>
> *(1.5s pause)*
>
> Soft jaw. Soft eyes.
>
> *(1s pause)*
>
> You don't have to do anything yet.

**Word count:** 26 words
**Timing:** ~10s spoken + ~5s of pauses = 15s total

---

## R02 · Breathe (20s)

**Visual:** Orb expanding/contracting in 4-second breath cycle. On-screen text pulses **INHALE** (4s) → **EXHALE** (4s), 2.5 cycles.

**VO copy:**

> *(no spoken words for the full 20 seconds)*
>
> Optional: soft, breathy ambient — a faint exhale sound from the voice actor on each cycle, or near-silence with a subtle wind chime. Recording note: the user breathes along with the on-screen text, not the audio.

**Timing:** 20 seconds of paced ambient. No vocabulary load.

---

## R03 · Picture (35s)

**Visual:** Vision photo blurred behind orb (dimmed). At "your identity statement will appear" — fade in the user's identity statement, large italic, centered. Stays on screen through the silent pause.

**VO copy:**

> Now picture today.
>
> *(2s pause)*
>
> Your identity statement will appear on screen.
>
> *(1s pause)*
>
> Read it silently. As if it's already true.
>
> *(silent ~20 seconds — the user reads their own identity statement displayed on screen; audio is silent or holds a single sustained ambient note)*
>
> Carry it with you.

**Word count:** 24 spoken words
**Timing:** ~10s spoken + 20s silent for reading + 5s of pauses around words = 35s total

**Critical pacing note:** The 20-second silent pause is the most important moment in the ritual. Do not fill it. Resist any instinct to add ambient swells or chimes — the silence is what lets the user actually inhabit the words on screen.

---

## R04 · Anchor (15s)

**Visual:** Orb softens; identity statement fades; intention input field appears with placeholder *"What's one thing you'll do today?"* and keyboard auto-presents.

**VO copy:**

> Now: one thing for today.
>
> *(1s pause)*
>
> What's the one action you'll take?
>
> *(1s pause)*
>
> Type it in.
>
> *(silent ~7 seconds — user types their intention; audio holds)*

**Word count:** 15 spoken words
**Timing:** ~6s spoken + 7s typing pause + 2s of breath/buffer = 15s total

**Note:** If the user has yesterday's intention still in the field (returning user), the field is pre-filled — they can edit or accept. The audio doesn't change either way.

---

## R05 · Send-off (5s)

**Visual:** Orb pulses brighter for 600ms, then fades. Soft cosmic gradient eases out.

**VO copy:**

> That's it. You're already in motion.

**Word count:** 7 words
**Timing:** ~3s spoken + 2s of soft fade-out = 5s total

---

## Total

| Beat | Duration | Spoken | Silent / ambient |
|---|---|---|---|
| R01 Settle | 15s | 10s | 5s pauses |
| R02 Breathe | 20s | 0s | 20s breath cycle |
| R03 Picture | 35s | 10s | 25s (incl. 20s silent reading pause) |
| R04 Anchor | 15s | 6s | 9s (incl. 7s typing pause) |
| R05 Send-off | 5s | 3s | 2s fade |
| **Total** | **90s** | **29s of voice** | **61s of pauses + breath + reading time** |

29 seconds of voice across 90 seconds. The ritual's emotional weight comes from what's *not* said — the breath, the silent reading, the typing pause — not from poetic delivery.

---

## ElevenLabs export instructions

1. Pick voice from premium library — recommend sampling **Sage** (default), **Sarah**, **Hope** for a warm/low/gender-ambiguous read.
2. Set voice settings: stability 0.55, similarity 0.75, style 0.0, speaker boost on.
3. Export each beat as a separate WAV (R01.wav, R03.wav, R04.wav, R05.wav). R02 is silence/ambient.
4. Stitch in DAW (Logic / GarageBand / Audacity) with the silent pauses between, optional ambient bed under, normalize to -14 LUFS, export final as `ritual.mp3` at 96kbps mono.
5. Drop final into `ios/Innerproof/Resources/ritual.mp3` for the bundle.

---

## Open questions (to resolve before recording)

- [ ] Voice pick from sampled candidates (Sage / Sarah / Hope / etc.)
- [ ] Music bed: yes (soft ambient drone) or no (pure voice + silence)? Recommend NO for v1 — silence is part of the ritual.
- [ ] Recording timing: aim for week of Phase 4 (build sequencing in ARCHITECTURE.md §14)
