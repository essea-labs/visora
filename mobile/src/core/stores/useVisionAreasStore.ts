// Vision areas — v5 (round 6 redesign).
//
// What changed from v4:
//   • `visions` is now a flat ARRAY (was Partial<Record<AreaKind, AreaVision>>).
//     Visions are independent objects, each with its own `id`, decoupled from
//     the grid slot they used to live in. A user can have any number of
//     visions per category (including multiple "Custom"s), and the category
//     of a vision can be changed freely on edit.
//   • Each vision has `photos: VisionPhoto[]` (up to 5) instead of a single
//     `photoUri` / `photoLibraryId` pair.
//   • Each vision has an optional `completedAt: number`. When set, the
//     vision is archived (filtered out of `activeVisions()` but visible
//     via `archivedVisions()`).
//   • New canonical actions: addVision, updateVision, completeVision,
//     restoreVision, deleteVision, visionById.
//   • Legacy `activeAreas` and `customAreaLabel` REMAIN as separate
//     user-preference state — onboarding's pick-areas screen still uses
//     them to capture "which categories matter to me" up-front. They are
//     no longer derived from `visions` and the bulletin board no longer
//     reads them (the board now shows whatever visions exist).
//   • `saveVision()` and `removeVision()` are kept as thin adapters so
//     legacy callsites (e.g. onboarding/build-board.tsx) keep working
//     without immediate rewrites.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/core/persistence/storage';
import type { AreaKind } from '@/core/constants/areas';

export interface VisionPhoto {
  /** Local file URI from the camera roll. Mutually exclusive with `libraryId` in practice. */
  uri?: string;
  /** Id from the bundled photo library (see `src/core/constants/photoLibrary.ts`). */
  libraryId?: string;
}

export interface AreaVision {
  /** Stable id (replaces the old AreaKind-as-key model). */
  id: string;
  /** Which life-area category this vision belongs to. Editable. */
  category: AreaKind;
  /** Short title in the user's words ("The Studio of My Own"). */
  name: string;
  /** Identity statement ("I am a sought-after designer"). Optional. */
  identity: string;
  /** Up to 5 photos. The first is the bulletin-card hero. */
  photos: VisionPhoto[];
  /** Only meaningful when category === 'custom'. */
  customLabel?: string;
  /** When set, the vision is archived (completed). undefined = active. */
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
}

interface State {
  /** All visions, active + archived. Bulletin board reads from this. */
  visions: AreaVision[];

  /**
   * Legacy user-preference: which categories the user expressed interest in
   * during onboarding's pick-areas step. NOT derived from `visions` and
   * NOT used by the bulletin board. Onboarding screens still read/write this.
   */
  activeAreas: AreaKind[];
  /** Legacy: label for the user's custom category if they named one in onboarding. */
  customAreaLabel: string | null;

  // ── Canonical vision actions (v5+) ──
  addVision: (input: Omit<AreaVision, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>) => AreaVision;
  updateVision: (id: string, patch: Partial<Omit<AreaVision, 'id' | 'createdAt'>>) => void;
  completeVision: (id: string) => void;
  restoreVision: (id: string) => void;
  deleteVision: (id: string) => void;
  visionById: (id: string) => AreaVision | undefined;
  activeVisions: () => AreaVision[];
  archivedVisions: () => AreaVision[];
  /** First vision (active or archived) whose category matches. Used by legacy callsites. */
  firstVisionForCategory: (category: AreaKind) => AreaVision | undefined;

  // ── Legacy actions (kept as adapters for onboarding compatibility) ──
  setActiveAreas: (areas: AreaKind[]) => void;
  toggleArea: (area: AreaKind) => void;
  setCustomArea: (label: string | null) => void;
  /**
   * @deprecated v5 — Use addVision / updateVision. Kept as an adapter for
   * existing callsites (onboarding/build-board.tsx). Looks up the first
   * vision with matching category and updates it, or creates a new one.
   */
  saveVision: (v: {
    key: AreaKind;
    name: string;
    identity: string;
    photoUri?: string;
    photoLibraryId?: string;
    customLabel?: string;
  }) => void;
  /**
   * @deprecated v5 — Use deleteVision(id). Removes all visions whose
   * category matches the given key.
   */
  removeVision: (key: AreaKind) => void;

  reset: () => void;
}

// Minimum / maximum number of life-areas user can pick during onboarding.
// Lowered from 3 → 1 in R19: users were finding "Choose 3 to 5" too
// prescriptive. One area is enough to do meaningful work; people can
// always add more later from the Vision tab.
export const MIN_AREAS = 1;
export const MAX_AREAS = 5;

/**
 * Suggested defaults — only used by callers that explicitly want a starting
 * set (e.g. a "Suggest for me" button). NOT used as the initial value of
 * `activeAreas` anymore: that starts as `[]` so onboarding's pick-areas
 * screen begins with NOTHING selected. Pre-filling all 5 caused the bug
 * where users thought tapping a tile selected it but actually toggled it
 * off, ending up on build-board with the wrong count.
 */
export const SUGGESTED_AREAS: AreaKind[] = [
  'career',
  'health',
  'love',
  'finance',
  'joy',
];

function genId(): string {
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const initial = {
  visions: [] as AreaVision[],
  activeAreas: [] as AreaKind[],
  customAreaLabel: null as string | null,
};

export const useVisionAreasStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial,

      // ── Canonical actions ──
      addVision: (input) => {
        const now = Date.now();
        const vision: AreaVision = {
          ...input,
          id: genId(),
          createdAt: now,
          updatedAt: now,
        };
        set({ visions: [vision, ...get().visions] });
        return vision;
      },

      updateVision: (id, patch) => {
        const now = Date.now();
        set({
          visions: get().visions.map((v) =>
            v.id === id ? { ...v, ...patch, updatedAt: now } : v,
          ),
        });
      },

      completeVision: (id) => {
        const now = Date.now();
        set({
          visions: get().visions.map((v) =>
            v.id === id ? { ...v, completedAt: now, updatedAt: now } : v,
          ),
        });
      },

      restoreVision: (id) => {
        const now = Date.now();
        set({
          visions: get().visions.map((v) =>
            v.id === id ? { ...v, completedAt: undefined, updatedAt: now } : v,
          ),
        });
      },

      deleteVision: (id) => {
        set({ visions: get().visions.filter((v) => v.id !== id) });
      },

      visionById: (id) => get().visions.find((v) => v.id === id),
      activeVisions: () => get().visions.filter((v) => !v.completedAt),
      archivedVisions: () =>
        get()
          .visions.filter((v) => !!v.completedAt)
          .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)),
      firstVisionForCategory: (category) =>
        get().visions.find((v) => v.category === category && !v.completedAt),

      // ── Legacy actions ──
      setActiveAreas: (areas) =>
        set({ activeAreas: areas.slice(0, MAX_AREAS) }),

      toggleArea: (area) => {
        const { activeAreas } = get();
        if (activeAreas.includes(area)) {
          set({ activeAreas: activeAreas.filter((a) => a !== area) });
          if (area === 'custom') set({ customAreaLabel: null });
        } else if (activeAreas.length < MAX_AREAS) {
          set({ activeAreas: [...activeAreas, area] });
        }
      },

      setCustomArea: (label) => {
        const trimmed = label?.trim() || null;
        const { activeAreas } = get();
        if (trimmed) {
          const next: AreaKind[] = activeAreas.includes('custom')
            ? activeAreas
            : [...activeAreas, 'custom' as AreaKind].slice(0, MAX_AREAS);
          set({ customAreaLabel: trimmed, activeAreas: next });
        } else {
          set({
            customAreaLabel: null,
            activeAreas: activeAreas.filter((a) => a !== 'custom'),
          });
        }
      },

      saveVision: (v) => {
        // Adapter: find existing vision with this category (and matching
        // customLabel if 'custom'), otherwise create. Translates legacy
        // single-photo shape to the new photos array.
        const { visions } = get();
        const photos: VisionPhoto[] = v.photoUri
          ? [{ uri: v.photoUri }]
          : v.photoLibraryId
            ? [{ libraryId: v.photoLibraryId }]
            : [];
        const existing = visions.find(
          (x) =>
            x.category === v.key &&
            !x.completedAt &&
            (v.key !== 'custom' || x.customLabel === v.customLabel),
        );
        if (existing) {
          get().updateVision(existing.id, {
            name: v.name,
            identity: v.identity,
            photos,
            customLabel: v.customLabel,
          });
        } else {
          get().addVision({
            category: v.key,
            name: v.name,
            identity: v.identity,
            photos,
            customLabel: v.customLabel,
          });
        }
      },

      removeVision: (key) => {
        set({ visions: get().visions.filter((v) => v.category !== key) });
      },

      reset: () => set({ ...initial }),
    }),
    {
      name: 'vision-areas',
      storage: createJSONStorage(() => storage),
      version: 5,
      partialize: (s) => ({
        visions: s.visions,
        activeAreas: s.activeAreas,
        customAreaLabel: s.customAreaLabel,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<State>;
        const validKinds: AreaKind[] = [
          'career', 'health', 'love', 'finance', 'joy', 'custom',
        ];
        const rawAreas = Array.isArray(persisted.activeAreas) ? persisted.activeAreas : [];
        const filteredAreas = rawAreas.filter(
          (k): k is AreaKind =>
            typeof k === 'string' && validKinds.includes(k as AreaKind),
        );
        const rawVisions = Array.isArray(persisted.visions) ? persisted.visions : [];
        return {
          ...currentState,
          ...persisted,
          visions: rawVisions,
          // Respect persisted state as-is: empty means the user hasn't picked
          // areas yet (or explicitly cleared them via Replay onboarding).
          // Previously we replaced empty with DEFAULT_ACTIVE_AREAS, which
          // resurrected stale defaults on every launch.
          activeAreas: filteredAreas,
          customAreaLabel:
            typeof persisted.customAreaLabel === 'string'
              ? persisted.customAreaLabel
              : null,
        };
      },
      migrate: (persisted: any, fromVersion: number): State => {
        const validKinds: AreaKind[] = [
          'career', 'health', 'love', 'finance', 'joy', 'custom',
        ];

        // Preserve onboarding's category preferences
        const rawAreas: any[] = Array.isArray(persisted?.activeAreas) ? persisted.activeAreas : [];
        const filteredAreas = rawAreas.filter(
          (k): k is AreaKind => validKinds.includes(k as AreaKind),
        );
        // Migration preserves what was persisted; we no longer inject
        // DEFAULT_ACTIVE_AREAS here. Pre-filling all 5 made pick-areas
        // toggle the wrong way for fresh users.
        const activeAreas: AreaKind[] = filteredAreas;
        const customAreaLabel =
          typeof persisted?.customAreaLabel === 'string' ? persisted.customAreaLabel : null;

        // v4 → v5: visions was Record<AreaKind, AreaVision>. Each entry
        // becomes an array element with a new `id`, `category` (was `key`),
        // and `photos[]` (built from photoUri | photoLibraryId).
        let visions: AreaVision[] = [];
        if (fromVersion < 5 && persisted?.visions && typeof persisted.visions === 'object' && !Array.isArray(persisted.visions)) {
          const now = Date.now();
          visions = Object.values(persisted.visions)
            .filter((v): v is any => !!v && typeof v === 'object')
            .map((v: any): AreaVision => {
              const photos: VisionPhoto[] = v.photoUri
                ? [{ uri: v.photoUri }]
                : v.photoLibraryId
                  ? [{ libraryId: v.photoLibraryId }]
                  : [];
              return {
                id: genId(),
                category: validKinds.includes(v.key) ? v.key : 'career',
                name: typeof v.name === 'string' ? v.name : '',
                identity: typeof v.identity === 'string' ? v.identity : '',
                photos,
                customLabel: typeof v.customLabel === 'string' ? v.customLabel : undefined,
                completedAt: undefined,
                createdAt: typeof v.createdAt === 'number' ? v.createdAt : now,
                updatedAt: typeof v.updatedAt === 'number' ? v.updatedAt : now,
              };
            });
        } else if (Array.isArray(persisted?.visions)) {
          // Already v5+ shape
          visions = persisted.visions;
        }

        return {
          visions,
          activeAreas,
          customAreaLabel,
        } as State;
      },
    },
  ),
);
