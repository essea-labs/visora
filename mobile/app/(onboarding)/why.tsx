// O02 — Why intro
// Slogan + 1-paragraph body. Storytelling format with image background.

import { useRouter } from 'expo-router';
import { HeroProofScreen } from '@/ui/components/HeroProofScreen';

export default function WhyIntro() {
  const router = useRouter();
  return (
    <HeroProofScreen
      step={2}
      eyebrow="Why this works"
      title="Identity beats goals."
      body="Most apps track goals you’ll forget by February. Visora uses two research backed habits, visualisation and evidence, to shift your sense of self. Behaviour follows naturally."
      image={require('@/assets/images/why-intro.jpg')}
      ctaLabel="Continue"
      // v2: skip the old per-vision setup (visualization → small-wins → behavior
      // → photos → describe → reveal). The new flow is pick-areas → build-board,
      // then back to the original witness + morning-time tail.
      onContinue={() => router.push('/(onboarding)/name')}
    />
  );
}
