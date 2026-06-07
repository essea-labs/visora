// Affirmations store — tracks which affirmations the user has saved
// (favorited via the heart). Persisted locally; synced to backend when
// auth lands (Phase B.7+).
//
// Future surfaces (out of scope this round):
//   • Full-screen swipe feed (/affirm).
//   • Library / explore screen with Saved filter (/affirmations).
//   • Lock-screen widget pulling from saved list.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/core/persistence/storage';

interface State {
  /** Affirmation ids the user has hearted. */
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  reset: () => void;
}

export const useAffirmationsStore = create<State>()(
  persist(
    (set, get) => ({
      savedIds: [],
      toggleSaved: (id) => {
        const { savedIds } = get();
        set({
          savedIds: savedIds.includes(id)
            ? savedIds.filter((x) => x !== id)
            : [id, ...savedIds],
        });
      },
      isSaved: (id) => get().savedIds.includes(id),
      reset: () => set({ savedIds: [] }),
    }),
    {
      name: 'affirmations',
      storage: createJSONStorage(() => storage),
      version: 1,
      partialize: (s) => ({ savedIds: s.savedIds }),
    },
  ),
);
