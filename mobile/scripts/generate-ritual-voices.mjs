#!/usr/bin/env node
// Generate the 5 ritual voice variants using ElevenLabs.
//
// Round 38 architecture: chunked generation + real silences.
// Previously we used SSML <break time="N" /> tags inside one big API
// call. ElevenLabs caps each break at ~3s, and chained breaks didn't
// produce the deep meditation silences the user was after.
//
// New approach:
//   1. The script is an array of {text, silenceAfter} chunks.
//   2. Each chunk gets its own ElevenLabs call → MP3.
//   3. ffmpeg generates the requested silence (44.1kHz mono AAC).
//   4. ffmpeg concatenates: chunk1 | silence1 | chunk2 | silence2 | …
//   5. afconvert ensures the final file is a real AAC M4A.
//
// Result: pauses are EXACTLY the length we want (3-15s), the speech
// runs cleanly inside each chunk without weird SSML artefacts, and
// the total runtime grows to a proper meditation length (~3 min).
//
// Usage:
//   cd mobile && node scripts/generate-ritual-voices.mjs
//
// Requires:
//   – Node 18+ (built-in fetch)
//   – ffmpeg (for silence + concat)
//   – afconvert (macOS, for final AAC M4A wrap)
//   – ELEVENLABS_API_KEY in mobile/.env

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── load .env ──────────────────────────────────────────────
async function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  try {
    const text = await fs.readFile(envPath, 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch (err) {
    console.warn(`[warn] could not load .env: ${err.message}`);
  }
}
await loadEnv();

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('ELEVENLABS_API_KEY not found in process env or mobile/.env');
  process.exit(1);
}

// ── the script as phrase chunks ────────────────────────────
// R39 rewrite:
//   • Third-person "they" replaced with direct second-person "you" —
//     the user becomes the future self, not an observer of them.
//   • "write what is true today" → "write your intention for today" —
//     clearer, matches the data field name (intentionText) and the
//     "Anchor it" framing on the next screen.
//
// Each chunk: clean speech (no SSML), then a precise silence.
// Silences sized for meditation pacing — multi-second breathing
// spaces at every meaningful transition. Total estimated runtime
// ~180s (3 minutes).
const SCRIPT_CHUNKS = [
  { text: 'Welcome back.', silenceAfter: 4 },
  { text: 'Take a moment.', silenceAfter: 3 },
  { text: 'Let your shoulders fall.', silenceAfter: 3 },
  { text: 'Let whatever happened before this moment, go quiet.', silenceAfter: 5 },
  { text: "You don't need to do anything yet.", silenceAfter: 5 },
  { text: 'Breathe in, slowly.', silenceAfter: 5 },
  { text: 'And out.', silenceAfter: 5 },
  { text: 'Again. In.', silenceAfter: 5 },
  { text: 'And out.', silenceAfter: 6 },
  { text: 'Each breath, settling you deeper into here.', silenceAfter: 5 },
  { text: "Now, picture yourself — already living what you're becoming.", silenceAfter: 5 },
  { text: 'Not someday. See yourself now.', silenceAfter: 5 },
  { text: 'What are you wearing?', silenceAfter: 5 },
  { text: 'Where are you standing?', silenceAfter: 5 },
  { text: 'Who is around you?', silenceAfter: 5 },
  { text: 'What does the room look like?', silenceAfter: 6 },
  { text: 'How are you holding yourself?', silenceAfter: 5 },
  { text: 'What does your face say?', silenceAfter: 6 },
  { text: "This isn't a fantasy. This is already real.", silenceAfter: 3 },
  { text: 'This is you. Already.', silenceAfter: 7 },
  { text: "Now, write today's intention. Use ‘I am’ — like an affirmation.", silenceAfter: 13 },
  { text: 'You are becoming.', silenceAfter: 2 },
  { text: 'Carry this with you.', silenceAfter: 2 },
];

// ── voice mapping ──────────────────────────────────────────
// R46: collapsed to a single voice (Daniel, Steady Broadcaster) for
// MVP. The other four voices in the rotation are gone — see git for
// the multi-voice array and `src/core/audio/ritualVoice.ts` for the
// post-MVP "add more voices later" pattern.
const VARIANTS = [
  { index: 1, day: 'Daily', voiceName: 'Daniel', outFile: 'ritual.m4a' },
];

// ── ElevenLabs helpers ─────────────────────────────────────
async function fetchVoices() {
  const res = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': API_KEY },
  });
  if (!res.ok) {
    throw new Error(`voices fetch failed: ${res.status} — ${await res.text()}`);
  }
  const data = await res.json();
  return data.voices ?? [];
}

function findVoiceId(voices, name) {
  const target = name.toLowerCase();
  let v = voices.find((x) => x.name === name);
  if (v) return v.voice_id;
  v = voices.find((x) => x.name?.toLowerCase() === target);
  if (v) return v.voice_id;
  v = voices.find((x) => {
    const first = x.name?.split(/[\s\-—]+/)[0]?.toLowerCase();
    return first === target;
  });
  if (v) return v.voice_id;
  v = voices.find((x) => x.name?.toLowerCase().startsWith(target));
  return v?.voice_id;
}

async function generateChunk(voiceId, text, outPath) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        // R38: pushed to the floor of ElevenLabs' range for maximum
        // meditation calmness.
        stability: 0.85, // very steady, almost monotone — calm
        similarity_boost: 0.85,
        style: 0.0,
        use_speaker_boost: true,
        speed: 0.7, // minimum allowed by ElevenLabs (~70% of default pace)
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`chunk generation failed: ${res.status} — ${await res.text()}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  await fs.writeFile(outPath, Buffer.from(arrayBuffer));
}

function silenceFile(workDir, seconds) {
  // Pre-generate one silence file per unique duration so we don't
  // run ffmpeg redundantly. 44.1kHz mono MP3 to match ElevenLabs output.
  const filename = path.join(workDir, `silence-${seconds}s.mp3`);
  return { filename, seconds };
}

async function ensureSilenceFile(filename, seconds) {
  try {
    await fs.stat(filename);
    return; // already exists
  } catch {
    // create it
  }
  execFileSync('ffmpeg', [
    '-y',
    '-f', 'lavfi',
    '-i', `anullsrc=r=44100:cl=mono`,
    '-t', String(seconds),
    '-acodec', 'libmp3lame',
    '-b:a', '128k',
    filename,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
}

// ── per-variant generation ─────────────────────────────────
async function generateVariant(variantIndex, voiceId, voiceLabel, finalOutPath) {
  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), `ritual-${variantIndex}-`));

  try {
    // 1. Generate all speech chunks
    const chunkFiles = [];
    for (let i = 0; i < SCRIPT_CHUNKS.length; i++) {
      const chunkPath = path.join(workDir, `chunk-${String(i).padStart(2, '0')}.mp3`);
      await generateChunk(voiceId, SCRIPT_CHUNKS[i].text, chunkPath);
      chunkFiles.push({ path: chunkPath, silenceAfter: SCRIPT_CHUNKS[i].silenceAfter });
    }

    // 2. Generate silence files for each unique duration
    const uniqueSilences = [...new Set(SCRIPT_CHUNKS.map((c) => c.silenceAfter))];
    const silenceMap = new Map();
    for (const seconds of uniqueSilences) {
      const { filename } = silenceFile(workDir, seconds);
      await ensureSilenceFile(filename, seconds);
      silenceMap.set(seconds, filename);
    }

    // 3. Build the concat list: chunk1, silence1, chunk2, silence2, ...
    const listPath = path.join(workDir, 'concat.txt');
    const lines = [];
    for (const { path: chunkPath, silenceAfter } of chunkFiles) {
      lines.push(`file '${chunkPath.replace(/'/g, "'\\''")}'`);
      const silPath = silenceMap.get(silenceAfter);
      if (silPath) {
        lines.push(`file '${silPath.replace(/'/g, "'\\''")}'`);
      }
    }
    await fs.writeFile(listPath, lines.join('\n'));

    // 4. ffmpeg concat → MP3
    const concatMp3 = path.join(workDir, 'concat.mp3');
    execFileSync('ffmpeg', [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', listPath,
      '-c', 'copy',
      concatMp3,
    ], { stdio: ['ignore', 'ignore', 'pipe'] });

    // 5. afconvert → AAC M4A (so expo-av plays it cleanly on iOS).
    //    Same step we used in R28 when MP3-as-.m4a failed on device.
    execFileSync('afconvert', [
      '-f', 'm4af',
      '-d', 'aac@44100',
      concatMp3,
      finalOutPath,
    ], { stdio: ['ignore', 'ignore', 'pipe'] });

    const { size } = await fs.stat(finalOutPath);
    return size;
  } finally {
    // Clean up temp dir
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

// ── main ───────────────────────────────────────────────────
async function main() {
  // CLI: `--variant=4` regenerates ONLY variant 4. Useful for
  // targeted fixes without burning credits on the other four.
  const variantArg = process.argv.find((a) => a.startsWith('--variant='));
  const variantFilter = variantArg ? Number(variantArg.split('=')[1]) : null;
  const variantsToRun = variantFilter
    ? VARIANTS.filter((v) => v.index === variantFilter)
    : VARIANTS;
  if (variantFilter && variantsToRun.length === 0) {
    console.error(`No variant with index ${variantFilter}. Valid: ${VARIANTS.map((v) => v.index).join(', ')}`);
    process.exit(1);
  }

  const audioDir = path.join(__dirname, '..', 'assets', 'audio', 'ritual');
  await fs.mkdir(audioDir, { recursive: true });

  console.log('Fetching voice library...');
  const voices = await fetchVoices();
  console.log(`  found ${voices.length} voice(s) in your account`);

  console.log(`\nScript: ${SCRIPT_CHUNKS.length} chunks, estimated runtime ~${
    SCRIPT_CHUNKS.reduce((sum, c) => sum + c.silenceAfter, 0) +
    Math.round(SCRIPT_CHUNKS.reduce((sum, c) => sum + c.text.length, 0) * 0.07)
  }s\n`);

  if (variantFilter) {
    console.log(`Regenerating only variant ${variantFilter} (--variant flag).\n`);
  }

  let ok = 0;
  let failed = 0;
  for (const variant of variantsToRun) {
    const id = findVoiceId(voices, variant.voiceName);
    if (!id) {
      console.warn(`  ⚠ variant ${variant.index} (${variant.voiceName}) not found — skipping`);
      failed++;
      continue;
    }
    // R46: `outFile` is configurable per-variant. For MVP there's just
    // one (`ritual.m4a`) — future voices can pick their own filename
    // (e.g. `ritual-evening.m4a`) without touching the engine code.
    const outPath = path.join(audioDir, variant.outFile);
    process.stdout.write(
      `  → ${variant.outFile} (${variant.day} · ${variant.voiceName})... `,
    );
    try {
      const size = await generateVariant(variant.index, id, variant.voiceName, outPath);
      console.log(`✓ ${(size / 1024).toFixed(1)} KB`);
      ok++;
    } catch (err) {
      console.log('✗');
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone — ${ok} generated, ${failed} skipped/failed.`);
  if (ok > 0) {
    console.log('Reload Expo Go (fully kill + reopen) to hear the new voices.');
  }
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
