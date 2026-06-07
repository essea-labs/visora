// Onboarding stack — sealed flow, no swipe-back, no header.
// Each beat is its own route under (onboarding)/.

import { Stack } from 'expo-router';
import { colors } from '@/ui/tokens';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cosmicA },
        animation: 'fade',
        gestureEnabled: true, // iOS-standard swipe-back from left edge
      }}
    />
  );
}
