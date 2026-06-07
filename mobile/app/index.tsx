// Entry point — routes by local onboarding state until Phase B.7 adds real auth.
//
// Round 18 fix: the previous heuristic read from `useOnboardingStore`
// (selectedPhotoIds / description), which the v2 onboarding flow no longer
// populates — that store belongs to the deprecated photos/describe screens.
// New onboarding writes visions into `useVisionAreasStore`, so the check
// now reads from there. Without this fix, users who completed the new
// onboarding got bounced back to /welcome on every relaunch.
//
// Note on paywall enforcement: not gated here intentionally. A "has visions
// → resume at /paywall" gate sounded right, but it trapped users who
// tapped × — they couldn't reach Settings to replay onboarding or do
// anything else. Real entitlement enforcement lands in Phase B.8 with
// RevenueCat (will gate premium features inside the app, not the routing).

import { Redirect } from 'expo-router';
import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { useDailyStore } from '@/core/stores/useDailyStore';

export default function Index() {
  const visions = useVisionAreasStore((s) => s.visions);
  const ritualDate = useDailyStore((s) => s.lastRitualDate);

  // "Done with onboarding" heuristic until auth lands:
  // user has at least one vision saved OR has run a ritual.
  const onboarded = visions.length > 0 || !!ritualDate;

  return <Redirect href={onboarded ? '/(tabs)/home' : '/(onboarding)/welcome'} />;
}
