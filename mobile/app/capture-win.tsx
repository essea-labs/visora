// Capture win — slide-up modal entry.
// Now supports two modes:
//   • Create: route /capture-win (no params) — addWin on save.
//   • Edit:   route /capture-win?id=<winId> — prefills + updates the win.
//
// Round 5 — "Option B" compact layout (user-picked):
//   • No eyebrow over the title (was "A new proof" / "Editing a win").
//   • Title shrunk to 22px so it doesn't dominate.
//   • Chips pinned between title and body — always visible.
//   • Body input is the largest single element (min 140px) but everything
//     above the keyboard is visible without scrolling.
//   • Photo button compacted into a small chip-style button so it doesn't
//     compete with the body for vertical real estate.
//   • Save CTA stays sticky above the keyboard, clears the home indicator.

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import { PrimaryCta } from '@/ui/components/PrimaryCta';
import { useWinsStore } from '@/core/stores/useWinsStore';
import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { persistPhoto } from '@/core/persistence/persistPhoto';
import { AREA_BY_KEY, type AreaKind } from '@/core/constants/areas';
import { colors, radii, spacing } from '@/ui/tokens';

const MAX_BODY = 500;
const MIN_BODY = 4;

// Shared eyebrow style for the chip rows (used by both "Category" and
// "Vision under <category>" labels so they read as one connected picker).
const chipEyebrowStyle = {
  fontSize: 9.5,
  fontWeight: '700' as const,
  letterSpacing: 1.6,
  textTransform: 'uppercase' as const,
  color: '#9A8D7E',
  marginBottom: 8,
};

export default function CaptureWin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // `id` → edit mode for an existing win.
  // `visionId` → create mode with that specific vision pre-selected.
  //   Passed from Vision Detail's "Capture a win →" link.
  // `category` → legacy pre-select by category (kept for backwards compat
  //   with older deep-links).
  const {
    id,
    visionId: presetVisionId,
    category: presetCategory,
  } = useLocalSearchParams<{
    id?: string;
    visionId?: string;
    category?: string;
  }>();
  const addWin = useWinsStore((s) => s.addWin);
  const updateWin = useWinsStore((s) => s.updateWin);
  const deleteWin = useWinsStore((s) => s.deleteWin);
  const winById = useWinsStore((s) => s.winById);

  const activeVisions = useVisionAreasStore((s) => s.activeVisions);
  const visionById = useVisionAreasStore((s) => s.visionById);
  const customAreaLabel = useVisionAreasStore((s) => s.customAreaLabel);

  const visions = activeVisions();

  const existing = id ? winById(id) : undefined;
  const isEditing = !!existing;

  const [body, setBody] = useState(existing?.body ?? '');
  const [photoUri, setPhotoUri] = useState<string | undefined>(existing?.photoUri);
  // Round 11: track the specific vision id as the primary attribution.
  // `areaKind` is derived from the selected vision's category when one is
  // picked; it stays editable on its own when no vision is selected.
  const [visionId, setVisionId] = useState<string | null>(
    existing?.visionId ?? presetVisionId ?? null,
  );
  const [areaKind, setAreaKind] = useState<AreaKind | null>(() => {
    if (existing?.areaKind !== undefined) return existing.areaKind;
    if (presetVisionId) {
      const v = visionById(presetVisionId);
      if (v) return v.category;
    }
    return (presetCategory as AreaKind | undefined) ?? null;
  });

  // If `id` changes (rare in practice), re-prefill
  useEffect(() => {
    if (existing) {
      setBody(existing.body);
      setPhotoUri(existing.photoUri);
      setAreaKind(existing.areaKind ?? null);
      setVisionId(existing.visionId ?? null);
    }
  }, [existing?.id]);

  const trimmed = body.trim();
  const isReady = trimmed.length >= MIN_BODY && trimmed.length <= MAX_BODY;

  const handleSave = async () => {
    if (!isReady) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    // Round 19 (item 1b fix): persist the picker URI into docs dir so
    // the photo survives Expo Go reloads (the picker URI is a cache path
    // that gets invalidated). No-op when photoUri is undefined or
    // already persistent.
    const persistedUri = photoUri ? await persistPhoto(photoUri) : photoUri;
    const payload = { body: trimmed, photoUri: persistedUri, areaKind, visionId };
    if (isEditing && existing) {
      updateWin(existing.id, payload);
    } else {
      addWin(payload);
    }
    router.back();
  };

  // Round 11 Option B (two-row picker):
  //  • selectCategory — top row. Sets the category and clears any specific
  //    vision selection so the user can pick fresh from that category.
  //  • selectVision — bottom row (shown only when a non-None category is
  //    selected). Sets a specific vision under the current category.
  const selectCategory = (kind: AreaKind | null) => {
    setAreaKind(kind);
    setVisionId(null);
  };
  const selectVision = (id: string | null) => {
    setVisionId(id);
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('Delete this win?', 'It will be removed from your archive.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteWin(existing.id);
          router.back();
        },
      },
    ]);
  };

  const handlePickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Photos access needed',
        'Allow access to attach a photo to this win.',
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      // Round 22: ask for base64 directly. See vision-area-sheet for
      // the full reasoning — short version, file URIs were too fragile
      // (cache eviction, ph:// URIs, container UUID changes). Embedding
      // the image data as `data:image/jpeg;base64,...` removes every
      // one of those failure modes at the cost of slightly larger
      // AsyncStorage size, which we keep manageable with quality: 0.4.
      mediaTypes: ['images'],
      quality: 0.4,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled && result.assets[0]) {
      const a = result.assets[0];
      const mimeType = a.mimeType ?? 'image/jpeg';
      const uri = a.base64
        ? `data:${mimeType};base64,${a.base64}`
        : a.uri;
      setPhotoUri(uri);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Round 11 fix: switched from KeyboardAvoidingView (which
            squeezes the layout) to a scroll-based approach so the user
            can always scroll between the body and the photo without
            content being clipped. Body input keeps a sensible min-height
            (no more flex:1 fighting for space); photo sits below it. The
            Save CTA stays sticky above the keyboard via KeyboardStickyView. */}
        {/* Header — round 5: tighter padding so the title sits closer to
            the chrome bar, freeing height for the body input. */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 12,
          }}
        >
          <Pressable
            hitSlop={14}
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 999,
              backgroundColor: pressed ? colors.bgSoft : colors.surface,
              borderWidth: 1,
              borderColor: colors.hairline,
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <Feather name="x" size={18} color={colors.ink} />
          </Pressable>

          {isEditing && (
            <Pressable
              hitSlop={14}
              onPress={handleDelete}
              style={({ pressed }) => ({
                paddingHorizontal: 14,
                height: 40,
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

        {/* Title — round 5: eyebrow removed and title shrunk to 22px so
            everything fits above the keyboard without scrolling. */}
        <View style={{ paddingHorizontal: 22, marginBottom: 14 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '500',
              color: colors.ink,
              letterSpacing: -0.5,
              lineHeight: 26,
            }}
          >
            {isEditing ? 'Edit your win.' : 'Capture a win.'}
          </Text>
        </View>

        {/* Round 11 Option B: two-row picker. Category first, then the
            specific vision under that category. Bottom row only renders
            when the user has picked a non-None category AND has visions
            in it. */}
        <View style={{ paddingHorizontal: 22, marginBottom: 6 }}>
          <Text
            style={[chipEyebrowStyle]}
          >
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 7, paddingRight: 22 }}
          >
            <VisionChip
              label="None"
              active={areaKind === null}
              onPress={() => selectCategory(null)}
            />
            {(['career', 'health', 'love', 'finance', 'joy', 'custom'] as const).map((key) => {
              const def =
                key !== 'custom'
                  ? AREA_BY_KEY[key as Exclude<AreaKind, 'custom'>]
                  : null;
              const label = def?.label ?? customAreaLabel ?? 'Custom';
              return (
                <VisionChip
                  key={key}
                  label={label}
                  categoryKey={key}
                  active={areaKind === key}
                  onPress={() => selectCategory(key)}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Bottom row — only when a category is selected. Shows visions
            in that category, or a quiet hint when there are none. */}
        {areaKind !== null && (
          <View style={{ paddingHorizontal: 22, marginBottom: 12, marginTop: 8 }}>
            <Text style={[chipEyebrowStyle]}>
              Vision under {(() => {
                const def =
                  areaKind !== 'custom'
                    ? AREA_BY_KEY[areaKind as Exclude<AreaKind, 'custom'>]
                    : null;
                return def?.label ?? customAreaLabel ?? 'Custom';
              })()}
            </Text>
            {(() => {
              const filtered = visions.filter((v) => v.category === areaKind);
              if (filtered.length === 0) {
                return (
                  <Text
                    style={{
                      fontSize: 12,
                      fontStyle: 'italic',
                      color: colors.mutedSoft,
                      paddingVertical: 4,
                    }}
                  >
                    No visions in this category yet. Create one from the
                    Vision tab.
                  </Text>
                );
              }
              return (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 7, paddingRight: 22 }}
                >
                  <VisionChip
                    label="None"
                    active={visionId === null}
                    onPress={() => selectVision(null)}
                  />
                  {filtered.map((v) => {
                    const def =
                      v.category !== 'custom'
                        ? AREA_BY_KEY[v.category as Exclude<AreaKind, 'custom'>]
                        : null;
                    const categoryLabel =
                      def?.label ?? v.customLabel ?? customAreaLabel ?? 'Custom';
                    const visionName = v.name?.trim() || categoryLabel;
                    return (
                      <VisionChip
                        key={v.id}
                        label={visionName}
                        active={visionId === v.id}
                        onPress={() => selectVision(v.id)}
                      />
                    );
                  })}
                </ScrollView>
              );
            })()}
          </View>
        )}

        {/* Round 19 (item 3): tap-outside-input now dismisses the keyboard
            so the sheet always returns to its expanded state once the user
            finishes typing — no more awkward layout shift hanging around.
            bottomOffset + extraKeyboardSpace lowered so the scroll only
            nudges the focused input into view instead of yanking the
            whole form up. KeyboardToolbar (below) adds an explicit Done
            button above the keyboard for users who want to dismiss it
            without tapping outside. */}
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          bottomOffset={40}
          extraKeyboardSpace={0}
        >
          {/* Body input — text-first.
              Round 20: shrunk minHeight from 160→96 (outer) and 120→64
              (inner TextInput). Goal: when the keyboard is up, the
              "Add a photo" affordance below stays visible without
              scrolling. The input still grows naturally as the user
              types (multiline + scrollEnabled=false), so longer wins
              get the room they need. */}
          <View
            style={{
              padding: 14,
              borderRadius: radii.l,
              backgroundColor: colors.paper,
              borderWidth: 1,
              borderColor: colors.amber + '44',
              minHeight: 96,
            }}
          >
            <TextInput
              // Round 11 fix-5: autoFocus removed so the keyboard
              // doesn't pop up the moment the sheet opens. Users tap
              // the body box when they're ready to type, which means
              // the whole form (chips, body, photo, Save CTA) is
              // visible on open without any scrolling.
              value={body}
              onChangeText={setBody}
              placeholder="What happened? Just one thing — small counts."
              placeholderTextColor={colors.mutedSoft}
              maxLength={MAX_BODY}
              multiline
              textAlignVertical="top"
              scrollEnabled={false}
              style={{
                fontSize: 16,
                color: colors.ink,
                lineHeight: 22,
                letterSpacing: -0.2,
                padding: 0,
                minHeight: 64,
              }}
            />
            <Text
              style={{
                position: 'absolute',
                bottom: 6,
                right: 10,
                fontSize: 10,
                color: colors.mutedSoft,
              }}
            >
              {trimmed.length} / {MAX_BODY}
            </Text>
          </View>

          {/* Photo block — below body, user scrolls to see it. */}
          {photoUri ? (
            <View
              style={{
                marginTop: 14,
                borderRadius: radii.m,
                overflow: 'hidden',
                backgroundColor: colors.bgSoft,
                borderWidth: 1,
                borderColor: colors.hairline,
                height: 180,
                position: 'relative',
              }}
            >
              <Image
                source={{ uri: photoUri }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
              <Pressable
                hitSlop={10}
                onPress={() => setPhotoUri(undefined)}
                style={({ pressed }) => ({
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  backgroundColor: pressed
                    ? 'rgba(0,0,0,0.85)'
                    : 'rgba(0,0,0,0.65)',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                <Feather name="x" size={13} color="#fff" />
              </Pressable>
              <Pressable
                onPress={handlePickPhoto}
                hitSlop={6}
                style={({ pressed }) => ({
                  position: 'absolute',
                  bottom: 6,
                  right: 6,
                  paddingHorizontal: 10,
                  height: 24,
                  borderRadius: 999,
                  backgroundColor: pressed
                    ? 'rgba(255,255,255,0.85)'
                    : 'rgba(255,255,255,0.92)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                })}
              >
                <Feather name="refresh-cw" size={10} color={colors.ink} />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: colors.ink,
                    letterSpacing: 0.3,
                  }}
                >
                  Replace
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handlePickPhoto}
              style={({ pressed }) => ({
                marginTop: 14,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: radii.m,
                backgroundColor: pressed ? colors.bgSoft : colors.surface,
                borderWidth: 1,
                borderColor: colors.hairline,
                borderStyle: 'dashed',
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: 8,
              })}
            >
              <Feather name="camera" size={14} color={colors.inkSoft} />
              <Text style={{ fontSize: 12.5, color: colors.inkSoft }}>
                Add a photo
              </Text>
            </Pressable>
          )}
        </KeyboardAwareScrollView>

        {/* Save CTA — sticky above the keyboard. */}
        <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
          <View
            style={{
              paddingBottom: insets.bottom,
              paddingTop: 4,
              backgroundColor: colors.bg,
            }}
          >
            <PrimaryCta
              label={isEditing ? 'Save changes' : 'Save'}
              onPress={handleSave}
              disabled={!isReady}
            />
          </View>
        </KeyboardStickyView>
      </SafeAreaView>

      {/* Round 20: the KeyboardToolbar (Done button) was removed — felt
          alien and grey. Users dismiss by tapping Save, dragging the
          content (keyboardDismissMode="on-drag"), or swiping down on
          the sheet. The body input itself is small enough that the
          "Add a photo" affordance below it stays visible with the
          keyboard up, so users don't feel boxed in. */}
    </View>
  );
}

// ─── Category accent color — small dot in vision chips ─
function categoryAccent(kind: AreaKind | undefined): string {
  switch (kind) {
    case 'career':  return colors.terra;
    case 'health':  return colors.sage;
    case 'love':    return colors.terraDeep;
    case 'finance': return colors.amberDeep;
    case 'joy':     return colors.amber;
    case 'custom':  return colors.muted;
    default:        return colors.muted;
  }
}

// ─── Vision chip — pill toggle that shows the vision name + a tiny
// category dot + label. "None" variant has no category info. ─
function VisionChip({
  label,
  categoryLabel,
  categoryKey,
  active,
  onPress,
}: {
  label: string;
  categoryLabel?: string;
  categoryKey?: AreaKind;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        height: 36,
        borderRadius: 999,
        backgroundColor: active ? colors.terra : colors.surface,
        borderWidth: 1,
        borderColor: active ? colors.terraDeep : colors.hairline,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {categoryKey && (
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            backgroundColor: active ? colors.cream : categoryAccent(categoryKey),
          }}
        />
      )}
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          fontStyle: categoryKey ? 'italic' : 'normal',
          letterSpacing: 0.1,
          color: active ? colors.cream : colors.ink,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
      {categoryLabel && (
        <Text
          style={{
            fontSize: 9,
            fontWeight: '700',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: active ? 'rgba(255,255,255,0.75)' : 'rgba(62,47,34,0.55)',
            marginLeft: 2,
          }}
        >
          {categoryLabel}
        </Text>
      )}
    </Pressable>
  );
}
