// Section — vertical rhythm primitive (Daylit register).
//
// Codifies the gap between stacked cards so every screen reads with the
// same cadence. Three rhythms map to spacing tokens:
//   tight  → spacing.s   (8)   — sub-rows within a card or chip group
//   normal → spacing.l   (16)  — between adjacent cards in the same section
//   loose  → spacing.xxl (28)  — between distinct sections / breath beats
//
// Also exposes `Gutter` as the consistent horizontal screen-edge inset.

import type { ReactNode } from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import { spacing, screenGutter } from '@/ui/tokens';

type Rhythm = 'tight' | 'normal' | 'loose';

const GAP: Record<Rhythm, number> = {
  tight: spacing.s,
  normal: spacing.l,
  loose: spacing.xxl,
};

interface Props {
  rhythm?: Rhythm;
  /** Horizontal screen-edge inset. Default = screenGutter (22). */
  gutter?: number;
  /** Vertical padding above / below the section. */
  paddingTop?: number;
  paddingBottom?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export function Section({
  rhythm = 'normal',
  gutter = screenGutter,
  paddingTop = 0,
  paddingBottom = 0,
  style,
  children,
}: Props) {
  return (
    <View
      style={[
        {
          paddingHorizontal: gutter,
          paddingTop,
          paddingBottom,
          gap: GAP[rhythm],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Just the horizontal screen-edge inset, when you don't need rhythm. */
export function Gutter({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ paddingHorizontal: screenGutter }, style]}>{children}</View>;
}
