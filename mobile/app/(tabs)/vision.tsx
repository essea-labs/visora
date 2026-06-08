// Vision tab — round 7 masonry collage.
//
// What changed from round 6:
//   • Rotated polaroid cards + brass pins are gone. Cards are now
//     straight, packed into a 2-column masonry grid.
//   • Each vision is a single "cluster" — a mini-collage of its photos
//     (up to 5). Sub-layouts adapt to count:
//       1 photo   → solo (single tile)
//       2 photos  → pair (vertical stack)
//       3 photos  → trio (hero on top + 2 squares below)
//       4 photos  → quad (hero + 3 squares below)
//       5 photos  → full (hero + 4 squares below)
//   • Label band sits BELOW the photos (no longer overlays them) so the
//     imagery stays clean.
//   • Photo-count badge (◫ N) in the top-right of clusters with >1 photo.
//   • Chrome row spacing fixed so `+` and archive chip don't collide
//     with "Who you want to become.".
//   • "Proof" → "win" everywhere.
//
// Tap behaviour unchanged: cluster → /vision-detail?id=, + → create-mode
// area sheet, archive chip → /vision-archive.

import { useEffect, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { Fab } from '@/ui/components/Fab';
import { useRouter } from 'expo-router';

import { AREA_BY_KEY, type AreaKind } from '@/core/constants/areas';
import { photoById } from '@/core/constants/photoLibrary';
import {
  useVisionAreasStore,
  type AreaVision,
  type VisionPhoto,
} from '@/core/stores/useVisionAreasStore';
import { useWinsStore } from '@/core/stores/useWinsStore';
import { colors } from '@/ui/tokens';

const BOARD_PADDING_X = 14;
const COLUMN_GAP = 6;
const ROW_GAP = 6;

export default function Vision() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  const activeVisions = useVisionAreasStore((s) => s.activeVisions);
  const archivedVisions = useVisionAreasStore((s) => s.archivedVisions);
  // Subscribe to the raw wins array so per-vision counts re-render when
  // a new win is captured (the `winsForVision` selector itself is a
  // stable function reference and doesn't track wins data).
  const allWins = useWinsStore((s) => s.wins);

  const visions = activeVisions();
  const archivedCount = archivedVisions().length;
  const hasVisions = visions.length > 0;

  const winCountForVision = (id: string) =>
    allWins.reduce(
      (n, w) => (!w.deletedAt && w.visionId === id ? n + 1 : n),
      0,
    );

  // Two-column masonry: each column is the same width.
  const columnWidth =
    (screenWidth - BOARD_PADDING_X * 2 - COLUMN_GAP) / 2;

  // Distribute visions across left/right columns by index. Simple
  // alternation is good enough for ≤8 visions; for larger boards we'd
  // pick whichever column is shorter.
  const { leftCol, rightCol } = useMemo(() => {
    const left: AreaVision[] = [];
    const right: AreaVision[] = [];
    visions.forEach((v, i) => {
      (i % 2 === 0 ? left : right).push(v);
    });
    return { leftCol: left, rightCol: right };
  }, [visions]);

  const openCreate = () => router.push('/vision-area-sheet?mode=create');
  const openDetail = (id: string) =>
    router.push({ pathname: '/vision-detail', params: { id } });
  const openArchive = () => router.push('/vision-archive');

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      {/* Cosmic warm gradient — top terra glow, bottom layered cosmic */}
      <LinearGradient
        colors={[colors.terraDeep + '55', 'transparent']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320 }}
      />
      <LinearGradient
        colors={[
          'transparent',
          colors.cosmicB + '77',
          colors.cosmicC + 'AA',
        ]}
        locations={[0.5, 0.75, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Header — round 8: aligned with Today + Wins so the title sits
            in the same horizontal band across all tabs. Archive chip and
            + button share the row with the title (no separate chrome row
            above). */}
        {/* R66: 'Add a vision' moved out of this title row to a
            floating Fab in the bottom-right (see end of SafeAreaView)
            so it matches the wins-tab Fab in both position and
            dimensions. The title row is now title-only. */}
        <View
          style={{
            paddingTop: 18,
            paddingHorizontal: 24,
            paddingBottom: 18,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: '500',
              color: colors.cream,
              letterSpacing: -0.6,
              lineHeight: 32,
            }}
          >
            Who you want to become.
          </Text>
        </View>

        {/* Round 11 (item 4): archive chip moved out of the header row
            into its own thin band below the title. Reads as a quiet
            contextual subtitle — "here's what's active, with N archived
            if you want to look." Only renders when ≥1 vision is archived. */}
        {archivedCount > 0 && (
          <View style={{ paddingHorizontal: 24, paddingBottom: 14, alignItems: 'flex-start' }}>
            <Pressable
              onPress={openArchive}
              hitSlop={8}
              style={({ pressed }) => ({
                height: 28,
                paddingHorizontal: 12,
                borderRadius: 999,
                backgroundColor: 'rgba(250,246,239,0.05)',
                borderWidth: 1,
                borderColor: 'rgba(250,246,239,0.12)',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                opacity: pressed ? 0.55 : 1,
              })}
            >
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: colors.amber + 'D0',
                }}
              />
              <Text
                style={{
                  fontSize: 10.5,
                  color: 'rgba(250,246,239,0.65)',
                  letterSpacing: 0.4,
                }}
              >
                {archivedCount} in archive →
              </Text>
            </Pressable>
          </View>
        )}

        {hasVisions ? (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: BOARD_PADDING_X,
              paddingBottom: 110,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flexDirection: 'row', gap: COLUMN_GAP }}>
              <View style={{ flex: 1, gap: ROW_GAP }}>
                {leftCol.map((v) => (
                  <VisionCluster
                    key={v.id}
                    vision={v}
                    width={columnWidth}
                    wins={winCountForVision(v.id)}
                    onPress={() => openDetail(v.id)}
                  />
                ))}
              </View>
              <View style={{ flex: 1, gap: ROW_GAP }}>
                {rightCol.map((v) => (
                  <VisionCluster
                    key={v.id}
                    vision={v}
                    width={columnWidth}
                    wins={winCountForVision(v.id)}
                    onPress={() => openDetail(v.id)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <EmptyState onBegin={openCreate} />
        )}

        <Fab onPress={openCreate} label="Add a vision" />
      </SafeAreaView>
    </View>
  );
}

// ─── Vision cluster — one vision, 1-5 photos in a packed sub-layout ──
function VisionCluster({
  vision,
  width,
  wins,
  onPress,
}: {
  vision: AreaVision;
  width: number;
  wins: number;
  onPress: () => void;
}) {
  const def =
    vision.category !== 'custom'
      ? AREA_BY_KEY[vision.category as Exclude<AreaKind, 'custom'>]
      : null;
  const label = def?.label ?? vision.customLabel ?? 'Custom';
  const identity = vision.name?.trim() || vision.identity?.trim() || label;
  const photos = vision.photos ?? [];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'rgba(250,246,239,0.05)',
        opacity: pressed ? 0.92 : 1,
        shadowColor: '#000',
        shadowOpacity: 0.45,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
      })}
    >
      {/* Photos sub-layout — branches on count.
          Width threaded down so each tile renders at exact pixel sizes
          (avoids RN aspectRatio+flex layout collapse on some devices). */}
      <PhotosLayout photos={photos} def={def} columnWidth={width} />

      {/* Photo-count badge (only when >1) */}
      {photos.length > 1 && (
        <View
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 999,
            backgroundColor: 'rgba(20,12,6,0.78)',
            borderWidth: 1,
            borderColor: 'rgba(250,246,239,0.18)',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            zIndex: 3,
          }}
        >
          <Text
            style={{
              fontSize: 9,
              fontWeight: '700',
              color: colors.cream,
              letterSpacing: 0.3,
            }}
          >
            ◫ {photos.length}
          </Text>
        </View>
      )}

      {/* Label band — BELOW the photos, not overlaying. */}
      <View
        style={{
          paddingHorizontal: 11,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: 'rgba(20,12,6,0.55)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(250,246,239,0.08)',
        }}
      >
        <Text
          style={{
            fontSize: 8,
            fontWeight: '700',
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: colors.terraLight,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 12.5,
            fontWeight: '600',
            fontStyle: 'italic',
            color: colors.cream,
            letterSpacing: -0.2,
            lineHeight: 15,
          }}
        >
          {identity}
        </Text>
        <Text
          style={{
            fontSize: 8.5,
            color: 'rgba(250,246,239,0.55)',
            letterSpacing: 0.2,
            marginTop: 2,
          }}
        >
          {wins} {wins === 1 ? 'win' : 'wins'}
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Photo sub-layouts ──────────────────────────────────
// All tiles use explicit pixel width + height computed from columnWidth
// (the cluster's width). This sidesteps aspectRatio+flex layout edge
// cases that were causing tiles to collapse to 0 height on some screens.
const TILE_GAP = 2;

function PhotosLayout({
  photos,
  def,
  columnWidth,
}: {
  photos: VisionPhoto[];
  def: { thumb: any } | null;
  columnWidth: number;
}) {
  if (photos.length === 0) {
    return <FallbackTile def={def} columnWidth={columnWidth} />;
  }
  if (photos.length === 1) return <SoloLayout photos={photos} w={columnWidth} />;
  if (photos.length === 2) return <PairLayout photos={photos} w={columnWidth} />;
  if (photos.length === 3) return <TrioLayout photos={photos} w={columnWidth} />;
  if (photos.length === 4) return <QuadLayout photos={photos} w={columnWidth} />;
  return <FullLayout photos={photos.slice(0, 5)} w={columnWidth} />;
}

function PhotoTile({
  photo,
  width,
  height,
}: {
  photo: VisionPhoto;
  width: number;
  height: number;
}) {
  const source =
    (photo.uri && { uri: photo.uri }) ||
    (photo.libraryId && photoById(photo.libraryId)?.source) ||
    undefined;
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: colors.cosmicB,
        overflow: 'hidden',
      }}
    >
      {source && (
        <Image
          source={source}
          style={{ width, height }}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

function SoloLayout({ photos, w }: { photos: VisionPhoto[]; w: number }) {
  return <PhotoTile photo={photos[0]} width={w} height={Math.round(w / 0.85)} />;
}

function PairLayout({ photos, w }: { photos: VisionPhoto[]; w: number }) {
  return (
    <View>
      <PhotoTile photo={photos[0]} width={w} height={Math.round(w / 1.05)} />
      <View style={{ height: TILE_GAP }} />
      <PhotoTile photo={photos[1]} width={w} height={Math.round(w / 1.4)} />
    </View>
  );
}

function TrioLayout({ photos, w }: { photos: VisionPhoto[]; w: number }) {
  const small = Math.floor((w - TILE_GAP) / 2);
  return (
    <View>
      <PhotoTile photo={photos[0]} width={w} height={Math.round(w / 1.3)} />
      <View style={{ height: TILE_GAP }} />
      <View style={{ flexDirection: 'row' }}>
        <PhotoTile photo={photos[1]} width={small} height={small} />
        <View style={{ width: TILE_GAP }} />
        <PhotoTile photo={photos[2]} width={small} height={small} />
      </View>
    </View>
  );
}

function QuadLayout({ photos, w }: { photos: VisionPhoto[]; w: number }) {
  const small = Math.floor((w - TILE_GAP * 2) / 3);
  return (
    <View>
      <PhotoTile photo={photos[0]} width={w} height={Math.round(w / 1.5)} />
      <View style={{ height: TILE_GAP }} />
      <View style={{ flexDirection: 'row' }}>
        <PhotoTile photo={photos[1]} width={small} height={small} />
        <View style={{ width: TILE_GAP }} />
        <PhotoTile photo={photos[2]} width={small} height={small} />
        <View style={{ width: TILE_GAP }} />
        <PhotoTile photo={photos[3]} width={small} height={small} />
      </View>
    </View>
  );
}

function FullLayout({ photos, w }: { photos: VisionPhoto[]; w: number }) {
  const small = Math.floor((w - TILE_GAP * 3) / 4);
  return (
    <View>
      <PhotoTile photo={photos[0]} width={w} height={Math.round(w / 1.7)} />
      <View style={{ height: TILE_GAP }} />
      <View style={{ flexDirection: 'row' }}>
        <PhotoTile photo={photos[1]} width={small} height={small} />
        <View style={{ width: TILE_GAP }} />
        <PhotoTile photo={photos[2]} width={small} height={small} />
        <View style={{ width: TILE_GAP }} />
        <PhotoTile photo={photos[3]} width={small} height={small} />
        <View style={{ width: TILE_GAP }} />
        <PhotoTile photo={photos[4]} width={small} height={small} />
      </View>
    </View>
  );
}

// ─── Fallback tile — no photos uploaded yet ────────────
function FallbackTile({
  def,
  columnWidth,
}: {
  def: { thumb: any } | null;
  columnWidth: number;
}) {
  const h = Math.round(columnWidth / 0.85);
  return (
    <View
      style={{
        width: columnWidth,
        height: h,
        backgroundColor: colors.cosmicB,
        overflow: 'hidden',
      }}
    >
      {def?.thumb ? (
        <Image
          source={def.thumb}
          style={{ width: columnWidth, height: h, opacity: 0.6 }}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={[colors.cosmicC + 'AA', colors.cosmicB]}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}

// ─── Empty state — zero visions ──
function EmptyState({ onBegin }: { onBegin: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingBottom: 80,
        gap: 22,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          backgroundColor: colors.amber + '26',
          borderWidth: 1.5,
          borderColor: colors.amber + '70',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.amber,
          shadowOpacity: 0.4,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        <Feather name="plus" size={26} color={colors.amber} />
      </View>
      <Text
        style={{
          fontSize: 22,
          fontStyle: 'italic',
          color: colors.cream,
          letterSpacing: -0.3,
          textAlign: 'center',
          maxWidth: 280,
          lineHeight: 28,
        }}
      >
        Pin your first vision.
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: 'rgba(250,246,239,0.55)',
          textAlign: 'center',
          lineHeight: 20,
          maxWidth: 280,
        }}
      >
        A photo. A name. One line for who you want to become.
      </Text>
      <Pressable
        onPress={onBegin}
        style={({ pressed }) => ({
          marginTop: 6,
          paddingHorizontal: 36,
          height: 52,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.9 : 1,
          shadowColor: colors.terra,
          shadowOpacity: 0.55,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 14 },
        })}
      >
        <LinearGradient
          colors={[colors.terra, colors.terraDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 999,
          }}
        />
        <Text
          style={{
            color: colors.cream,
            fontSize: 15,
            fontWeight: '600',
            letterSpacing: 0.2,
          }}
        >
          Begin
        </Text>
      </Pressable>
    </View>
  );
}
