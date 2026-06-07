// Win Detail — view-first screen for a single win.
//
// Round 11: replaces the old "tap a win → straight into edit" pattern.
// Now tapping a win opens this screen first. The user reads the win,
// optionally jumps to its linked vision, then taps the Edit pill in
// the top-right chrome to open the capture-win sheet in edit mode.
//
// Layout:
//   • Photo backdrop (when present)
//   • Top chrome: ← back · Edit pill →
//   • Category chip pinned over the photo (top-left of body area)
//   • Body text (the win itself)
//   • Linked-vision card if this win attributes to a vision
//   • Captured timestamp

import { useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  type ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { AREA_BY_KEY, type AreaKind } from '@/core/constants/areas';
import { photoById } from '@/core/constants/photoLibrary';
import { useWinsStore } from '@/core/stores/useWinsStore';
import { useVisionAreasStore, type AreaVision } from '@/core/stores/useVisionAreasStore';
import { colors } from '@/ui/tokens';

const HERO_HEIGHT = 360;

export default function WinDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const win = useWinsStore((s) => (id ? s.winById(id) : undefined));
  const visionById = useVisionAreasStore((s) => s.visionById);
  const customAreaLabel = useVisionAreasStore((s) => s.customAreaLabel);

  const linkedVision = useMemo(
    () => (win?.visionId ? visionById(win.visionId) : undefined),
    [win?.visionId, visionById],
  );

  if (!win) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cosmicA, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.cream, fontSize: 14, opacity: 0.6 }}>Win not found.</Text>
      </View>
    );
  }

  const def =
    win.areaKind && win.areaKind !== 'custom'
      ? AREA_BY_KEY[win.areaKind as Exclude<AreaKind, 'custom'>]
      : null;
  const categoryLabel = def?.label ?? (win.areaKind === 'custom' ? customAreaLabel ?? 'Custom' : null);

  const heroSource: ImageSourcePropType | undefined = win.photoUri
    ? { uri: win.photoUri }
    : undefined;

  const handleEdit = () => {
    router.push({ pathname: '/capture-win', params: { id: win.id } });
  };

  const capturedAt = new Date(win.createdAt);
  const capturedLabel = capturedAt.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' · ' + capturedAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero photo (or warm-cosmic fallback) */}
        <View style={{ height: HERO_HEIGHT, width: '100%', overflow: 'hidden' }}>
          {heroSource ? (
            <Image
              source={heroSource}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[colors.cosmicC, colors.cosmicB, colors.cosmicA]}
              locations={[0, 0.6, 1]}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
          )}
          <LinearGradient
            colors={[
              'rgba(20,12,6,0.45)',
              'transparent',
              'transparent',
              colors.cosmicA,
            ]}
            locations={[0, 0.3, 0.6, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Category pill floats over the photo bottom-left */}
          {categoryLabel && (
            <View
              style={{
                position: 'absolute',
                left: 22,
                bottom: 18,
                paddingHorizontal: 10,
                height: 26,
                borderRadius: 999,
                backgroundColor: 'rgba(20,12,6,0.65)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.18)',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: colors.amber,
                }}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '700',
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: colors.cream,
                }}
              >
                {categoryLabel}
              </Text>
            </View>
          )}
        </View>

        {/* Body — the win itself */}
        <View style={{ paddingHorizontal: 22, paddingTop: 28 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '400',
              color: colors.cream,
              letterSpacing: -0.3,
              lineHeight: 30,
            }}
          >
            {win.body}
          </Text>
        </View>

        {/* Linked vision card — R19 redesign for item 4.
            Visually distinct from the LinkedWin rows on Vision Detail.
            Where LinkedWin says "this vision contains this evidence" (small
            dot, list row, captured-feeling), this card says "this win points
            UP to a vision" (large photo, italic-serif name, terra accent
            rule, aspirational-feeling). */}
        {linkedVision && (
          <Pressable
            onPress={() =>
              router.push({ pathname: '/vision-detail', params: { id: linkedVision.id } })
            }
            style={({ pressed }) => ({
              marginTop: 28,
              marginHorizontal: 22,
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: 'rgba(216,154,90,0.10)',
              borderWidth: 1,
              borderColor: 'rgba(216,154,90,0.28)',
              flexDirection: 'row',
              alignItems: 'stretch',
              opacity: pressed ? 0.88 : 1,
              // Soft warm shadow distinguishes this from the flat list rows
              // used for LinkedWin elsewhere.
              shadowColor: colors.terra,
              shadowOpacity: 0.25,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
              elevation: 4,
            })}
          >
            {/* Terra accent rule down the left edge — visual "↑" pointer */}
            <View
              style={{
                width: 3,
                backgroundColor: colors.terra,
              }}
            />
            <LinkedVisionPhoto vision={linkedVision} />
            <View
              style={{
                flex: 1,
                minWidth: 0,
                paddingHorizontal: 14,
                paddingVertical: 14,
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginBottom: 6,
                }}
              >
                <Feather name="arrow-up-right" size={10} color={colors.terraLight} />
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '700',
                    letterSpacing: 1.8,
                    textTransform: 'uppercase',
                    color: colors.terraLight,
                  }}
                >
                  Threaded to
                </Text>
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 17,
                  fontStyle: 'italic',
                  fontWeight: '500',
                  color: colors.cream,
                  letterSpacing: -0.3,
                  lineHeight: 21,
                  marginBottom: 3,
                }}
              >
                {linkedVision.name || categoryLabel || 'Vision'}
              </Text>
              {!!linkedVision.identity && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 11.5,
                    color: 'rgba(250,246,239,0.55)',
                    letterSpacing: 0.1,
                  }}
                >
                  {linkedVision.identity}
                </Text>
              )}
            </View>
          </Pressable>
        )}

        {/* Captured timestamp */}
        <Text
          style={{
            paddingHorizontal: 22,
            marginTop: 22,
            fontSize: 10.5,
            fontWeight: '700',
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.45)',
          }}
        >
          Captured {capturedLabel}
        </Text>
      </ScrollView>

      {/* Top chrome — back + Edit pill (absolute over the hero) */}
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
        }}
        pointerEvents="box-none"
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 8,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => ({
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: 'rgba(20,12,6,0.55)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.16)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Feather name="chevron-left" size={18} color={colors.cream} />
          </Pressable>
          <Pressable
            onPress={handleEdit}
            hitSlop={10}
            style={({ pressed }) => ({
              paddingHorizontal: 14,
              height: 38,
              borderRadius: 999,
              backgroundColor: 'rgba(20,12,6,0.55)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.16)',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 5,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Feather name="edit-2" size={12} color={colors.cream} />
            <Text
              style={{
                color: colors.cream,
                fontSize: 12,
                fontWeight: '600',
                letterSpacing: 0.4,
              }}
            >
              Edit
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// R19 redesign: bigger photo block instead of a 40px swatch — visually
// places the vision's hero front-and-centre, reinforcing the
// "you're pointing towards a real, photo-grounded vision" feel. The
// adjacent LinkedWin row stays small and text-driven, so the two
// patterns no longer share DNA.
function LinkedVisionPhoto({ vision }: { vision: AreaVision }) {
  const def =
    vision.category !== 'custom'
      ? AREA_BY_KEY[vision.category as Exclude<AreaKind, 'custom'>]
      : null;
  const hero = vision.photos?.[0];
  const source: ImageSourcePropType | undefined =
    (hero?.uri && { uri: hero.uri }) ||
    (hero?.libraryId && photoById(hero.libraryId)?.source) ||
    def?.thumb;
  return (
    <View
      style={{
        width: 76,
        backgroundColor: colors.cosmicB,
        overflow: 'hidden',
      }}
    >
      {source && (
        <Image
          source={source}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      )}
    </View>
  );
}
