// Vision area mini-sheet — v6 (round 6 redesign).
//
// What changed from v3:
//   • Two modes via URL params:
//       — `?id=<visionId>` → edit mode
//       — `?mode=create&category=<kind>` or no params → create mode
//     Legacy `?area=<kind>` param still works (compat with build-board.tsx)
//     and is treated as "edit if a vision exists in that category, else
//     create a new one in that category."
//   • Category picker: horizontal chip row at the top. Users can change
//     a vision's category freely on edit (per the "Pick + reassign" model).
//   • Multi-photo strip: 5 horizontal slots, 88×88 each. Dashed-border
//     empty slots, photo thumbnails with × for filled slots. First photo
//     is the bulletin-card hero.
//   • Delete moved to the top chrome (edit-mode only). Replaces the old
//     "Clear" button. Confirms via Alert before destruction.

import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import { AREAS, AREA_BY_KEY, type AreaKind } from '@/core/constants/areas';
import { photoById } from '@/core/constants/photoLibrary';
import {
  useVisionAreasStore,
  type VisionPhoto,
} from '@/core/stores/useVisionAreasStore';
import { persistPhoto } from '@/core/persistence/persistPhoto';
import { Card } from '@/ui/components/Card';
import { PrimaryCta } from '@/ui/components/PrimaryCta';
import { colors, radii, spacing, typography } from '@/ui/tokens';

const NAME_MIN = 2;
const NAME_MAX = 60;
const IDENTITY_MAX = 200;
const CUSTOM_LABEL_MAX = 24;
const MAX_PHOTOS = 5;

const CATEGORY_ORDER: AreaKind[] = [
  'career',
  'health',
  'love',
  'finance',
  'joy',
  'custom',
];

export default function VisionAreaSheet() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    mode?: string;
    category?: string;
    area?: string; // legacy
  }>();

  const addVision = useVisionAreasStore((s) => s.addVision);
  const updateVision = useVisionAreasStore((s) => s.updateVision);
  const deleteVision = useVisionAreasStore((s) => s.deleteVision);
  const visionById = useVisionAreasStore((s) => s.visionById);
  const firstVisionForCategory = useVisionAreasStore(
    (s) => s.firstVisionForCategory,
  );
  const customAreaLabel = useVisionAreasStore((s) => s.customAreaLabel);

  // Resolve which vision (if any) we're editing.
  // - `id` → load that exact vision (edit mode)
  // - `area` (legacy) → first active vision in that category (edit if exists, create-with-preset if not)
  // - otherwise → create mode
  const existingFromId = params.id ? visionById(params.id) : undefined;
  const existingFromArea =
    !existingFromId && params.area
      ? firstVisionForCategory(params.area as AreaKind)
      : undefined;
  const existing = existingFromId ?? existingFromArea;
  const isEditing = !!existing;

  const presetCategory = (params.category ?? params.area) as
    | AreaKind
    | undefined;

  const [category, setCategory] = useState<AreaKind>(
    existing?.category ?? presetCategory ?? 'career',
  );
  const [customLabel, setCustomLabel] = useState(
    existing?.customLabel ?? customAreaLabel ?? '',
  );
  const [name, setName] = useState(existing?.name ?? '');
  const [identity, setIdentity] = useState(existing?.identity ?? '');
  const [photos, setPhotos] = useState<VisionPhoto[]>(
    existing?.photos ?? [],
  );

  const isCustom = category === 'custom';
  const def =
    !isCustom && category in AREA_BY_KEY
      ? AREA_BY_KEY[category as Exclude<AreaKind, 'custom'>]
      : null;

  const trimmedName = name.trim();
  const trimmedCustom = customLabel.trim();
  const isReady =
    trimmedName.length >= NAME_MIN &&
    (!isCustom || trimmedCustom.length >= CUSTOM_LABEL_MIN_LENGTH());

  // Pick photos — multi-select up to remaining slots.
  const handlePickPhotos = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Photos access needed',
        'Allow access to add photos to this vision.',
      );
      return;
    }
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      // Round 22: ask the picker for base64 directly. We embed the
      // image data as a `data:image/jpeg;base64,...` URI inside the
      // vision record, which makes the photo immune to ALL the
      // file-URI failure modes that bit us before (cache eviction,
      // ph:// URIs that <Image> can't render, copy permission errors,
      // Expo Go container UUID changes, etc).
      // R68: quality 0.4 → 0.25 + exif:false to reduce the base64
      // payload (~50% smaller). Was causing a perceptible UI lag in
      // the onboarding vision-area sheet when picking multiple photos:
      // each ~100KB base64 string forces a synchronous Image decode
      // when the new gallery item renders. Smaller payloads → faster
      // decode → snappier add. Visual quality at 0.25 is still fine
      // for the 80×80pt thumbnails and 200pt vision tile.
      mediaTypes: ['images'],
      quality: 0.25,
      base64: true,
      exif: false,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
    });
    if (!result.canceled) {
      const picked: VisionPhoto[] = result.assets
        .slice(0, remaining)
        .map((a) => {
          const mimeType = a.mimeType ?? 'image/jpeg';
          // Prefer base64 data URI. Fall back to the file URI if the
          // picker didn't return base64 for some reason — better than
          // nothing, and persistPhoto on save will still try to copy
          // the file into docs for that path.
          const uri = a.base64
            ? `data:${mimeType};base64,${a.base64}`
            : a.uri;
          return { uri };
        });
      setPhotos([...photos, ...picked]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert('Remove this photo?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setPhotos(photos.filter((_, i) => i !== index)),
      },
    ]);
  };

  const handleSave = async () => {
    if (!isReady) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

    // Round 19 (item 1b fix): copy any picker-returned photo URIs into
    // the app's documents directory before saving. The picker's cache
    // URI gets invalidated on Expo Go reload, so without this step the
    // tile renders blank the next time the user opens the app. Photos
    // already in the persistent location pass through unchanged.
    const persistedPhotos: VisionPhoto[] = await Promise.all(
      photos.map(async (p) => {
        if (!p.uri) return p;
        const persisted = await persistPhoto(p.uri);
        return { ...p, uri: persisted };
      }),
    );

    const payload = {
      category,
      name: trimmedName,
      identity: identity.trim(),
      photos: persistedPhotos,
      customLabel: isCustom ? trimmedCustom : undefined,
    };
    if (isEditing && existing) {
      updateVision(existing.id, payload);
    } else {
      addVision(payload);
    }
    // Round 15 fix: always router.back() so the sheet plays nicely with
    // every caller — Vision tab AND the onboarding build-board flow.
    // Previously the create-mode replaced with /vision-detail which
    // yanked onboarding users out of their flow.
    router.back();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert(
      'Delete this vision?',
      `"${existing.name || def?.label || 'This vision'}" will be removed. Your wins linked to it stay safe.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteVision(existing.id);
            router.back();
          },
        },
      ],
    );
  };

  const eyebrow = isEditing ? 'Editing' : 'New vision';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient
        colors={[colors.amberPale + 'AA', colors.amberPale + '30', colors.bg]}
        locations={[0, 0.4, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Drag handle */}
        <View
          style={{
            alignItems: 'center',
            paddingTop: spacing.s,
            paddingBottom: spacing.xs,
          }}
        >
          <View
            style={{
              width: 44,
              height: 5,
              borderRadius: 3,
              backgroundColor: colors.mutedSoft,
              opacity: 0.7,
            }}
          />
        </View>

        {/* Top chrome — × + (edit-mode) Delete */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.l + 2,
            paddingTop: spacing.s,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => ({
              width: 36,
              height: 36,
              borderRadius: 999,
              backgroundColor: pressed ? colors.bgSoft : colors.surface,
              borderWidth: 1,
              borderColor: colors.hairline,
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <Feather name="x" size={16} color={colors.ink} />
          </Pressable>
          {isEditing && (
            <Pressable
              onPress={handleDelete}
              hitSlop={12}
              style={({ pressed }) => ({
                paddingHorizontal: spacing.m + 2,
                height: 36,
                borderRadius: 999,
                backgroundColor: pressed ? colors.bgSoft : colors.surface,
                borderWidth: 1,
                borderColor: colors.hairline,
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Text
                style={{
                  color: colors.terraDeep,
                  fontSize: 12,
                  fontWeight: '600',
                  letterSpacing: 0.3,
                }}
              >
                Delete
              </Text>
            </Pressable>
          )}
        </View>

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.l,
            paddingBottom: spacing.xxxl,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          bottomOffset={280}
          extraKeyboardSpace={140}
        >
          {/* Eyebrow + headline */}
          <Text
            style={[
              typography.eyebrow,
              {
                color: colors.amberDeep,
                letterSpacing: 2.2,
                marginBottom: spacing.s,
              },
            ]}
          >
            {eyebrow}
          </Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: '500',
              color: colors.ink,
              letterSpacing: -0.6,
              lineHeight: 30,
              marginBottom: spacing.l,
            }}
          >
            {isEditing ? 'Edit your vision.' : 'Bring it to life.'}
          </Text>

          {/* Category picker */}
          <Text
            style={[
              typography.eyebrow,
              {
                color: colors.muted,
                letterSpacing: 1.6,
                marginBottom: spacing.s,
                fontSize: 9.5,
              },
            ]}
          >
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 8,
              paddingRight: 22,
              marginBottom: spacing.m + 2,
            }}
            style={{ marginBottom: spacing.m + 2, marginLeft: -2 }}
          >
            {CATEGORY_ORDER.map((kind) => {
              const kdef =
                kind !== 'custom'
                  ? AREA_BY_KEY[kind as Exclude<AreaKind, 'custom'>]
                  : null;
              const label =
                kdef?.label ??
                (kind === 'custom' ? trimmedCustom || 'Custom' : 'Custom');
              const active = category === kind;
              return (
                <CategoryChip
                  key={kind}
                  label={label}
                  active={active}
                  onPress={() => setCategory(kind)}
                />
              );
            })}
          </ScrollView>

          {/* Custom-area label (only when category === 'custom') */}
          {isCustom && (
            <Card
              variant="paper"
              padding={spacing.m + 2}
              style={{ marginBottom: spacing.m }}
            >
              <Text
                style={[
                  typography.eyebrow,
                  {
                    color: colors.muted,
                    letterSpacing: 1.6,
                    marginBottom: spacing.xs + 2,
                    fontSize: 9.5,
                  },
                ]}
              >
                Name this area
              </Text>
              <TextInput
                value={customLabel}
                onChangeText={setCustomLabel}
                placeholder="Creativity, Family, Place…"
                placeholderTextColor={colors.mutedSoft}
                maxLength={CUSTOM_LABEL_MAX}
                style={{
                  fontSize: 17,
                  color: colors.ink,
                  letterSpacing: -0.2,
                  padding: 0,
                  fontWeight: '600',
                }}
              />
            </Card>
          )}

          {/* Photo strip — up to 5 photos */}
          <Text
            style={[
              typography.eyebrow,
              {
                color: colors.muted,
                letterSpacing: 1.6,
                marginBottom: spacing.s,
                fontSize: 9.5,
              },
            ]}
          >
            Photos ({photos.length}/{MAX_PHOTOS})
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 10,
              paddingRight: 22,
            }}
            style={{ marginBottom: spacing.l }}
          >
            {photos.map((p, i) => (
              <PhotoSlot
                key={`${i}-${p.uri ?? p.libraryId ?? ''}`}
                photo={p}
                onRemove={() => handleRemovePhoto(i)}
              />
            ))}
            {photos.length < MAX_PHOTOS && (
              <EmptyPhotoSlot onPress={handlePickPhotos} />
            )}
          </ScrollView>

          {/* Name input — required */}
          <Card
            variant="paper"
            padding={spacing.m + 2}
            style={{ marginBottom: spacing.s + 2 }}
          >
            <Text
              style={[
                typography.eyebrow,
                {
                  color: colors.muted,
                  letterSpacing: 1.6,
                  marginBottom: spacing.xs + 2,
                  fontSize: 9.5,
                },
              ]}
            >
              Name it
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="The Studio of My Own"
              placeholderTextColor={colors.mutedSoft}
              maxLength={NAME_MAX}
              style={{
                fontSize: 17,
                color: colors.ink,
                fontStyle: name ? 'italic' : 'normal',
                letterSpacing: -0.2,
                padding: 0,
              }}
            />
          </Card>

          {/* Identity input — optional */}
          <Card
            variant="surface"
            padding={spacing.m + 2}
            style={{ marginBottom: spacing.xs }}
          >
            <Text
              style={[
                typography.eyebrow,
                {
                  color: colors.muted,
                  letterSpacing: 1.6,
                  marginBottom: spacing.xs + 2,
                  fontSize: 9.5,
                },
              ]}
            >
              Who you want to become
            </Text>
            <TextInput
              value={identity}
              onChangeText={setIdentity}
              placeholder="I am…"
              placeholderTextColor={colors.mutedSoft}
              maxLength={IDENTITY_MAX}
              multiline
              textAlignVertical="top"
              scrollEnabled={false}
              style={{
                fontSize: 15,
                color: colors.ink,
                fontStyle: identity ? 'italic' : 'normal',
                lineHeight: 22,
                letterSpacing: -0.1,
                padding: 0,
                minHeight: 50,
              }}
            />
          </Card>
          <Text
            style={{
              fontSize: 11,
              color: colors.muted,
              fontStyle: 'italic',
              marginLeft: spacing.xs,
              marginBottom: spacing.xl,
            }}
          >
            Optional. Helps shape tomorrow's "I am…" on Today.
          </Text>
        </KeyboardAwareScrollView>

        <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
          <PrimaryCta
            label={isEditing ? 'Save changes' : 'Add to board'}
            onPress={handleSave}
            disabled={!isReady}
          />
        </KeyboardStickyView>
      </SafeAreaView>
    </View>
  );
}

// ─── Category chip ──────────────────────────────────────
function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: active ? colors.terra : colors.surface,
        borderWidth: 1,
        borderColor: active ? colors.terraDeep : colors.hairline,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          letterSpacing: 0.2,
          color: active ? colors.cream : colors.ink,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Photo slot — filled ─────────────────────────────────
function PhotoSlot({
  photo,
  onRemove,
}: {
  photo: VisionPhoto;
  onRemove: () => void;
}) {
  const source = photo.uri
    ? { uri: photo.uri }
    : photo.libraryId
      ? photoById(photo.libraryId)?.source
      : undefined;
  return (
    <View
      style={{
        width: 88,
        height: 88,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: colors.paper,
      }}
    >
      {source && (
        <Image
          source={source}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      )}
      <Pressable
        onPress={onRemove}
        hitSlop={6}
        style={({ pressed }) => ({
          position: 'absolute',
          top: 4,
          right: 4,
          width: 22,
          height: 22,
          borderRadius: 999,
          backgroundColor: pressed
            ? 'rgba(0,0,0,0.92)'
            : 'rgba(0,0,0,0.7)',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Feather name="x" size={12} color="#fff" />
      </Pressable>
    </View>
  );
}

// ─── Photo slot — empty ──────────────────────────────────
function EmptyPhotoSlot({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 88,
        height: 88,
        borderRadius: 14,
        backgroundColor: pressed ? colors.bgSoft : colors.paper,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: colors.amber + '70',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      })}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          backgroundColor: colors.amber + '22',
          borderWidth: 1,
          borderColor: colors.amber + '55',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name="plus" size={14} color={colors.amber} />
      </View>
    </Pressable>
  );
}

function CUSTOM_LABEL_MIN_LENGTH(): number {
  return 2;
}
