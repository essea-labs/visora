// SetupScreen — reusable wrapper for vision-creation screens (O06–O09).
// Single scroll area covers eyebrow + title + body + content, so the header
// copy can scroll out of view to give the input full screen-to-keyboard space.
// PrimaryCta uses KeyboardStickyView: it pins above the keyboard when shown,
// and glides back to its locked-bottom position when the keyboard dismisses.
// Optional onSkip renders a "Set up later" link in the top-right of the header.
//
// Spacing math (when keyboard is shown):
//   - PrimaryCta total height ≈ 104 (60 button + 20 padTop + 24 padBottom)
//   - KeyboardStickyView pins it above keyboard, so the bottom 104px of the
//     "above keyboard" area is occupied by the CTA.
//   - bottomOffset is the gap between input bottom and the REAL keyboard top
//     (KeyboardAwareScrollView is unaware of the sticky CTA).
//   - To prevent the input wrapper from being hidden behind the CTA we use
//     bottomOffset = max input height (140 on Identity) + CTA (104) + buffer.
//   - extraKeyboardSpace gives the scroll engine extra room so trailing
//     content (Name's suggested chips) can scroll above the CTA too.

import { View, Text, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { CosmicBackground } from '@/ui/components/CosmicBackground';
import { OnboardingHeader } from '@/ui/components/OnboardingHeader';
import { PrimaryCta } from '@/ui/components/PrimaryCta';
import { colors, typography } from '@/ui/tokens';

interface Props {
  step: number;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onContinue: () => void;
  /** Optional bail-out from the vision-setup flow. Renders a header link. */
  onSkip?: () => void;
  /** Override the default "Set up later" skip-link label. */
  skipLabel?: string;
  /** Hide the progress dots (post-reveal screens that aren't on the setup track). */
  showProgress?: boolean;
  /** Slot for input fields, pickers, grids, etc. */
  children: React.ReactNode;
  /** Optional override for the children container style. */
  contentStyle?: ViewStyle;
}

export function SetupScreen({
  step,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaDisabled,
  onContinue,
  onSkip,
  skipLabel,
  showProgress = true,
  children,
  contentStyle,
}: Props) {
  return (
    <CosmicBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <OnboardingHeader
          step={step}
          onSkip={onSkip}
          skipLabel={skipLabel}
          showProgress={showProgress}
        />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          bottomOffset={280}
          extraKeyboardSpace={120}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Header copy — scrolls with content so input gets full keyboard-to-top space */}
          <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 20 }}>
            <Text
              style={[
                typography.eyebrow,
                { color: colors.amber, letterSpacing: 2.4, marginBottom: 12 },
              ]}
            >
              {eyebrow}
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '500',
                color: colors.cream,
                letterSpacing: -0.6,
                lineHeight: 32,
                marginBottom: 14,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 14.5,
                lineHeight: 22,
                color: 'rgba(250, 246, 239, 0.78)',
              }}
            >
              {body}
            </Text>
          </View>

          {/* Content slot */}
          <View style={[{ paddingHorizontal: 22 }, contentStyle]}>{children}</View>
        </KeyboardAwareScrollView>

        {/* CTA — pins above keyboard when shown, sits at bottom otherwise */}
        <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
          <PrimaryCta label={ctaLabel} onPress={onContinue} disabled={ctaDisabled} />
        </KeyboardStickyView>
      </SafeAreaView>
    </CosmicBackground>
  );
}
