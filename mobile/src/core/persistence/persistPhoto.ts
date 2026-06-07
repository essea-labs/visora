// Photo persistence helper — R19.
//
// Why this exists: `expo-image-picker` returns a `file://` URI that points
// into the app's cache directory (or, on iOS dev builds, a temp container
// path). Those locations can be cleared by the OS, by Expo Go reloads, or
// by a Metro restart. When the user picks a photo, saves a vision/win, then
// reloads the app, the stored URI no longer resolves — the tile renders
// blank.
//
// The fix: copy the picked file into the app's *documents* directory under
// a dedicated `user-photos/` folder. The documents dir is persistent across
// reloads and survives until the user deletes the app. We store that
// persistent URI in the vision/win record instead of the picker URI.
//
// `persistPhoto` is idempotent: if you pass it a URI that's already inside
// the docs dir, it returns the URI unchanged (no-op).

import * as FileSystem from 'expo-file-system/legacy';

const PHOTOS_DIR = `${FileSystem.documentDirectory ?? ''}user-photos/`;

let dirReady: Promise<void> | null = null;

async function ensurePhotosDir(): Promise<void> {
  if (dirReady) return dirReady;
  dirReady = (async () => {
    const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    }
  })();
  return dirReady;
}

/**
 * Copy a picker-returned photo URI into a persistent location. Returns the
 * new `file://` URI under the app's documents directory. Safe to call with
 * URIs that are already persistent (no-op in that case).
 *
 * Falls back to the original URI on copy failure so the UI never crashes —
 * worst case the photo goes stale on next reload, same as before.
 */
export async function persistPhoto(uri: string): Promise<string> {
  if (!uri) return uri;
  // Non-file URIs (e.g. remote https, data:, library require()) — leave alone.
  if (!uri.startsWith('file://')) return uri;
  // Already in the persistent location — no-op.
  const docDir = FileSystem.documentDirectory;
  if (docDir && uri.startsWith(docDir)) return uri;

  try {
    await ensurePhotosDir();
    const ext = (uri.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const name = `photo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dest = `${PHOTOS_DIR}${name}`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  } catch (err) {
    // Don't block save on a copy failure — return the picker URI and let
    // the UI render what it can. The user can re-pick on next edit if it
    // goes stale.
    console.warn('[persistPhoto] copy failed, falling back to original URI:', err);
    return uri;
  }
}
