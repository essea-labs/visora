// Wins store — local-only chronological wins list.
// Phase B.7 syncs to Supabase wins table.
// SPEC §6.7: wins are immutable after 5 minutes (enforced server-side via
// trigger). For local MVP we don't enforce immutability — that lands when
// the backend wires up.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/core/persistence/storage';
import type { AreaKind } from '@/core/constants/areas';

export interface Win {
  id: string;
  body: string;
  /** Local file URI (camera roll) or remote URL once synced. */
  photoUri?: string;
  /** Area of focus this win supports (Round 4 feedback). Acts as a fallback
   *  when `visionId` isn't set (e.g. on legacy wins). */
  areaKind?: AreaKind | null;
  /** Round 11: specific vision this win supports. Optional — wins can be
   *  attributed to a category alone (areaKind) or none at all. */
  visionId?: string | null;
  /** ISO timestamp when the win was captured. */
  createdAt: string;
  /** Soft-delete marker (kept for sync to backend later). */
  deletedAt?: string;
}

interface WinsState {
  wins: Win[];
  addWin: (input: Omit<Win, 'id' | 'createdAt' | 'deletedAt'>) => Win;
  updateWin: (id: string, patch: Partial<Omit<Win, 'id' | 'createdAt'>>) => void;
  deleteWin: (id: string) => void;
  winById: (id: string) => Win | undefined;
  winsForDay: (yyyymmdd: string) => Win[];
  todaysWins: () => Win[];
  /**
   * All non-deleted wins tagged with the given category, newest-first.
   * Used by the Vision Detail screen to render the "Proof toward this"
   * list and the stats card (Total / This week / This month).
   */
  winsForCategory: (kind: AreaKind) => Win[];
  /**
   * Round 11: wins specifically linked to one vision (by visionId).
   * Used by Vision Detail to scope the wins list to that vision only.
   */
  winsForVision: (visionId: string) => Win[];
  reset: () => void;
}

function genId(): string {
  // Compact id good enough for local-only data; replaced by uuid on sync.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function dayKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayKey(): string {
  return dayKey(new Date().toISOString());
}

export const useWinsStore = create<WinsState>()(
  persist(
    (set, get) => ({
      wins: [],
      addWin: (input) => {
        const win: Win = {
          ...input,
          id: genId(),
          createdAt: new Date().toISOString(),
        };
        set({ wins: [win, ...get().wins] });
        return win;
      },
      updateWin: (id, patch) => {
        set({
          wins: get().wins.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        });
      },
      deleteWin: (id) => {
        const now = new Date().toISOString();
        set({
          wins: get().wins.map((w) => (w.id === id ? { ...w, deletedAt: now } : w)),
        });
      },
      winById: (id) => get().wins.find((w) => w.id === id),
      winsForDay: (yyyymmdd) =>
        get()
          .wins.filter((w) => !w.deletedAt && dayKey(w.createdAt) === yyyymmdd)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      todaysWins: () =>
        get()
          .wins.filter((w) => !w.deletedAt && dayKey(w.createdAt) === todayKey())
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      winsForCategory: (kind) =>
        get()
          .wins.filter((w) => !w.deletedAt && w.areaKind === kind)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      winsForVision: (visionId) =>
        get()
          .wins.filter((w) => !w.deletedAt && w.visionId === visionId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      reset: () => set({ wins: [] }),
    }),
    {
      name: 'wins-local',
      storage: createJSONStorage(() => storage),
      // v4 (round 11): adds `visionId` for per-vision win attribution.
      // Wins from earlier versions get `visionId: null`. The `areaKind`
      // field stays as a fallback when visionId isn't set.
      version: 4,
      migrate: (persisted: any, fromVersion) => {
        // Defensive: if nothing or wrong shape, start fresh.
        if (!persisted || !Array.isArray(persisted.wins)) {
          return { wins: [] };
        }
        return {
          ...persisted,
          wins: persisted.wins.map((w: any) => ({
            ...w,
            areaKind: w.areaKind ?? null,
            visionId: w.visionId ?? null,
          })),
        };
      },
    },
  ),
);
