// O06 — Build your vision board
// v2 (feedback round 1). The user sees the same 2-col grid they'll live
// with in the Vision tab, with each chosen area as a dashed placeholder.
// Tap any tile → mini-sheet (vision-area-sheet.tsx) → fill in photo +
// name + identity. Skip what they're not ready for.
//
// CTA enables when ≥1 area is filled. The remaining tiles can be filled
// later from the Vision tab.

import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

import { SetupScreen } from '@/ui/components/SetupScreen';
import { AREA_BY_KEY, type AreaKind } from '@/core/constants/areas';
import { photoById } from '@/core/constants/photoLibrary';
import { useVisionAreasStore, type AreaVision } from '@/core/stores/useVisionAreasStore';
import { colors, radii } from '@/ui/tokens';

export default function BuildBoard() {
  const router = useRouter();
  const activeAreas = useVisionAreasStore((s) => s.activeAreas);
  const customAreaLabel = useVisionAreasStore((s) => s.customAreaLabel);

  // Round 17: subscribe to the raw visions array (a reactive value)
  // and look up per-category locally. Previously we subscribed to the
  // `firstVisionForCategory` function (stable reference), so tiles
  // didn't re-render after the user saved a new vision via the
  // mini-sheet — they'd come back to a board that looked unchanged.
  const allVisions = useVisionAreasStore((s) => s.visions);
  const visionForCategory = (kind: AreaKind) =>
    allVisions.find((v) => v.category === kind && !v.completedAt);

  const filledCount = activeAreas.filter((k) => !!visionForCategory(k)).length;
  const isReady = filledCount >= 1;

  // Round 23 diagnostic: surface the on-screen state in Metro logs so
  // we can tell whether tiles are missing because the .map didn't run
  // or because they rendered with bad dimensions. Remove this once the
  // build-board "empty grid" bug is confirmed fixed in the wild.
  console.log(
    '[build-board] render',
    'activeAreas=', activeAreas,
    'visionsCount=', allVisions.length,
    'filledCount=', filledCount,
  );

  const openSheet = (area: AreaKind) =>
    router.push({ pathname: '/vision-area-sheet', params: { area } });

  return (
    <SetupScreen
      step={4}
      eyebrow={`Vision setup · 2 of 2 · ${filledCount} of ${activeAreas.length} filled`}
      title="Build your vision board."
      body="Tap each area to bring it to life. Skip what you're not ready for."
      ctaLabel={
        filledCount === 0
          ? 'Fill at least 1 area'
          : `Continue with ${filledCount}`
      }
      ctaDisabled={!isReady}
      onContinue={() => router.push('/(onboarding)/paywall')}
    >
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
          rowGap: 12,
        }}
      >
        {activeAreas.map((key) => {
          const def = key !== 'custom' ? AREA_BY_KEY[key as Exclude<AreaKind, 'custom'>] : null;
          const vision = visionForCategory(key);
          const label =
            def?.label ??
            vision?.customLabel ??
            customAreaLabel ??
            'Custom';
          return vision ? (
            <FilledTile
              key={key}
              label={label}
              vision={vision}
              defThumb={def?.thumb}
              onPress={() => openSheet(key)}
            />
          ) : (
            <EmptyTile
              key={key}
              label={label}
              onPress={() => openSheet(key)}
            />
          );
        })}
      </View>
    </SetupScreen>
  );
}

function FilledTile({
  label,
  vision,
  defThumb,
  onPress,
}: {
  label: string;
  vision: AreaVision;
  defThumb?: any;
  onPress: () => void;
}) {
  // v5: photos[] array, hero is photos[0].
  const heroPhoto = vision.photos?.[0];
  const userPhotoSource =
    (heroPhoto?.uri && { uri: heroPhoto.uri }) ||
    (heroPhoto?.libraryId && photoById(heroPhoto.libraryId)?.source) ||
    undefined;

  // Round 23 fix: tiles must be visible NO MATTER WHAT.
  // Hardcoded height (no more aspectRatio which sometimes collapses
  // when all children are position:absolute), explicit cosmicB bg, a
  // 1.5px amber border so they're unmistakable, and an always-rendered
  // category thumb. The user photo (if any) layers on top with onError
  // logging.
  console.log(
    '[FilledTile] rendering',
    'category=', vision.category,
    'name=', vision.name,
    'photos.length=', vision.photos?.length ?? 0,
    'heroUri=', heroPhoto?.uri?.slice(0, 60),
  );
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: '47.5%',
        height: 200,
        borderRadius: radii.l,
        overflow: 'hidden',
        backgroundColor: colors.cosmicB,
        borderWidth: 1.5,
        borderColor: colors.amber + '88',
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {/* Base layer: bundled category thumb. Always renders when available. */}
      {defThumb && (
        <Image
          source={defThumb}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      )}
      {/* Top layer: user's chosen photo (base64 data URI now). Renders
          over the base if its URI loads. */}
      {userPhotoSource && (
        <Image
          source={userPhotoSource}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
          onError={(e) => {
            console.warn(
              '[FilledTile] photo failed to load for vision',
              vision.id,
              heroPhoto?.uri?.slice(0, 100),
              e.nativeEvent?.error,
            );
          }}
        />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(20,12,6,0.85)']}
        locations={[0.38, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
        <Text
          style={{
            fontSize: 9,
            fontWeight: '700',
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: colors.terraLight,
            marginBottom: 4,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.cream,
            letterSpacing: -0.3,
            fontStyle: 'italic',
            lineHeight: 17,
          }}
          numberOfLines={2}
        >
          {vision.name}
        </Text>
      </View>
    </Pressable>
  );
}

function EmptyTile({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: '47.5%',
        height: 200,
        borderRadius: radii.l,
        backgroundColor: 'rgba(250,246,239,0.04)',
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: 'rgba(250,246,239,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 14,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          backgroundColor: colors.amber + '22',
          borderWidth: 1,
          borderColor: colors.amber + '44',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name="plus" size={12} color={colors.amber} />
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.cream,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 10,
          color: 'rgba(250,246,239,0.50)',
          letterSpacing: 0.2,
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        Tap to fill
      </Text>
    </Pressable>
  );
}
