// OnboardingHeader — back chevron + dot progress + optional skip link.
// Current step is a wider amber pill, future steps are thin faint marks.
// Skip link appears on vision-setup screens to let users bail and finish
// later from Settings.

import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { colors } from '@/ui/tokens';

// v2 (feedback round 1): flow compressed from the original 11-beat plan
// to 6 reachable beats — welcome → why → pick-areas → build-board →
// witness → morning-time → complete (no progress on complete). The
// skipped screens (visualization, small-wins, behavior, photos, describe,
// reveal, morning-ritual, capture-wins) still exist as files but are no
// longer in the chain.
const TOTAL_STEPS = 6;

interface Props {
  step: number; // 1-indexed
  hideBack?: boolean;
  /** When provided, renders a "Set up later" link in the right slot. */
  onSkip?: () => void;
  /** Text for the skip link. Defaults to "Set up later". */
  skipLabel?: string;
  /** Hide the dot progress (e.g. on celebration / post-reveal screens). */
  showProgress?: boolean;
}

export function OnboardingHeader({
  step,
  hideBack = false,
  onSkip,
  skipLabel = 'Set up later',
  showProgress = true,
}: Props) {
  const router = useRouter();

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Back button */}
      {hideBack ? (
        <View style={{ width: 36, height: 36 }} />
      ) : (
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: 999,
            backgroundColor: pressed
              ? 'rgba(250, 246, 239, 0.16)'
              : 'rgba(250, 246, 239, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(250, 246, 239, 0.16)',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <Feather name="chevron-left" size={16} color={colors.cream} />
        </Pressable>
      )}

      {/* Dot progress */}
      {showProgress ? (
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const isCurrent = i + 1 === step;
            const isPast = i + 1 < step;
            return (
              <View
                key={i}
                style={{
                  width: isCurrent ? 18 : 5,
                  height: 3,
                  borderRadius: 999,
                  backgroundColor:
                    isCurrent || isPast ? colors.amber : 'rgba(250, 246, 239, 0.18)',
                }}
              />
            );
          })}
        </View>
      ) : (
        <View />
      )}

      {/* Right slot — skip link or balance spacer */}
      {onSkip ? (
        <Pressable onPress={onSkip} hitSlop={12}>
          <Text
            style={{
              fontSize: 12.5,
              fontWeight: '500',
              color: 'rgba(250, 246, 239, 0.6)',
              letterSpacing: 0.1,
            }}
          >
            {skipLabel}
          </Text>
        </Pressable>
      ) : (
        <View style={{ width: 36 }} />
      )}
    </View>
  );
}
