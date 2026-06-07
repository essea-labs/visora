// Daily-state store — tracks today's ritual completion and intention text.
// Local-only for Phase C MVP. Phase B.7 syncs to Supabase ritual_sessions.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/core/persistence/storage';

interface DailyState {
  /** YYYY-MM-DD of the most recent ritual completion. */
  lastRitualDate: string | null;
  /** Today's intention. Cleared on a new local day. */
  intentionText: string;
  /** YYYY-MM-DD when intentionText was set. */
  intentionSetAt: string | null;

  setIntention: (text: string) => void;
  completeRitual: () => void;
  isRitualCompletedToday: () => boolean;
  todaysIntention: () => string;
  reset: () => void;
}

function todayKey(): string {
  // Local YYYY-MM-DD — based on the user's device timezone.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const initial = {
  lastRitualDate: null as string | null,
  intentionText: '',
  intentionSetAt: null as string | null,
};

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      ...initial,
      setIntention: (text) => {
        set({ intentionText: text, intentionSetAt: todayKey() });
      },
      completeRitual: () => {
        set({ lastRitualDate: todayKey() });
      },
      isRitualCompletedToday: () => get().lastRitualDate === todayKey(),
      todaysIntention: () => {
        const { intentionText, intentionSetAt } = get();
        if (intentionSetAt !== todayKey()) return '';
        return intentionText;
      },
      reset: () => set({ ...initial }),
    }),
    {
      name: 'daily-state',
      storage: createJSONStorage(() => storage),
    },
  ),
);
