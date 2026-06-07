// Profile store — the user's name (collected in onboarding) and any
// other simple personal-details state. Local-only for MVP. Phase B.7
// will sync this to Supabase profiles via Sign in with Apple.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/core/persistence/storage';

interface ProfileState {
  /** First name (or chosen display name) used for greetings. */
  name: string;

  setName: (name: string) => void;
  reset: () => void;
}

const initial = {
  name: '',
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...initial,
      setName: (name) => set({ name: name.trim() }),
      reset: () => set(initial),
    }),
    {
      name: 'profile-store',
      storage: createJSONStorage(() => storage),
      version: 1,
    },
  ),
);
