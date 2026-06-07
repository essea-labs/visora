#!/usr/bin/env node
// Re-downloads each library photo as a 1500-px-wide JPEG so the
// wisdom cards (and any other consumer) render crisply at iPhone @3x
// instead of upscaling 400-500px thumbnails.
//
// Source: Unsplash Source API (https://source.unsplash.com/) — picks
// a real Unsplash photo matching the given keywords. We use the
// `featured` collection scope where possible for curation quality.
//
// Filenames are PRESERVED exactly so existing photoLibraryId
// references (e.g. 'work-coffee' in affirmations.ts) keep working.
// Only the file content is replaced.
//
// Usage:
//   cd mobile && node scripts/refresh-library-photos.mjs
//   cd mobile && node scripts/refresh-library-photos.mjs --only work-coffee,health-yoga
//
// Output:
//   • Backs up existing files to /tmp/library-backup-{ts}/
//   • Overwrites mobile/assets/images/library/{filename}.jpg
//   • Reports old size → new size + final pixel dimensions
//
// Requires: Node 18+, sips (macOS, for dimension probe), curl.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LIBRARY_DIR = path.resolve(__dirname, '..', 'assets', 'images', 'library');

// Library id → filename + keyword search terms.
// Filenames MUST match what photoLibrary.ts references.
const PHOTOS = [
  // Career / work
  { id: 'work-paris',  file: 'work-paris.jpg',  keywords: 'paris,cafe,morning,window' },
  { id: 'work-window', file: 'work-window.jpg', keywords: 'window,morning,light,workspace' },
  { id: 'work-coffee', file: 'work-coffee.jpg', keywords: 'coffee,morning,desk,minimal' },
  { id: 'work-laptop', file: 'work-laptop.jpg', keywords: 'laptop,desk,minimal,workspace' },
  { id: 'work-plant',  file: 'work-plant.jpg',  keywords: 'workspace,plants,green,calm' },
  { id: 'work-beach',  file: 'work-beach.jpg',  keywords: 'beach,ocean,horizon,calm' },
  // Health
  { id: 'health-runner', file: 'health-runner.jpg', keywords: 'running,trail,nature,morning' },
  { id: 'health-yoga',   file: 'health-yoga.jpg',   keywords: 'yoga,calm,meditation,light' },
  { id: 'health-medal',  file: 'health-medal.jpg',  keywords: 'marathon,finish,achievement,golden' },
  { id: 'health-shoes',  file: 'health-shoes.jpg',  keywords: 'running,shoes,athletic,minimal' },
  // Love
  { id: 'love-hero', file: 'love-hero.jpg', keywords: 'couple,sunset,silhouette,warm' },
  // Joy / hero warm
  { id: 'warm-bright', file: 'hero-warm-bright.jpg', keywords: 'sunset,golden,hour,warm,sky' },
];

// ── args ────────────────────────────────────────────────────
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const onlySet = onlyArg ? new Set(onlyArg.split('=')[1].split(',')) : null;
const toRun = onlySet ? PHOTOS.filter((p) => onlySet.has(p.id)) : PHOTOS;

if (toRun.length === 0) {
  console.error(`No matching ids. Valid: ${PHOTOS.map((p) => p.id).join(', ')}`);
  process.exit(1);
}

// ── helpers ─────────────────────────────────────────────────
function getDimensions(file) {
  const res = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const w = res.stdout?.match(/pixelWidth:\s*(\d+)/)?.[1];
  const h = res.stdout?.match(/pixelHeight:\s*(\d+)/)?.[1];
  return w && h ? `${w}×${h}` : '?';
}

async function fileSizeKB(file) {
  try {
    const { size } = await fs.stat(file);
    return (size / 1024).toFixed(1);
  } catch { return '?'; }
}

function downloadUnsplash(keywords, outPath) {
  // Source API: returns a 302 redirect to a real Unsplash photo
  // matching the keywords, sized as requested.
  const url = `https://source.unsplash.com/1600x1067/?${encodeURIComponent(keywords)}`;
  const res = spawnSync(
    'curl',
    [
      '-fsSL',
      '--max-time', '30',
      '-o', outPath,
      '-A', 'Mozilla/5.0 (Visora photo refresh script)',
      url,
    ],
    { encoding: 'utf8' },
  );
  if (res.status !== 0) {
    throw new Error(`curl failed (${res.status}): ${res.stderr?.trim() || 'no stderr'}`);
  }
}

function downloadPicsumFallback(seed, outPath) {
  // Fallback if Unsplash Source is unreachable. picsum returns a
  // deterministic photo for a given seed string — not keyword-matched
  // but always works and always high-res.
  const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/1067`;
  const res = spawnSync(
    'curl',
    [
      '-fsSL',
      '--max-time', '30',
      '-o', outPath,
      url,
    ],
    { encoding: 'utf8' },
  );
  if (res.status !== 0) {
    throw new Error(`picsum fallback failed (${res.status}): ${res.stderr?.trim() || 'no stderr'}`);
  }
}

// ── main ────────────────────────────────────────────────────
async function main() {
  // Backup existing files
  const ts = new Date(2026, 0, 1).toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = `/tmp/library-backup-${ts}`;
  await fs.mkdir(backupDir, { recursive: true });
  for (const p of toRun) {
    const src = path.join(LIBRARY_DIR, p.file);
    try {
      await fs.copyFile(src, path.join(backupDir, p.file));
    } catch {
      // Original file missing — fine, will just create new.
    }
  }
  console.log(`Backed up ${toRun.length} existing file(s) to ${backupDir}\n`);

  let ok = 0;
  let failed = 0;
  for (const p of toRun) {
    const outPath = path.join(LIBRARY_DIR, p.file);
    const oldSize = await fileSizeKB(outPath);
    const oldDim = getDimensions(outPath);
    process.stdout.write(`  → ${p.file.padEnd(28)} `);
    try {
      downloadUnsplash(p.keywords, outPath);
      const newSize = await fileSizeKB(outPath);
      const newDim = getDimensions(outPath);
      console.log(`✓ ${oldDim} ${oldSize}KB → ${newDim} ${newSize}KB`);
      ok++;
    } catch (err) {
      // Fall back to picsum. R64: prefix the seed with 'cheery-' to
      // re-roll a different picsum photo than the prior 'just-{id}'
      // seed. Picsum still returns random, but at least we're rolling
      // a different die.
      const seed = `cheery-${p.id}`;
      try {
        downloadPicsumFallback(seed, outPath);
        const newSize = await fileSizeKB(outPath);
        const newDim = getDimensions(outPath);
        console.log(`✓ ${oldDim} ${oldSize}KB → ${newDim} ${newSize}KB (picsum seed: ${seed})`);
        ok++;
      } catch (err2) {
        console.log(`✗ ${err.message} / ${err2.message}`);
        failed++;
      }
    }
  }

  console.log(`\nDone — ${ok} replaced, ${failed} failed.`);
  console.log(`Originals backed up at ${backupDir}.`);
  console.log(`Reload Expo Go (fully kill + reopen) to see the new photos.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
