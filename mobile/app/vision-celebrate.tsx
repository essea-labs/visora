// Vision celebration — the "you became this" moment between Mark complete
// and archive. Full-bleed hero, identity statement, win count, and a
// hold-to-seal button that fires `completeVision()` on long-press hold.
//
// Why hold-to-seal vs a tap: completion is meant to feel weighty, not
// accidental. The hold (about 900ms) gives the user a beat of intention
// + a satisfying haptic when the ring fills.

import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { AREA_BY_KEY, type AreaKind } from '@/core/constants/areas';
import { photoById } from '@/core/constants/photoLibrary';
import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { useWinsStore } from '@/core/stores/useWinsStore';
import { colors } from '@/ui/tokens';

const HOLD_DURATION_MS = 900;

export default function VisionCelebrate() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const vision = useVisionAreasStore((s) => (id ? s.visionById(id) : undefined));
  const completeVision = useVisionAreasStore((s) => s.completeVision);
  // Subscribe to the raw wins array (reactive); the `winsForVision`
  // function reference is stable and wouldn't track wins data.
  const allWins = useWinsStore((s) => s.wins);

  const [progress] = useState(new Animated.Value(0));
  const [sealing, setSealing] = useState(false);
  const sealedRef = useRef(false);

  // Compute win count once vision exists
  const wins = vision
    ? allWins.reduce(
        (n, w) => (!w.deletedAt && w.visionId === vision.id ? n + 1 : n),
        0,
      )
    : 0;

  useEffect(() => {
    // If id is bad or vision missing, bounce back.
    if (!vision) {
      const t = setTimeout(() => router.back(), 200);
      return () => clearTimeout(t);
    }
  }, [vision, router]);

  if (!vision) {
    return <View style={{ flex: 1, backgroundColor: colors.cosmicA }} />;
  }

  const def =
    vision.category !== 'custom'
      ? AREA_BY_KEY[vision.category as Exclude<AreaKind, 'custom'>]
      : null;
  const categoryLabel = def?.label ?? vision.customLabel ?? 'Custom';

  const hero = vision.photos?.[0];
  const heroSource =
    (hero?.uri && { uri: hero.uri }) ||
    (hero?.libraryId && photoById(hero.libraryId)?.source) ||
    def?.thumb;

  const startHold = () => {
    if (sealedRef.current) return;
    setSealing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !sealedRef.current) {
        sealedRef.current = true;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        completeVision(vision.id);
        // Pop the celebrate stack + the detail stack so we land on Vision tab.
        setTimeout(() => {
          router.replace('/(tabs)/vision' as never);
        }, 200);
      }
    });
  };

  const releaseHold = () => {
    if (sealedRef.current) return;
    setSealing(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const ringWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      {heroSource && (
        <Image
          source={heroSource}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={[
          'rgba(20,12,6,0.55)',
          'rgba(20,12,6,0.30)',
          'rgba(20,12,6,0.80)',
          colors.cosmicA,
        ]}
        locations={[0, 0.35, 0.75, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
        {/* Close — top-right, very small. The whole point is to honour the
            moment, so we don't push a back button. But provide an escape. */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 18 }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => ({
              width: 32,
              height: 32,
              borderRadius: 999,
              backgroundColor: 'rgba(20,12,6,0.55)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.16)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 0.6,
            })}
          >
            <Text style={{ color: colors.cream, fontSize: 16, lineHeight: 18 }}>×</Text>
          </Pressable>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'flex-end', paddingBottom: 60 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: colors.amber,
              marginBottom: 18,
            }}
          >
            You became this.
          </Text>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '500',
              color: colors.cream,
              letterSpacing: -0.8,
              lineHeight: 40,
              fontStyle: 'italic',
              marginBottom: 18,
            }}
          >
            {vision.name || categoryLabel}
          </Text>
          {!!vision.identity && (
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: 'rgba(250,246,239,0.85)',
                fontStyle: 'italic',
                paddingLeft: 12,
                borderLeftWidth: 2,
                borderLeftColor: colors.amber + 'AA',
                marginBottom: 28,
              }}
            >
              {vision.identity}
            </Text>
          )}
          <Text
            style={{
              fontSize: 13,
              color: 'rgba(250,246,239,0.65)',
              letterSpacing: 0.3,
              marginBottom: 36,
            }}
          >
            {wins} {wins === 1 ? 'win' : 'wins'} witnessed it.
          </Text>

          {/* Hold to seal — pressable with progress ring */}
          <Pressable
            onPressIn={startHold}
            onPressOut={releaseHold}
            style={{
              height: 60,
              borderRadius: 999,
              overflow: 'hidden',
              backgroundColor: 'rgba(250,246,239,0.06)',
              borderWidth: 1,
              borderColor: colors.amber + '88',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Fill animation — terra gradient slides in from the left */}
            <Animated.View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: ringWidth,
                opacity: 0.95,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={[colors.terra, colors.terraDeep]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
            <Text
              style={{
                color: colors.cream,
                fontSize: 14,
                fontWeight: '700',
                letterSpacing: 2.6,
                textTransform: 'uppercase',
              }}
            >
              {sealing ? 'Sealing…' : 'Hold to seal'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
