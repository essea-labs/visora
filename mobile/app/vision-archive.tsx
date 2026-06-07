// Vision Archive — list of completed visions.
//
// Reached from the small "N archived" chip on the Vision tab (top-left,
// only shown when archivedVisions().length > 0). Each row shows a small
// hero photo + category + identity + "Completed on Date" + win count.
// Tap → opens vision-detail for that vision (which renders the same
// hero/stats/wins but with "Restore" replacing "Mark complete").

import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { AREA_BY_KEY, type AreaKind } from '@/core/constants/areas';
import { photoById } from '@/core/constants/photoLibrary';
import {
  useVisionAreasStore,
  type AreaVision,
} from '@/core/stores/useVisionAreasStore';
import { useWinsStore } from '@/core/stores/useWinsStore';
import { colors } from '@/ui/tokens';

export default function VisionArchive() {
  const router = useRouter();
  const archivedVisions = useVisionAreasStore((s) => s.archivedVisions);
  // Subscribe to the raw wins array (reactive); the `winsForVision`
  // function reference itself is stable and wouldn't trigger re-renders.
  const allWins = useWinsStore((s) => s.wins);
  const winCountForVision = (id: string) =>
    allWins.reduce(
      (n, w) => (!w.deletedAt && w.visionId === id ? n + 1 : n),
      0,
    );

  const visions = archivedVisions();

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      <LinearGradient
        colors={[colors.terraDeep + '33', 'transparent']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 240 }}
      />
      <LinearGradient
        colors={['transparent', colors.cosmicB + '55']}
        locations={[0.5, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Top chrome — back + title */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 18,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => ({
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: 'rgba(250,246,239,0.06)',
              borderWidth: 1,
              borderColor: 'rgba(250,246,239,0.14)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Feather name="chevron-left" size={18} color={colors.cream} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 18 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 2.2,
              textTransform: 'uppercase',
              color: colors.amber,
              marginBottom: 8,
            }}
          >
            Archive
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '500',
              color: colors.cream,
              letterSpacing: -0.6,
              lineHeight: 33,
            }}
          >
            Who you became.
          </Text>
        </View>

        {visions.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 80,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: 'rgba(250,246,239,0.55)',
                fontStyle: 'italic',
                textAlign: 'center',
                maxWidth: 260,
                lineHeight: 20,
              }}
            >
              Nothing here yet. Visions you've sealed will live here as
              the wins of who you've become.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 22,
              paddingBottom: 60,
              gap: 12,
            }}
            showsVerticalScrollIndicator={false}
          >
            {visions.map((v) => (
              <ArchiveRow
                key={v.id}
                vision={v}
                wins={winCountForVision(v.id)}
                onPress={() =>
                  router.push({
                    pathname: '/vision-detail',
                    params: { id: v.id },
                  })
                }
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

function ArchiveRow({
  vision,
  wins,
  onPress,
}: {
  vision: AreaVision;
  wins: number;
  onPress: () => void;
}) {
  const def =
    vision.category !== 'custom'
      ? AREA_BY_KEY[vision.category as Exclude<AreaKind, 'custom'>]
      : null;
  const categoryLabel = def?.label ?? vision.customLabel ?? 'Custom';

  const hero = vision.photos?.[0];
  const source =
    (hero?.uri && { uri: hero.uri }) ||
    (hero?.libraryId && photoById(hero.libraryId)?.source) ||
    def?.thumb;

  const completedDate = vision.completedAt
    ? new Date(vision.completedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        gap: 14,
        padding: 12,
        borderRadius: 16,
        backgroundColor: 'rgba(250,246,239,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(250,246,239,0.08)',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 72,
          height: 92,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: colors.cosmicB,
        }}
      >
        {source && (
          <Image
            source={source}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(20,12,6,0.55)']}
          locations={[0.5, 1]}
          style={{ position: 'absolute', inset: 0 as any }}
        />
      </View>
      <View style={{ flex: 1, minWidth: 0, justifyContent: 'center', gap: 4 }}>
        <Text
          style={{
            fontSize: 9.5,
            fontWeight: '700',
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: colors.terraLight,
          }}
        >
          {categoryLabel}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 16,
            fontWeight: '500',
            fontStyle: 'italic',
            color: colors.cream,
            letterSpacing: -0.3,
            lineHeight: 19,
          }}
        >
          {vision.name || categoryLabel}
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: 'rgba(250,246,239,0.55)',
            letterSpacing: 0.3,
          }}
        >
          Completed {completedDate} · {wins} {wins === 1 ? 'win' : 'wins'}
        </Text>
      </View>
      <Feather
        name="chevron-right"
        size={16}
        color="rgba(250,246,239,0.4)"
        style={{ alignSelf: 'center' }}
      />
    </Pressable>
  );
}
