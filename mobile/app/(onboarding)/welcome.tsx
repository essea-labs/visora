// O01 — Welcome
// First impression. Hero photo, bottom-anchored content. Same layout pattern
// as the rest of the storytelling sell-phase screens.

import { View, Text, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { colors, spacing, radii } from '@/ui/tokens';

export default function Welcome() {
  const router = useRouter();

  const handleBegin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    router.push('/(onboarding)/why');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      {/* Hero photo */}
      <Image
        source={require('@/assets/images/onboarding-hero.jpg')}
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
          'rgba(20, 12, 6, 0.20)',
          'transparent',
          'rgba(20, 12, 6, 0.55)',
          'rgba(20, 12, 6, 0.92)',
        ]}
        locations={[0, 0.30, 0.62, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ paddingHorizontal: 22, paddingBottom: 28 }}>
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '700',
              letterSpacing: 2.4,
              textTransform: 'uppercase',
              color: colors.amber,
              marginBottom: 14,
            }}
          >
            Visora
          </Text>

          <Text
            style={{
              fontSize: 32,
              lineHeight: 36,
              letterSpacing: -0.7,
              fontWeight: '500',
              color: colors.cream,
              marginBottom: 16,
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 22,
            }}
          >
            Become who you envision.
          </Text>

          <Text
            style={{
              fontSize: 15.5,
              lineHeight: 24,
              color: colors.creamSoft,
              marginBottom: 28,
              textShadowColor: 'rgba(0, 0, 0, 0.4)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 8,
            }}
          >
            Build a vision board of where you're heading. Each morning, a 3 minute voice guided practice walks you through who you want to become. All day, capture small wins as evidence.
          </Text>

          <Pressable
            onPress={handleBegin}
            style={({ pressed }) => ({
              height: 60,
              borderRadius: radii.full,
              backgroundColor: pressed ? '#E8E2D5' : colors.cream,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.m,
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
              Begin
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              // Sign-in flow — Phase B.3
            }}
            style={{ paddingVertical: spacing.m, alignItems: 'center' }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: 'rgba(250, 246, 239, 0.7)',
              }}
            >
              I already have an account
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
