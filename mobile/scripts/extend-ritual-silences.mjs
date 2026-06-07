#!/usr/bin/env node
// Stretches the inter-sentence silences in an existing ritual audio
// file, without changing the speech tempo. Useful when you generated
// the voice externally (e.g. via the ElevenLabs Studio web UI for a
// Voice Library voice that the API can't reach) and just want longer
// breathing room between sentences before the app uses it.
//
// How it works:
//   1. Run ffmpeg silencedetect on the input → list of [start, end] times
//      where silence already exists.
//   2. Slice the input into NON-silent speech segments using -ss/-t.
//   3. Generate a single padded silence file (original silence length + N).
//   4. Concat: speech1 | padded-silence1 | speech2 | padded-silence2 | …
//   5. afconvert → AAC M4A so expo-av plays it cleanly on iOS.
//
// Usage:
//   cd mobile && node scripts/extend-ritual-silences.mjs \
//     --in "assets/audio/ritual/ritual - Milo.mp3" \
//     --out assets/audio/ritual/ritual.m4a \
//     --extend 2
//
//   --in       path to source audio (mp3 or m4a)
//   --out      path to final M4A (overwrites)
//   --extend   seconds to ADD to each detected silence (default 1.5)
//   --noise    silence threshold dB, default -35 (more negative = stricter)
//   --min      minimum silence duration to count, default 0.4s
//
// Requires: ffmpeg, afconvert (macOS), Node 18+.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── parse args ─────────────────────────────────────────────
function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const IN_REL = arg('--in', 'assets/audio/ritual/ritual - Milo.mp3');
const OUT_REL = arg('--out', 'assets/audio/ritual/ritual.m4a');
const EXTEND_SEC = Number(arg('--extend', '1.5'));
const NOISE_DB = arg('--noise', '-35');
const MIN_SILENCE = Number(arg('--min', '0.4'));

const IN_PATH = path.resolve(path.join(__dirname, '..'), IN_REL);
const OUT_PATH = path.resolve(path.join(__dirname, '..'), OUT_REL);

// ── helpers ────────────────────────────────────────────────
function getDurationSec(file) {
  // Use ffmpeg to grab duration. ffprobe would be cleaner but ffmpeg
  // is the one dependency we already require.
  const res = spawnSync('ffmpeg', ['-i', file], { encoding: 'utf8' });
  const stderr = res.stderr ?? '';
  const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  if (!m) throw new Error(`could not read duration of ${file}`);
  const [, h, mi, s] = m;
  return Number(h) * 3600 + Number(mi) * 60 + Number(s);
}

function detectSilences(file, noiseDb, minSec) {
  const res = spawnSync(
    'ffmpeg',
    [
      '-i', file,
      '-af', `silencedetect=noise=${noiseDb}dB:d=${minSec}`,
      '-f', 'null',
      '-',
    ],
    { encoding: 'utf8' },
  );
  const stderr = res.stderr ?? '';
  const silences = [];
  let openStart = null;
  for (const line of stderr.split('\n')) {
    const start = line.match(/silence_start:\s*([\d.]+)/);
    if (start) {
      openStart = Number(start[1]);
      continue;
    }
    const end = line.match(/silence_end:\s*([\d.]+)/);
    if (end && openStart !== null) {
      silences.push({ start: openStart, end: Number(end[1]) });
      openStart = null;
    }
  }
  return silences;
}

function sliceSpeech(file, startSec, endSec, outPath) {
  // Re-encode here (rather than -c copy) because mp3 cut points need
  // to land on frame boundaries; re-encoding sidesteps glitches at the
  // splice points.
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i', file,
      '-ss', String(startSec),
      '-t', String(endSec - startSec),
      '-acodec', 'libmp3lame',
      '-b:a', '128k',
      outPath,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
}

function silenceFile(seconds, outPath) {
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-f', 'lavfi',
      '-i', 'anullsrc=r=44100:cl=mono',
      '-t', String(seconds),
      '-acodec', 'libmp3lame',
      '-b:a', '128k',
      outPath,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
}

// ── main ───────────────────────────────────────────────────
async function main() {
  await fs.access(IN_PATH).catch(() => {
    console.error(`Input not found: ${IN_PATH}`);
    process.exit(1);
  });

  const duration = getDurationSec(IN_PATH);
  console.log(`Input: ${path.basename(IN_PATH)}`);
  console.log(`  duration: ${duration.toFixed(2)}s`);
  console.log(`  silence detect: noise=${NOISE_DB}dB, minDuration=${MIN_SILENCE}s`);

  const silences = detectSilences(IN_PATH, NOISE_DB, MIN_SILENCE);
  console.log(`  found ${silences.length} silence region(s)`);
  if (silences.length === 0) {
    console.error('No silences detected. Try raising --noise (e.g. -30) or lowering --min (e.g. 0.25).');
    process.exit(1);
  }
  for (const [i, s] of silences.entries()) {
    const dur = (s.end - s.start).toFixed(2);
    console.log(`    ${String(i + 1).padStart(2, ' ')}. ${s.start.toFixed(2)}s → ${s.end.toFixed(2)}s  (${dur}s)`);
  }

  // Build the list of speech segments — everything BETWEEN silences,
  // plus head (0 → first silence start) and tail (last silence end → duration).
  const speechSegments = [];
  let cursor = 0;
  for (const { start, end } of silences) {
    if (start > cursor + 0.01) speechSegments.push({ start: cursor, end: start });
    cursor = end;
  }
  if (duration > cursor + 0.01) speechSegments.push({ start: cursor, end: duration });

  console.log(`\nWill produce ${speechSegments.length} speech segments interleaved with ${silences.length} stretched silences (each +${EXTEND_SEC}s).`);

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ritual-extend-'));
  try {
    // 1. Slice speech segments
    const speechFiles = [];
    for (const [i, seg] of speechSegments.entries()) {
      const out = path.join(workDir, `speech-${String(i).padStart(2, '0')}.mp3`);
      sliceSpeech(IN_PATH, seg.start, seg.end, out);
      speechFiles.push(out);
    }

    // 2. Pre-generate the padded silence files. Each takes the
    //    original silence duration + EXTEND_SEC.
    const silenceFiles = [];
    for (const [i, s] of silences.entries()) {
      const dur = (s.end - s.start) + EXTEND_SEC;
      const out = path.join(workDir, `silence-${String(i).padStart(2, '0')}.mp3`);
      silenceFile(dur, out);
      silenceFiles.push(out);
    }

    // 3. Build concat list: speech0, silence0, speech1, silence1, ...
    //    Final speech segment has no trailing silence.
    const listPath = path.join(workDir, 'concat.txt');
    const lines = [];
    for (let i = 0; i < speechFiles.length; i++) {
      lines.push(`file '${speechFiles[i].replace(/'/g, "'\\''")}'`);
      if (i < silenceFiles.length) {
        lines.push(`file '${silenceFiles[i].replace(/'/g, "'\\''")}'`);
      }
    }
    await fs.writeFile(listPath, lines.join('\n'));

    // 4. Concat to a single MP3
    const concatMp3 = path.join(workDir, 'concat.mp3');
    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', listPath,
        '-c', 'copy',
        concatMp3,
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );

    // 5. afconvert → AAC M4A so expo-av plays it cleanly on iOS.
    await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
    execFileSync(
      'afconvert',
      ['-f', 'm4af', '-d', 'aac@44100', concatMp3, OUT_PATH],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );

    const outDur = getDurationSec(OUT_PATH);
    const { size } = await fs.stat(OUT_PATH);
    console.log(`\n✓ Wrote ${path.basename(OUT_PATH)}`);
    console.log(`  size: ${(size / 1024).toFixed(1)} KB`);
    console.log(`  duration: ${outDur.toFixed(2)}s (was ${duration.toFixed(2)}s, +${(outDur - duration).toFixed(2)}s)`);
    console.log('\nReload Expo Go (fully kill + reopen) to hear it.');
  } finally {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
