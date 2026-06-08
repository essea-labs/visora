// O15 — Onboarding complete (handoff into the main app)
// Phase B.8 inserts the paywall before this point. For now we hand straight
// off to /(tabs)/today.

import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { CosmicBackground } from '@/ui/components/CosmicBackground';
import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { colors, radii, spacing, typography } from '@/ui/tokens';

export default function OnboardingComplete() {
  const router = useRouter();
  const activeVisions = useVisionAreasStore((s) => s.activeVisions);
  const visionsCount = activeVisions().length;

  const handleBegin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    router.replace('/(tabs)/home');
  };

  return (
    <CosmicBackground variant="terra">
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 22 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <FadeIn delay={150}>
            <Text
              style={[
                typography.eyebrow,
                {
                  color: colors.amber,
                  letterSpacing: 2.4,
                  marginBottom: 14,
                  textAlign: 'center',
                },
              ]}
            >
              You're all set
            </Text>
          </FadeIn>

          <FadeIn delay={350} slide>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '500',
                color: colors.cream,
                letterSpacing: -0.7,
                lineHeight: 36,
                textAlign: 'center',
                marginBottom: 14,
                textShadowColor: 'rgba(0, 0, 0, 0.4)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 14,
              }}
            >
              Your becoming{'\n'}begins now.
            </Text>
          </FadeIn>

          <FadeIn delay={650}>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 23,
                color: colors.creamSoft,
                textAlign: 'center',
                marginBottom: 36,
                paddingHorizontal: 24,
              }}
            >
              {visionsCount === 0
                ? "Open the Vision tab whenever you're ready to start pinning."
                : visionsCount === 1
                  ? 'One vision is on your board. Capture wins, watch it become.'
                  : `${visionsCount} visions are on your board. Capture wins, watch them become.`}
            </Text>
          </FadeIn>
        </View>

        <FadeIn delay={1300}>
          <View style={{ paddingBottom: spacing.l }}>
            <Pressable
              onPress={handleBegin}
              style={({ pressed }) => ({
                height: 60,
                borderRadius: radii.full,
                backgroundColor: pressed ? '#E8E2D5' : colors.cream,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.s,
                shadowColor: colors.terra,
                shadowOffset: { width: 0, height: 18 },
                shadowOpacity: 0.45,
                shadowRadius: 40,
                elevation: 8,
              })}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.terraDeep,
                  letterSpacing: 0.1,
                }}
              >
                Begin my practice
              </Text>
            </Pressable>
            {/* R68: 'Reset and restart' removed — Settings → Replay
                onboarding is the canonical full-reset entry point, and
                the link here added confusion right at the moment of
                completing the flow. */}
          </View>
        </FadeIn>
      </SafeAreaView>
    </CosmicBackground>
  );
}

// ── helpers ─────────────────────────────────────────────────────────

function FadeIn({
  delay,
  duration = 600,
  slide = false,
  children,
}: {
  delay: number;
  duration?: number;
  slide?: boolean;
  children: React.ReactNode;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(slide ? 14 : 0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withTiming(0, { duration, easing: Easing.out(Easing.cubic) }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
