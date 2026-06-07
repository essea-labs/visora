# Daily ritual — voice variants

The 90-second guided visualisation. **Same script, 5 different voices** — variety from tone, not content.

Output 5 files into `mobile/assets/audio/ritual/`:

```
variant-1.m4a   (Mon)
variant-2.m4a   (Tue)
variant-3.m4a   (Wed)
variant-4.m4a   (Thu)
variant-5.m4a   (Fri)
```

Day-of-week rotation in the app: Mon → 1, Tue → 2, …, Sat → 1 (wraps), Sun → 2.

---

## The script (90 seconds total)

> **Timing notes for the recorder.** Read at a steady, calm pace. Pauses are intentional — give the listener room to breathe. Total runtime should land between 88–92 seconds. The bracketed timing markers shouldn't be read aloud.

**[0:00 — soft, low volume opening]**

> Welcome back.

*(3 second pause)*

**[0:03 — settle, gentle]**

> Take a moment. Let your shoulders fall. Let whatever happened before this moment go quiet.

*(2 second pause)*

> You don't need to do anything yet.

*(3 second pause)*

**[0:15 — breathe, slowing down]**

> Breathe in slowly.

*(3 second pause for inhale)*

> And out.

*(3 second pause for exhale)*

> Again. In…

*(3 second pause)*

> And out.

*(4 second pause)*

> Each breath, settling you deeper into here.

**[0:35 — picture, warmer]**

> Now, picture the version of you who has already become what you're building toward.

*(2 second pause)*

> Not someday. See them now.

*(3 second pause)*

> What do they wear? Where do they stand? Who is around them? What does the room look like?

*(4 second pause)*

> How do they hold themselves? What does their face say?

*(4 second pause)*

> They're not a fantasy. They're already real. You are them — already.

*(5 second pause)*

**[1:10 — anchor — quiet handoff]**

> Now, in your own words, write what is true today.

*(13 second silence — the user is typing their intention. Important: no narration here, just space.)*

**[1:25 — send-off, intimate, almost a whisper]**

> You are becoming. Carry this with you.

*(2 second pause to end)*

**[1:30 — fade out]**

---

## ElevenLabs setup

In the ElevenLabs studio, paste the script above into the text input, then generate 5 versions using these voices. The voice ids may differ — search by name in the voice library.

| # | Day | Voice (ElevenLabs) | Why |
|---|-----|---|---|
| 1 | Mon | **Lily** | Warm, calm, mid-tone feminine. Good "Monday reset" energy. |
| 2 | Tue | **Sarah** | Grounded, friendly feminine. Trustworthy, present. |
| 3 | Wed | **Dorothy** | Poetic, lyrical, contemplative. Mid-week dreaminess. |
| 4 | Thu | **Daniel** | Low, resonant masculine. Quiet authority. |
| 5 | Fri | **Charlie** | Bright, warm, casual masculine. Friday lightness. |

If a name doesn't match exactly in your ElevenLabs library, pick the closest equivalent — the descriptors are the actual brief.

**Generation settings** (per voice):
- Stability: **50** (some variation feels human, too low feels jittery)
- Similarity: **75**
- Style exaggeration: **0** (clean read)
- Use speaker boost: **on**
- Model: `eleven_multilingual_v2` (best for natural pauses)

**Export:** Download as MP3 (96 kbps is fine for voice), then convert to M4A or rename `.m4a` extension. Expo-AV handles both.

**Placement:** Drop the 5 files into `mobile/assets/audio/ritual/` and reload Expo Go. The player's rotation logic is already wired — it picks the right variant for the day automatically.

---

## QA checklist

After generating:
- [ ] Each file is between 85 and 95 seconds
- [ ] The 13-second silence at 1:10 is preserved (no chopping it)
- [ ] Voice doesn't peak / clip — normalize to -3 dB
- [ ] No background music or artefacts (ElevenLabs default is clean)
- [ ] File names match exactly: `variant-1.m4a` through `variant-5.m4a`
