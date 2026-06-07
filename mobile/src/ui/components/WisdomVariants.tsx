// WisdomVariants — three card visual variants shared between the
// Home tab's compact swipe strip and the full /wisdom modal.
//
// R58 (Variant G): photo-backed cards with a frosted-glass overlay.
//   • Affirmations use their existing `photoLibraryId` (already
//     defined on the Affirmation type, was the original R52 design
//     before R53 simplified everything to solid fills).
//   • Quotes + prompts pick from a small atmospheric subset of the
//     library, deterministically by text hash, so the same quote
//     always gets the same photo across renders.
//   • A dark scrim + BlurView inset keeps text legible over any photo.
//
// Each variant takes `expanded`:
//   • false (default) — 150×110pt compact card sized for the Home strip
//   • true            — full-width, auto-height card for the /wisdom modal

import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { colors } from '@/ui/tokens';
import { photoById } from '@/core/constants/photoLibrary';
import type { Affirmation } from '@/core/constants/affirmations';
import type { DailyQuote } from '@/core/constants/dailyQuotes';
import type { ReflectivePrompt } from '@/core/models/wisdom';

// ── photo selection ────────────────────────────────────────
// Atmospheric photo pool used for quotes + prompts (which don't have
// their own photo association on the data type). Chosen for "open /
// contemplative" feel that works behind any text.
const ATMOSPHERIC_PHOTO_IDS = [
  'work-coffee',
  'work-window',
  'warm-bright',
  'work-beach',
  'work-plant',
];

function hashSeed(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h += text.charCodeAt(i);
  return h;
}

function atmosphericPhotoSource(seed: string) {
  const id = ATMOSPHERIC_PHOTO_IDS[hashSeed(seed) % ATMOSPHERIC_PHOTO_IDS.length];
  return photoById(id)?.source;
}

// ── shared photo-backed card chrome ────────────────────────
function PhotoBackedCard({
  photoSource,
  expanded,
  borderStyle = 'solid',
  borderColor = 'rgba(216,154,90,0.30)',
  children,
}: {
  photoSource: ReturnType<typeof atmosphericPhotoSource> | undefined;
  expanded: boolean;
  borderStyle?: 'solid' | 'dashed';
  borderColor?: string;
  children: React.ReactNode;
}) {
  // R60: expanded cards are FULL BLEED — photo fills the entire sheet,
  // BlurView panel centered on it (text-legibility panel, like Apple
  // Photos info overlay). No outer border, no radius, no shadow because
  // there's no "card" any more — it IS the sheet.
  return (
    <View
      style={
        expanded
          ? {
              width: '100%',
              height: '100%',
              backgroundColor: colors.cosmicB,
              overflow: 'hidden',
            }
          : {
              width: 150,
              height: 110,
              borderRadius: 14,
              overflow: 'hidden',
              backgroundColor: colors.cosmicB,
              borderWidth: 1,
              borderStyle,
              borderColor,
              shadowColor: '#000',
              shadowOpacity: 0.4,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
            }
      }
    >
      {photoSource && (
        <Image
          source={photoSource}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={['rgba(20,12,6,0.30)', 'rgba(20,12,6,0.78)']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <BlurView
        intensity={expanded ? 60 : 65}
        tint="dark"
        style={
          expanded
            ? {
                // Full-bleed: centered glass panel with comfortable
                // breathing room from screen edges, never touches the
                // top bar (counter + close) or bottom paginator.
                position: 'absolute',
                top: '22%',
                left: 28,
                right: 28,
                bottom: '22%',
                borderRadius: 18,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 28,
                borderWidth: 1,
                borderColor: 'rgba(250,246,239,0.12)',
              }
            : {
                position: 'absolute',
                top: 6,
                left: 6,
                right: 6,
                bottom: 6,
                borderRadius: 10,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
              }
        }
      >
        {children}
      </BlurView>
    </View>
  );
}

// ── three discriminated variants ───────────────────────────
export function AffirmationVariant({
  affirmation,
  expanded = false,
}: {
  affirmation: Affirmation;
  expanded?: boolean;
}) {
  const photo = photoById(affirmation.photoLibraryId);
  return (
    <PhotoBackedCard photoSource={photo?.source} expanded={expanded}>
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: expanded ? 26 : 13,
          lineHeight: expanded ? 34 : 17,
          color: colors.cream,
          fontWeight: '500',
          textAlign: 'center',
          letterSpacing: expanded ? -0.4 : 0,
          textShadowColor: 'rgba(0,0,0,0.55)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        }}
        numberOfLines={expanded ? undefined : 4}
      >
        {affirmation.text}
      </Text>
    </PhotoBackedCard>
  );
}

export function QuoteVariant({
  quote,
  expanded = false,
}: {
  quote: DailyQuote;
  expanded?: boolean;
}) {
  return (
    <PhotoBackedCard
      photoSource={atmosphericPhotoSource(quote.text)}
      expanded={expanded}
    >
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: expanded ? 22 : 12,
          lineHeight: expanded ? 30 : 15,
          color: colors.cream,
          textAlign: 'center',
          letterSpacing: expanded ? -0.3 : 0,
          marginBottom: expanded ? 18 : 6,
          textShadowColor: 'rgba(0,0,0,0.55)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        }}
        numberOfLines={expanded ? undefined : 3}
      >
        {quote.text}
      </Text>
      <Text
        style={{
          fontSize: expanded ? 11 : 7,
          fontWeight: '700',
          letterSpacing: expanded ? 2 : 1.2,
          color: colors.amber,
          textAlign: 'center',
          textShadowColor: 'rgba(0,0,0,0.65)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}
        numberOfLines={expanded ? 2 : 1}
      >
        {quote.author.toUpperCase()}
      </Text>
    </PhotoBackedCard>
  );
}

export function PromptVariant({
  prompt,
  expanded = false,
}: {
  prompt: ReflectivePrompt;
  expanded?: boolean;
}) {
  return (
    <PhotoBackedCard
      photoSource={atmosphericPhotoSource(prompt.text)}
      expanded={expanded}
      borderStyle="dashed"
      borderColor="rgba(216,154,90,0.45)"
    >
      <Text
        style={{
          fontSize: expanded ? 11 : 7,
          fontWeight: '700',
          letterSpacing: expanded ? 2.4 : 1.5,
          color: 'rgba(250,246,239,0.85)',
          marginBottom: expanded ? 16 : 5,
          textShadowColor: 'rgba(0,0,0,0.65)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}
      >
        SIT WITH
      </Text>
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: expanded ? 24 : 12,
          lineHeight: expanded ? 32 : 15,
          color: colors.cream,
          fontWeight: '500',
          textAlign: 'center',
          letterSpacing: expanded ? -0.3 : 0,
          textShadowColor: 'rgba(0,0,0,0.55)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        }}
        numberOfLines={expanded ? undefined : 3}
      >
        {prompt.text}
      </Text>
    </PhotoBackedCard>
  );
}
