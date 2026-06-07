// Vision Detail — the hub for everything you can do with a single vision.
//
// Mirrors the canonical design at Manifestation App - Claude Design /
// screen-vision-detail.jsx. It's where the user lands after tapping a
// bulletin card and is the read-first surface that links to Edit
// (mini-sheet), Mark complete (celebration screen), and individual
// win-edit sheets via the linked-wins list.
//
// Layout:
//   • 420px hero photo with cosmic gradient overlay
//   • Top chrome over hero: ← back / Edit pill
//   • Hero text block (bottom of hero): category eyebrow + name + identity
//   • Floating stats card (Total / This week / This month)
//   • "Wins" section header + LinkedWin list
//   • Bottom action row: Mark complete (or Restore for archived) + Delete

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
import * as Haptics from 'expo-haptics';

import { AREA_BY_KEY, type AreaKind } from '@/core/constants/areas';
import { photoById } from '@/core/constants/photoLibrary';
import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { useWinsStore, type Win } from '@/core/stores/useWinsStore';
import { colors } from '@/ui/tokens';

const HERO_HEIGHT = 420;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default function VisionDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const vision = useVisionAreasStore((s) =>
    id ? s.visionById(id) : undefined,
  );
  const restoreVision = useVisionAreasStore((s) => s.restoreVision);
  // Round 11 bug fix: subscribe to the raw `wins` array (a reactive
  // value) and filter inside a useMemo. Previously we subscribed to the
  // `winsForVision` function reference, which is stable — so the
  // component never re-rendered when wins were added. New wins didn't
  // appear until the screen was unmounted + remounted.
  const allWins = useWinsStore((s) => s.wins);

  // Round 11: wins are now scoped to the SPECIFIC vision via visionId,
  // not the category. A vision with category=Career no longer claims
  // every Career-tagged win — only the ones explicitly linked to it.
  const wins = useMemo<Win[]>(
    () =>
      vision
        ? allWins
            .filter((w) => !w.deletedAt && w.visionId === vision.id)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : [],
    [vision, allWins],
  );

  if (!vision) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cosmicA, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.cream, fontSize: 14, opacity: 0.6 }}>
          Vision not found.
        </Text>
      </View>
    );
  }

  const isArchived = !!vision.completedAt;
  const def =
    vision.category !== 'custom'
      ? AREA_BY_KEY[vision.category as Exclude<AreaKind, 'custom'>]
      : null;
  const categoryLabel = def?.label ?? vision.customLabel ?? 'Custom';

  // Round 11 (item 2): all photos surfaced upfront. Hero is photos[0];
  // any additional photos render below in a horizontal scroll strip so
  // the user can see them without swiping the hero.
  const allPhotos: ImageSourcePropType[] = useMemo(() => {
    const resolved = (vision.photos ?? [])
      .map((p): ImageSourcePropType | undefined => {
        if (p.uri) return { uri: p.uri };
        if (p.libraryId) return photoById(p.libraryId)?.source;
        return undefined;
      })
      .filter((s): s is ImageSourcePropType => !!s);
    return resolved.length > 0
      ? resolved
      : def?.thumb
        ? [def.thumb]
        : [];
  }, [vision.photos, def]);
  const heroPhoto = allPhotos[0];
  const secondaryPhotos = allPhotos.slice(1);

  const handleEdit = () => {
    router.push({ pathname: '/vision-area-sheet', params: { id: vision.id } });
  };

  const handleMarkComplete = () => {
    router.push({ pathname: '/vision-celebrate', params: { id: vision.id } });
  };

  const handleRestore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    restoreVision(vision.id);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero photo — round 11: just photos[0]. Additional photos
            surface in a strip below this section. */}
        <View style={{ height: HERO_HEIGHT, width: '100%', overflow: 'hidden' }}>
          {heroPhoto && (
            <Image
              source={heroPhoto}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              resizeMode="cover"
            />
          )}
          <LinearGradient
            colors={[
              'rgba(20,12,6,0.55)',
              'transparent',
              'transparent',
              colors.cosmicA,
            ]}
            locations={[0, 0.25, 0.5, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Hero text block — bottom of hero */}
          <View
            style={{
              position: 'absolute',
              left: 28,
              right: 28,
              bottom: 70,
            }}
          >
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: '700',
                letterSpacing: 2.2,
                textTransform: 'uppercase',
                color: colors.amber,
                marginBottom: 12,
              }}
            >
              ↳ {categoryLabel}
              {isArchived ? ' · Completed' : ''}
            </Text>
            <Text
              style={{
                color: colors.cream,
                fontSize: 30,
                fontWeight: '500',
                letterSpacing: -0.7,
                lineHeight: 33,
                marginBottom: 14,
              }}
            >
              {vision.name || categoryLabel}
            </Text>
            {!!vision.identity && (
              <Text
                style={{
                  fontStyle: 'italic',
                  fontSize: 15,
                  lineHeight: 22,
                  color: 'rgba(250,246,239,0.92)',
                  paddingLeft: 12,
                  borderLeftWidth: 2,
                  borderLeftColor: colors.amber + 'AA',
                }}
              >
                {vision.identity}
              </Text>
            )}
          </View>
        </View>

        {/* Round 11 (item 2): secondary photo strip. Surfaces every
            non-hero photo at a glance so the user can see them all
            without swiping. Horizontal scroll if there are many. */}
        {secondaryPhotos.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 22,
              paddingTop: 16,
              gap: 10,
            }}
            style={{ marginTop: -8 }}
          >
            {secondaryPhotos.map((src, i) => (
              <Image
                key={i}
                source={src}
                style={{
                  width: 112,
                  height: 140,
                  borderRadius: 14,
                  backgroundColor: colors.cosmicB,
                }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Wins list — stats card removed in round 7. The hero photo now
            transitions directly into the wins list below. */}
        <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: colors.cream,
                }}
              >
                Wins
              </Text>
              <Text
                style={{
                  fontSize: 9.5,
                  fontWeight: '700',
                  letterSpacing: 1.6,
                  textTransform: 'uppercase',
                  color: colors.amber,
                }}
              >
                {wins.length} {wins.length === 1 ? 'win' : 'wins'}
              </Text>
            </View>
            {/* Round 11: persistent "+ add win" entry point so users can
                capture another win even after this vision has some. The
                empty-state link still appears separately when wins.length
                is zero. */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/capture-win',
                  params: { visionId: vision.id },
                })
              }
              hitSlop={8}
              style={({ pressed }) => ({
                width: 28,
                height: 28,
                borderRadius: 999,
                backgroundColor: 'rgba(216,154,90,0.18)',
                borderWidth: 1,
                borderColor: colors.amber + '66',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Feather name="plus" size={14} color={colors.amber} />
            </Pressable>
          </View>

          {wins.length === 0 ? (
            <View
              style={{
                paddingVertical: 26,
                paddingHorizontal: 16,
                borderRadius: 14,
                backgroundColor: 'rgba(250,246,239,0.04)',
                borderWidth: 1,
                borderColor: 'rgba(250,246,239,0.08)',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: 'rgba(250,246,239,0.55)',
                  marginBottom: 8,
                  textAlign: 'center',
                }}
              >
                No wins yet.
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/capture-win',
                    params: { visionId: vision.id },
                  })
                }
                hitSlop={8}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    letterSpacing: 1.6,
                    textTransform: 'uppercase',
                    color: colors.amber,
                  }}
                >
                  Capture a win →
                </Text>
              </Pressable>
            </View>
          ) : (
            wins.map((w) => (
              <LinkedWin
                key={w.id}
                win={w}
                onPress={() =>
                  // Round 11: tap a linked win → view-first detail screen,
                  // not straight into edit. Edit is one tap away in the
                  // win-detail top chrome.
                  router.push({ pathname: '/win-detail', params: { id: w.id } })
                }
              />
            ))
          )}

          {/* Round 8: quiet vision-state link sits below the wins list.
              "Seal this vision" for active, "Restore this vision" for
              archived. Replaces the prominent terra-gradient CTA. */}
          <Pressable
            onPress={isArchived ? handleRestore : handleMarkComplete}
            hitSlop={8}
            style={({ pressed }) => ({
              alignSelf: 'center',
              marginTop: 22,
              paddingVertical: 8,
              paddingHorizontal: 14,
              opacity: pressed ? 0.55 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 1.8,
                textTransform: 'uppercase',
                color: 'rgba(232,160,122,0.65)',
              }}
            >
              {isArchived ? 'Restore this vision →' : 'Seal this vision →'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Top chrome — back + Edit pill (absolute over the hero) */}
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
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
              opacity: pressed ? 0.75 : 1,
            })}
          >
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

      {/* Round 8: bottom action row removed. Delete now lives only in
          the Edit sheet (via the Edit pill → Delete header button).
          Mark complete demoted to a quiet text link below the wins
          list (see inside the ScrollView above). */}
    </View>
  );
}

function relativeDate(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffHours = diffMs / (60 * 60 * 1000);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.round(diffHours)}h ago`;
  const diffDays = diffMs / ONE_DAY_MS;
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 7) return `${Math.round(diffDays)} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function LinkedWin({ win, onPress }: { win: Win; onPress: () => void }) {
  const isRecent =
    Date.now() - new Date(win.createdAt).getTime() <= 7 * ONE_DAY_MS;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        borderRadius: 14,
        backgroundColor: isRecent
          ? 'rgba(216,154,90,0.10)'
          : 'rgba(250,246,239,0.04)',
        borderWidth: 1,
        borderColor: isRecent ? colors.amber + '33' : 'rgba(250,246,239,0.08)',
        marginBottom: 8,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          backgroundColor: isRecent ? colors.amber : 'rgba(250,246,239,0.4)',
          shadowColor: isRecent ? colors.amber : 'transparent',
          shadowOpacity: 0.6,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.cream,
            letterSpacing: -0.1,
            lineHeight: 18,
            marginBottom: 3,
          }}
        >
          {win.body}
        </Text>
        <Text
          style={{
            fontSize: 9.5,
            fontWeight: '700',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.5)',
          }}
        >
          {relativeDate(win.createdAt)}
        </Text>
      </View>
      <Feather name="chevron-right" size={14} color="rgba(250,246,239,0.4)" />
    </Pressable>
  );
}
