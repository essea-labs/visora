// Subscription state — local-only flag for now. Replaces a real
// RevenueCat-backed entitlement check until Phase B.8 wires the SDK.
//
// Surfaces that read this:
//   • Hard paywall during onboarding (start trial → flips to true).
//   • Future: gate premium features (longer ritual library, lock-screen
//     widget, weekly digest, AI future-self letter, etc.).

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/core/persistence/storage';

export type SubscriptionPlan = 'yearly' | 'monthly' | null;

interface State {
  /** True when the user has an active entitlement (trial or paid). */
  isActive: boolean;
  /** Which plan they're on. Null = no plan. */
  plan: SubscriptionPlan;
  /** Unix ms when the trial started (for client-side trial countdown display). */
  trialStartedAt: number | null;

  /**
   * Mark the user as having started the trial / subscribed. Stub used by
   * the onboarding paywall until RevenueCat is wired. When RevenueCat
   * lands, this becomes a no-op locally — entitlement comes from RC.
   */
  startTrial: (plan: Exclude<SubscriptionPlan, null>) => void;
  /** Restore — also stub. Production version calls RC.restorePurchases(). */
  restore: () => Promise<boolean>;
  reset: () => void;
}

export const useSubscriptionStore = create<State>()(
  persist(
    (set) => ({
      isActive: false,
      plan: null,
      trialStartedAt: null,
      startTrial: (plan) =>
        set({ isActive: true, plan, trialStartedAt: Date.now() }),
      restore: async () => {
        // Stub — no-op. Real implementation calls RC.restorePurchases().
        return false;
      },
      reset: () =>
        set({ isActive: false, plan: null, trialStartedAt: null }),
    }),
    {
      name: 'subscription',
      storage: createJSONStorage(() => storage),
      version: 1,
      partialize: (s) => ({
        isActive: s.isActive,
        plan: s.plan,
        trialStartedAt: s.trialStartedAt,
      }),
    },
  ),
);
