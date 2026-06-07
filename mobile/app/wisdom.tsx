// Wisdom screen — modal that opens when the user taps a wisdom card
// on the Home strip. Presents the same WisdomItem[] from
// todaysWisdomSet() as a horizontal pager — one card per page, swipe
// left/right to navigate. Opens at the index of the card the user
// tapped (passed via the `?index=N` query param).
//
// LAYOUT: full-screen pager. Each page is screenWidth wide; the
// expanded WisdomVariant fills the visible area with comfortable
// margins. Page indicator dots + "N OF M" counter give navigation
// context without chrome.

import { useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { todaysWisdomSet } from '@/core/constants/wisdomItems';
import type { WisdomItem } from '@/core/models/wisdom';
import {
  AffirmationVariant,
  QuoteVariant,
  PromptVariant,
} from '@/ui/components/WisdomVariants';
import { colors } from '@/ui/tokens';

function ExpandedWisdomCard({ item }: { item: WisdomItem }) {
  switch (item.kind) {
    case 'affirmation':
      return <AffirmationVariant affirmation={item.item} expanded />;
    case 'quote':
      return <QuoteVariant quote={item.item} expanded />;
    case 'prompt':
      return <PromptVariant prompt={item.item} expanded />;
  }
}

export default function WisdomScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { index: indexParam } = useLocalSearchParams<{ index?: string }>();
  const initialIndex = Math.max(0, Number(indexParam ?? 0) || 0);

  const activeVisions = useVisionAreasStore((s) => s.activeVisions);
  const visionCategories = Array.from(
    new Set(activeVisions().map((v) => v.category)),
  );
  const items = todaysWisdomSet(visionCategories, 8);
  const clampedInitial = Math.min(initialIndex, Math.max(0, items.length - 1));

  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(clampedInitial);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / screenWidth);
    if (i !== currentIndex) setCurrentIndex(i);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      {/* Same cosmic-warm gradient as Home for visual continuity */}
      <LinearGradient
        colors={[colors.terraDeep + '44', 'transparent']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320 }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Top bar — counter on left, close X on right */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 22,
            right: 18,
            zIndex: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 1.8,
              color: colors.amber,
            }}
          >
            {currentIndex + 1} OF {items.length}
          </Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => ({
              width: 32,
              height: 32,
              borderRadius: 999,
              backgroundColor: 'rgba(250,246,239,0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
            accessibilityRole="button"
            accessibilityLabel="Close wisdom"
          >
            <Feather name="x" size={16} color={colors.cream} />
          </Pressable>
        </View>

        {/* Horizontal pager — one card per page */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          contentOffset={{ x: clampedInitial * screenWidth, y: 0 }}
          style={{ flex: 1 }}
        >
          {items.map((item, i) => (
            <View
              key={`${item.kind}-${i}`}
              style={{
                width: screenWidth,
                paddingHorizontal: 28,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{ width: '100%' }}>
                <ExpandedWisdomCard item={item} />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom dot paginator — reflects swipe position */}
        <View
          style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {items.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === currentIndex ? 18 : 6,
                height: 6,
                borderRadius: 99,
                backgroundColor:
                  i === currentIndex ? colors.amber : 'rgba(250,246,239,0.25)',
              }}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
