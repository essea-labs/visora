// HeroProofScreen — reusable template for Storytelling-style proof screens.
// Full-bleed image background, single big statement, supporting body, CTA.

import { View, Text, Image, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/ui/components/OnboardingHeader';
import { PrimaryCta } from '@/ui/components/PrimaryCta';
import { colors, typography } from '@/ui/tokens';

interface Props {
  step: number;
  eyebrow: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
  ctaLabel: string;
  onContinue: () => void;
  /** When provided, renders a "Set up later" link in the header. */
  onSkip?: () => void;
  /** Hide the progress dots (e.g. on post-reveal screens). */
  showProgress?: boolean;
}

export function HeroProofScreen({
  step,
  eyebrow,
  title,
  body,
  image,
  ctaLabel,
  onContinue,
  onSkip,
  showProgress = true,
}: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      <Image
        source={image}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          'rgba(20, 12, 6, 0.55)',
          'rgba(20, 12, 6, 0.15)',
          'rgba(20, 12, 6, 0.55)',
          'rgba(20, 12, 6, 0.95)',
        ]}
        locations={[0, 0.18, 0.55, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <OnboardingHeader step={step} onSkip={onSkip} showProgress={showProgress} />
        <View style={{ flex: 1 }} />
        {/* Bottom-anchored content block: same paddings + same margins
            across every sell-phase screen for consistency. */}
        <View style={{ paddingHorizontal: 22, marginBottom: 28 }}>
          <Text
            style={[
              typography.eyebrow,
              { color: colors.amber, letterSpacing: 2.4, marginBottom: 14 },
            ]}
          >
            {eyebrow}
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '500',
              color: colors.cream,
              letterSpacing: -0.7,
              lineHeight: 36,
              marginBottom: 16,
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 22,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 15.5,
              lineHeight: 24,
              color: colors.creamSoft,
              textShadowColor: 'rgba(0, 0, 0, 0.4)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 8,
            }}
          >
            {body}
          </Text>
        </View>
        <PrimaryCta label={ctaLabel} onPress={onContinue} />
      </SafeAreaView>
    </View>
  );
}
