// Reader screen — modal that opens when the user taps "Continue
// reading →" on the Home tab. Renders today's reading via a
// structured ReadingBlock[] body. Minimal editorial styling: serif
// body, terra-warm pull-quote treatment with attribution.
//
// LAYOUT: scrollable content. Unlike Home, the reader is allowed —
// even expected — to scroll for longer pieces.

import { ScrollView, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { todaysReading } from '@/core/constants/dailyReadings';
import type { ReadingBlock } from '@/core/models/wisdom';
import { colors } from '@/ui/tokens';

export default function ReaderScreen() {
  const router = useRouter();
  const reading = todaysReading();

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      {/* Same cosmic-warm gradient as Home for visual continuity */}
      <LinearGradient
        colors={[colors.terraDeep + '44', 'transparent']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320 }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Close button — top-right circular X */}
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => ({
            position: 'absolute',
            top: 12,
            right: 18,
            width: 32,
            height: 32,
            borderRadius: 999,
            backgroundColor: 'rgba(250,246,239,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            opacity: pressed ? 0.7 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel="Close reading"
        >
          <Feather name="x" size={16} color={colors.cream} />
        </Pressable>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingTop: 24,
            paddingBottom: 60,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 2,
              color: colors.amber,
              marginBottom: 6,
            }}
          >
            VISORA · DAY {reading.dayNumber}
          </Text>
          <Text
            style={{
              fontFamily: 'Georgia',
              fontSize: 26,
              fontWeight: '500',
              lineHeight: 30,
              color: colors.cream,
              letterSpacing: -0.5,
              marginBottom: 6,
            }}
          >
            {reading.title}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: 'rgba(250,246,239,0.55)',
              marginBottom: 22,
            }}
          >
            {reading.readTimeMinutes} min read
          </Text>

          {reading.body.map((block, i) => (
            <ReadingBlockView key={i} block={block} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ReadingBlockView({ block }: { block: ReadingBlock }) {
  if (block.type === 'paragraph') {
    return (
      <Text
        style={{
          fontFamily: 'Georgia',
          fontSize: 15,
          lineHeight: 23,
          color: 'rgba(250,246,239,0.92)',
          marginBottom: 14,
        }}
      >
        {block.text}
      </Text>
    );
  }
  // pullquote
  return (
    <View
      style={{
        borderLeftWidth: 2,
        borderLeftColor: colors.amber,
        paddingLeft: 14,
        paddingVertical: 4,
        marginBottom: 18,
        marginTop: 6,
      }}
    >
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: 15,
          lineHeight: 22,
          color: colors.cream,
          marginBottom: 8,
        }}
      >
        “{block.text}”
      </Text>
      <Text
        style={{
          fontSize: 9,
          fontWeight: '700',
          letterSpacing: 1.5,
          color: colors.amber,
        }}
      >
        {block.source.toUpperCase()}
      </Text>
    </View>
  );
}
