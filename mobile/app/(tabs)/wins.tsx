// Wins tab — round 4.
//
// Changes since the canonical cosmic-dark port:
//   • Removed the "The archive · N proofs" eyebrow above the title.
//   • Search icon now opens an inline search input that filters wins by
//     body text and area label (live).
//   • Tap any win tile → opens the capture-win sheet in edit mode
//     (?id=<winId>). Save updates instead of adding.
//   • Wins now surface their `areaKind` as a colored chip on every card.
//     Photo cards show "↳ Career" pill top-left; text cards show the chip
//     in the footer next to the time.

import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  type ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { useWinsStore, type Win } from '@/core/stores/useWinsStore';
import {
  AREA_BY_KEY,
  type AreaKind,
  type AreaDef,
} from '@/core/constants/areas';
import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { Fab } from '@/ui/components/Fab';
import { colors, spacing } from '@/ui/tokens';

interface DaySection {
  title: string;
  date: string;
  data: Win[];
}

// ── day grouping ────────────────────────────────────
function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function dayLabel(yyyymmdd: string): { title: string; date: string } {
  const today = dayKey(new Date().toISOString());
  const yest = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return dayKey(d.toISOString());
  })();
  const [y, m, d] = yyyymmdd.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dateStr = dateObj.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  if (yyyymmdd === today) return { title: 'Today', date: dateStr };
  if (yyyymmdd === yest) return { title: 'Yesterday', date: dateStr };
  return {
    title: dateObj.toLocaleDateString(undefined, { weekday: 'long' }),
    date: dateStr,
  };
}
function groupByDay(wins: Win[]): DaySection[] {
  const buckets = new Map<string, Win[]>();
  for (const w of wins) {
    if (w.deletedAt) continue;
    const k = dayKey(w.createdAt);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(w);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([k, items]) => {
      const lbl = dayLabel(k);
      return {
        ...lbl,
        data: items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      };
    });
}

function timeOfDay(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function estimateHeight(w: Win): number {
  if (w.photoUri) {
    return w.body.trim().length > 60 ? 240 : 200;
  }
  const len = w.body.trim().length;
  if (len < 30) return 100;
  if (len < 80) return 140;
  return 180;
}

// Area color (matches the area tag color in the design canvas)
function areaAccent(kind?: AreaKind | null): string {
  if (!kind) return colors.amber;
  if (kind === 'health') return colors.sage;
  if (kind === 'love') return colors.terraLight;
  if (kind === 'finance') return colors.amber;
  if (kind === 'joy') return colors.terraLight;
  if (kind === 'career') return colors.amber;
  return colors.amber;
}

function areaLabel(
  kind: AreaKind | null | undefined,
  customLabel: string | null,
): string | null {
  if (!kind) return null;
  if (kind === 'custom') return customLabel ?? 'Custom';
  const def = AREA_BY_KEY[kind as Exclude<AreaKind, 'custom'>];
  return def?.label ?? null;
}

// ── Main screen ────────────────────────────────────────
export default function Wins() {
  const router = useRouter();
  const wins = useWinsStore((s) => s.wins);
  const customAreaLabel = useVisionAreasStore((s) => s.customAreaLabel);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const live = useMemo(() => wins.filter((w) => !w.deletedAt), [wins]);

  // Apply search filter (body + area label, case-insensitive)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return live;
    return live.filter((w) => {
      const inBody = w.body.toLowerCase().includes(q);
      const lbl = areaLabel(w.areaKind, customAreaLabel)?.toLowerCase() ?? '';
      const inArea = lbl.includes(q);
      return inBody || inArea;
    });
  }, [live, query, customAreaLabel]);

  const totalProofs = live.length;

  const featured = useMemo(() => {
    const sorted = [...filtered].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    return sorted.find((w) => !!w.photoUri) ?? sorted[0];
  }, [filtered]);

  const sections = useMemo(() => {
    const rest = filtered.filter((w) => w.id !== featured?.id);
    return groupByDay(rest);
  }, [filtered, featured]);

  const openCapture = () => router.push('/capture-win');
  // Round 11: tapping a win opens the view-first detail screen.
  // Edit is one tap away in the win-detail chrome.
  const openEdit = (id: string) =>
    router.push({ pathname: '/win-detail', params: { id } });

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      <LinearGradient
        colors={[colors.terraDeep + '66', 'transparent']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 380 }}
      />
      <LinearGradient
        colors={[
          'transparent',
          colors.cosmicB + '55',
          colors.cosmicC + '99',
          colors.cosmicA,
        ]}
        locations={[0.4, 0.7, 0.92, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Header (no eyebrow per round 4) */}
        <View
          style={{
            paddingTop: 18,
            paddingHorizontal: 24,
            paddingBottom: 18,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: '500',
              color: colors.cream,
              letterSpacing: -0.7,
              lineHeight: 34,
            }}
          >
            Your{' '}
            <Text
              style={{
                fontStyle: 'italic',
                fontWeight: '400',
                color: colors.terraLight,
              }}
            >
              becoming.
            </Text>
          </Text>
          <Pressable
            onPress={() => {
              setSearchOpen((v) => !v);
              if (searchOpen) setQuery('');
            }}
            style={({ pressed }) => ({
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: searchOpen
                ? colors.amber + '33'
                : pressed
                  ? 'rgba(250,246,239,0.18)'
                  : 'rgba(250,246,239,0.08)',
              borderWidth: 1,
              borderColor: searchOpen ? colors.amber + '66' : 'rgba(250,246,239,0.16)',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <Feather
              name={searchOpen ? 'x' : 'search'}
              size={15}
              color={searchOpen ? colors.amber : colors.cream}
            />
          </Pressable>
        </View>

        {/* Inline search bar */}
        {searchOpen && (
          <View
            style={{
              paddingHorizontal: 24,
              paddingBottom: 14,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 14,
                backgroundColor: 'rgba(250,246,239,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(250,246,239,0.16)',
              }}
            >
              <Feather name="search" size={14} color={colors.amber} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by word or area…"
                placeholderTextColor="rgba(250,246,239,0.40)"
                autoFocus
                style={{
                  flex: 1,
                  color: colors.cream,
                  fontSize: 14,
                  letterSpacing: -0.1,
                  padding: 0,
                }}
              />
              {query.length > 0 && (
                <Pressable hitSlop={8} onPress={() => setQuery('')}>
                  <Feather name="x-circle" size={14} color="rgba(250,246,239,0.55)" />
                </Pressable>
              )}
            </View>
            {filtered.length === 0 && (
              <Text
                style={{
                  fontSize: 12,
                  color: 'rgba(250,246,239,0.55)',
                  marginTop: 10,
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                No wins match "{query}".
              </Text>
            )}
          </View>
        )}

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingBottom: 130,
          }}
          showsVerticalScrollIndicator={false}
        >
          {!searchOpen && featured && (
            <FeaturedWin
              win={featured}
              totalIndex={totalProofs}
              customAreaLabel={customAreaLabel}
              onPress={() => openEdit(featured.id)}
            />
          )}
          {!searchOpen && !featured && <EmptyState onCapture={openCapture} />}

          {sections.map((section) => (
            <View key={`${section.title}-${section.date}`}>
              <DayDivider
                day={section.title}
                date={section.date}
                count={section.data.length}
              />
              <Masonry
                wins={section.data}
                customAreaLabel={customAreaLabel}
                onTap={openEdit}
              />
            </View>
          ))}
        </ScrollView>

        <Fab onPress={openCapture} icon="anchor" label="Add a win" />
      </SafeAreaView>
    </View>
  );
}

// ── Featured win ───────────────────────────────────────
function FeaturedWin({
  win,
  totalIndex,
  customAreaLabel,
  onPress,
}: {
  win: Win;
  totalIndex: number;
  customAreaLabel: string | null;
  onPress: () => void;
}) {
  const source: ImageSourcePropType | undefined = win.photoUri
    ? { uri: win.photoUri }
    : require('@/assets/images/library/work-coffee.jpg');
  const lbl = areaLabel(win.areaKind, customAreaLabel) ?? 'Win';
  const accent = areaAccent(win.areaKind);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        height: 380,
        borderRadius: 22,
        overflow: 'hidden',
        marginBottom: 28,
        borderWidth: 1,
        borderColor: 'rgba(250,246,239,0.06)',
        opacity: pressed ? 0.94 : 1,
        shadowColor: '#000',
        shadowOpacity: 0.55,
        shadowRadius: 32,
        shadowOffset: { width: 0, height: 22 },
        elevation: 12,
      })}
    >
      <Image
        source={source}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          'rgba(20,12,6,0.4)',
          'transparent',
          'transparent',
          'rgba(20,12,6,0.92)',
        ]}
        locations={[0, 0.3, 0.5, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: 'rgba(20,12,6,0.4)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.18)',
          }}
        >
          <Text
            style={{
              fontSize: 9.5,
              fontWeight: '700',
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            ↳ {lbl}
          </Text>
        </View>
      </View>

      <View style={{ position: 'absolute', left: 24, right: 24, bottom: 24 }}>
        <Text
          style={{
            fontSize: 9.5,
            fontWeight: '700',
            letterSpacing: 2.2,
            textTransform: 'uppercase',
            color: colors.amber,
            marginBottom: 10,
          }}
        >
          Captured moment · Win #{totalIndex}
        </Text>
        <Text
          numberOfLines={3}
          style={{
            fontSize: 24,
            fontWeight: '500',
            color: colors.cream,
            letterSpacing: -0.5,
            lineHeight: 28,
            marginBottom: 12,
          }}
        >
          {win.body}
        </Text>
        <View
          style={{
            paddingLeft: 12,
            borderLeftWidth: 2,
            borderLeftColor: accent + 'AA',
          }}
        >
          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 13,
              lineHeight: 18,
              color: 'rgba(250,246,239,0.85)',
            }}
          >
            Tap to edit.
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ── Day divider ────────────────────────────────────────
function DayDivider({
  day,
  date,
  count,
}: {
  day: string;
  date: string;
  count: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10,
        marginTop: 4,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: colors.cream,
        }}
      >
        {day}
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: 'rgba(250,246,239,0.5)',
        }}
      >
        · {date}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(250,246,239,0.10)' }} />
      <Text
        style={{
          fontSize: 9.5,
          fontWeight: '700',
          letterSpacing: 1.6,
          textTransform: 'uppercase',
          color: colors.amber,
        }}
      >
        {count} {count === 1 ? 'proof' : 'proofs'}
      </Text>
    </View>
  );
}

// ── Masonry ────────────────────────────────────────────
function Masonry({
  wins,
  customAreaLabel,
  onTap,
}: {
  wins: Win[];
  customAreaLabel: string | null;
  onTap: (id: string) => void;
}) {
  const colA: Win[] = [];
  const colB: Win[] = [];
  let hA = 0;
  let hB = 0;
  for (const w of wins) {
    const h = estimateHeight(w);
    if (hA <= hB) {
      colA.push(w);
      hA += h + 10;
    } else {
      colB.push(w);
      hB += h + 10;
    }
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        marginBottom: 28,
        alignItems: 'flex-start',
      }}
    >
      <View style={{ flex: 1, gap: 10 }}>
        {colA.map((w) => (
          <WinTile
            key={w.id}
            win={w}
            height={estimateHeight(w)}
            customAreaLabel={customAreaLabel}
            onPress={() => onTap(w.id)}
          />
        ))}
      </View>
      <View style={{ flex: 1, gap: 10 }}>
        {colB.map((w) => (
          <WinTile
            key={w.id}
            win={w}
            height={estimateHeight(w)}
            customAreaLabel={customAreaLabel}
            onPress={() => onTap(w.id)}
          />
        ))}
      </View>
    </View>
  );
}

function WinTile({
  win,
  height,
  customAreaLabel,
  onPress,
}: {
  win: Win;
  height: number;
  customAreaLabel: string | null;
  onPress: () => void;
}) {
  if (win.photoUri) {
    return (
      <PhotoWinCard
        win={win}
        height={height}
        customAreaLabel={customAreaLabel}
        onPress={onPress}
      />
    );
  }
  return (
    <TextWinCard
      win={win}
      height={height}
      customAreaLabel={customAreaLabel}
      onPress={onPress}
    />
  );
}

function PhotoWinCard({
  win,
  height,
  customAreaLabel,
  onPress,
}: {
  win: Win;
  height: number;
  customAreaLabel: string | null;
  onPress: () => void;
}) {
  const lbl = areaLabel(win.areaKind, customAreaLabel);
  const accent = areaAccent(win.areaKind);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        height,
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(250,246,239,0.06)',
        opacity: pressed ? 0.94 : 1,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 14 },
        elevation: 6,
      })}
    >
      <Image
        source={{ uri: win.photoUri! }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(20,12,6,0.85)']}
        locations={[0.4, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {lbl && (
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: 'rgba(20,12,6,0.45)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.16)',
          }}
        >
          <Text
            style={{
              fontSize: 8.5,
              fontWeight: '700',
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            ↳ {lbl}
          </Text>
        </View>
      )}
      <View style={{ position: 'absolute', left: 14, right: 14, bottom: 12 }}>
        <Text
          numberOfLines={2}
          style={{
            color: colors.cream,
            fontSize: 13.5,
            fontWeight: '500',
            lineHeight: 18,
            letterSpacing: -0.1,
            marginBottom: 4,
          }}
        >
          {win.body}
        </Text>
        <Text
          style={{
            fontSize: 9,
            fontWeight: '700',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.65)',
          }}
        >
          {timeOfDay(win.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

function TextWinCard({
  win,
  height,
  customAreaLabel,
  onPress,
}: {
  win: Win;
  height: number;
  customAreaLabel: string | null;
  onPress: () => void;
}) {
  const lbl = areaLabel(win.areaKind, customAreaLabel);
  const accent = areaAccent(win.areaKind);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        height,
        borderRadius: 18,
        padding: 16,
        paddingBottom: 14,
        backgroundColor: 'rgba(250,246,239,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(250,246,239,0.10)',
        justifyContent: 'space-between',
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <Text
        numberOfLines={5}
        style={{
          fontSize: 14,
          lineHeight: 19,
          fontWeight: '500',
          letterSpacing: -0.1,
          color: colors.cream,
        }}
      >
        {win.body}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 8.5,
            fontWeight: '700',
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: accent,
          }}
        >
          ↳ {lbl ?? 'Win'}
        </Text>
        <Text
          style={{
            fontSize: 9,
            fontWeight: '600',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: 'rgba(250,246,239,0.45)',
          }}
        >
          {timeOfDay(win.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

function EmptyState({ onCapture }: { onCapture: () => void }) {
  return (
    <View
      style={{
        borderRadius: 22,
        padding: 28,
        backgroundColor: 'rgba(250,246,239,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(250,246,239,0.10)',
        marginBottom: 28,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          backgroundColor: colors.terra + '33',
          borderWidth: 1,
          borderColor: colors.terra + '55',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
        }}
      >
        <Feather name="anchor" size={24} color={colors.terraLight} />
      </View>
      <Text
        style={{
          fontSize: 19,
          fontWeight: '500',
          color: colors.cream,
          letterSpacing: -0.3,
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        No wins yet today.
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: 'rgba(250,246,239,0.70)',
          lineHeight: 22,
          textAlign: 'center',
        }}
      >
        Capture small proof as it happens. A meeting handled. A choice you're proud of. Each one is evidence.
      </Text>
    </View>
  );
}
