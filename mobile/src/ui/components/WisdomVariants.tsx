// WisdomVariants — three card visual variants shared between the
// Home tab’s compact swipe strip and the full /wisdom modal. Each
// variant supports an `expanded` prop:
//   • expanded === false (default) — 150×110pt compact card sized
//     for the Home strip; text is truncated.
//   • expanded === true — full-width, auto-height card with bigger
//     fonts for the /wisdom modal’s vertical list.

import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/ui/tokens';

export function AffirmationVariant({
  text,
  expanded,
}: {
  text: string;
  expanded?: boolean;
}) {
  return (
    <View
      style={{
        width: expanded ? '100%' : 150,
        height: expanded ? undefined : 110,
        minHeight: expanded ? 96 : undefined,
        borderRadius: 14,
        padding: expanded ? 18 : 12,
        backgroundColor: 'rgba(192,104,72,0.28)',
        borderWidth: 1,
        borderColor: 'rgba(216,154,90,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={['rgba(192,104,72,0.4)', 'rgba(192,104,72,0.18)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: expanded ? 18 : 13,
          lineHeight: expanded ? 24 : 17,
          color: colors.cream,
          fontWeight: '500',
          textAlign: 'center',
        }}
        numberOfLines={expanded ? undefined : 4}
      >
        {text}
      </Text>
    </View>
  );
}

export function QuoteVariant({
  text,
  author,
  expanded,
}: {
  text: string;
  author: string;
  expanded?: boolean;
}) {
  return (
    <View
      style={{
        width: expanded ? '100%' : 150,
        height: expanded ? undefined : 110,
        minHeight: expanded ? 96 : undefined,
        borderRadius: 14,
        padding: expanded ? 18 : 12,
        backgroundColor: 'rgba(216,154,90,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(216,154,90,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: expanded ? 17 : 12,
          lineHeight: expanded ? 23 : 15,
          color: colors.cream,
          textAlign: 'center',
          marginBottom: expanded ? 10 : 6,
        }}
        numberOfLines={expanded ? undefined : 3}
      >
        {text}
      </Text>
      <Text
        style={{
          fontSize: expanded ? 9 : 7,
          fontWeight: '700',
          letterSpacing: expanded ? 1.6 : 1.2,
          color: colors.amber,
          textAlign: 'center',
        }}
        numberOfLines={1}
      >
        {author.toUpperCase()}
      </Text>
    </View>
  );
}

export function PromptVariant({
  text,
  expanded,
}: {
  text: string;
  expanded?: boolean;
}) {
  return (
    <View
      style={{
        width: expanded ? '100%' : 150,
        height: expanded ? undefined : 110,
        minHeight: expanded ? 96 : undefined,
        borderRadius: 14,
        padding: expanded ? 18 : 12,
        backgroundColor: 'rgba(250,246,239,0.03)',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(216,154,90,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: expanded ? 9 : 7,
          fontWeight: '700',
          letterSpacing: expanded ? 1.8 : 1.5,
          color: 'rgba(250,246,239,0.55)',
          marginBottom: expanded ? 8 : 5,
        }}
      >
        SIT WITH
      </Text>
      <Text
        style={{
          fontSize: expanded ? 17 : 12,
          lineHeight: expanded ? 23 : 15,
          color: colors.cream,
          fontWeight: '500',
          textAlign: 'center',
        }}
        numberOfLines={expanded ? undefined : 3}
      >
        {text}
      </Text>
    </View>
  );
}
