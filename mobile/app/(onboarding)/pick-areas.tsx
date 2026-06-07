// O05 — Pick areas
// v3 (feedback round 2) — adds the "+ Add your own" row so users can
// name a custom area (e.g. "Creativity", "Family", "Place").
//
// Was: multi-select 3–5 from the canonical Career/Health/Love/Finance/Joy.
// v3: same list + a sage-tinted "+ Add your own" row that opens an inline
// TextInput. Custom label persists via useVisionAreasStore.setCustomArea.

import { useState } from 'react';
import { View, Text, Pressable, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { SetupScreen } from '@/ui/components/SetupScreen';
import { AREAS, type AreaKind } from '@/core/constants/areas';
import {
  useVisionAreasStore,
  MIN_AREAS,
  MAX_AREAS,
} from '@/core/stores/useVisionAreasStore';
import { colors, radii, spacing } from '@/ui/tokens';

const CUSTOM_LABEL_MAX = 24;

export default function PickAreas() {
  const router = useRouter();
  const activeAreas = useVisionAreasStore((s) => s.activeAreas);
  const toggleArea = useVisionAreasStore((s) => s.toggleArea);
  const customAreaLabel = useVisionAreasStore((s) => s.customAreaLabel);
  const setCustomArea = useVisionAreasStore((s) => s.setCustomArea);

  // Local draft so the input is snappy; commit on blur.
  const [customDraft, setCustomDraft] = useState(customAreaLabel ?? '');
  const [editingCustom, setEditingCustom] = useState(false);

  const hasCustom = activeAreas.includes('custom');
  const count = activeAreas.length;
  const isReady = count >= MIN_AREAS && count <= MAX_AREAS;
  const canAddMore = count < MAX_AREAS;

  const commitCustom = () => {
    setCustomArea(customDraft);
    setEditingCustom(false);
  };

  return (
    <SetupScreen
      step={3}
      eyebrow={`Vision setup · 1 of 2 · ${count} picked`}
      title={'Pick what matters\nmost to you.'}
      body={`Pick as many or as few as you want, up to ${MAX_AREAS}. You can add your own.`}
      ctaLabel="Continue"
      ctaDisabled={!isReady}
      onContinue={() => router.push('/(onboarding)/build-board')}
    >
      <View style={{ gap: spacing.s }}>
        {AREAS.map((a) => {
          const selected = activeAreas.includes(a.key);
          const atMaxAndNotSelected = !selected && !canAddMore;
          return (
            <Pressable
              key={a.key}
              onPress={() => toggleArea(a.key)}
              disabled={atMaxAndNotSelected}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.m + 2,
                padding: spacing.m,
                borderRadius: radii.l,
                backgroundColor: selected
                  ? colors.amber + '1F'
                  : 'rgba(250,246,239,0.05)',
                borderWidth: 1,
                borderColor: selected
                  ? colors.amber + '88'
                  : 'rgba(250,246,239,0.10)',
                opacity: atMaxAndNotSelected ? 0.4 : pressed ? 0.85 : 1,
              })}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  overflow: 'hidden',
                  shadowColor: selected ? colors.amber : 'transparent',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.7,
                  shadowRadius: 14,
                }}
              >
                <Image
                  source={a.thumb}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.cream }}>
                  {a.label}
                </Text>
                <Text
                  style={{
                    fontSize: 11.5,
                    color: 'rgba(250,246,239,0.55)',
                    fontStyle: 'italic',
                    marginTop: 2,
                  }}
                >
                  {a.sub}
                </Text>
              </View>
              {selected && (
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    backgroundColor: colors.amber,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="check" size={12} color="#1F1308" />
                </View>
              )}
            </Pressable>
          );
        })}

        {/* + Add your own — sage-tinted to distinguish from amber canonical rows */}
        <Pressable
          onPress={() => {
            if (!hasCustom && !canAddMore) return;
            setEditingCustom(true);
          }}
          disabled={!hasCustom && !canAddMore}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.m + 2,
            padding: spacing.m,
            borderRadius: radii.l,
            backgroundColor: hasCustom
              ? colors.sage + '1F'
              : 'rgba(250,246,239,0.03)',
            borderWidth: 1.5,
            borderStyle: hasCustom ? 'solid' : 'dashed',
            borderColor: hasCustom
              ? colors.sage + '88'
              : 'rgba(250,246,239,0.22)',
            opacity: !hasCustom && !canAddMore ? 0.4 : pressed ? 0.85 : 1,
          })}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: colors.sage + '22',
              borderWidth: 1,
              borderColor: colors.sage + '55',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather
              name={hasCustom ? 'edit-3' : 'plus'}
              size={18}
              color={colors.sage}
            />
          </View>
          <View style={{ flex: 1 }}>
            {editingCustom ? (
              <TextInput
                autoFocus
                value={customDraft}
                onChangeText={setCustomDraft}
                onBlur={commitCustom}
                onSubmitEditing={commitCustom}
                placeholder="Creativity, Family, Place…"
                placeholderTextColor="rgba(250,246,239,0.30)"
                maxLength={CUSTOM_LABEL_MAX}
                returnKeyType="done"
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.cream,
                  padding: 0,
                  letterSpacing: -0.1,
                }}
              />
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: colors.cream,
                  }}
                >
                  {hasCustom && customAreaLabel ? customAreaLabel : 'Add your own'}
                </Text>
                <Text
                  style={{
                    fontSize: 11.5,
                    color: 'rgba(250,246,239,0.55)',
                    fontStyle: 'italic',
                    marginTop: 2,
                  }}
                >
                  {hasCustom ? 'tap to rename' : 'name an area that matters to you'}
                </Text>
              </>
            )}
          </View>
          {hasCustom && !editingCustom && (
            <Pressable
              hitSlop={10}
              onPress={() => setCustomArea(null)}
              style={({ pressed }) => ({
                width: 28,
                height: 28,
                borderRadius: 999,
                backgroundColor: pressed
                  ? 'rgba(250,246,239,0.18)'
                  : 'rgba(250,246,239,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Feather name="x" size={13} color="rgba(250,246,239,0.7)" />
            </Pressable>
          )}
        </Pressable>
      </View>
    </SetupScreen>
  );
}
