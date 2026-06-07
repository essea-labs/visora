// Card — the canonical body-card primitive (Daylit register).
//
// One place where padding, radius, and surface choice are decided so every
// screen lines up. Variants give different *visual roles* (warmth, calm,
// emphasis) without each consumer rewriting border/background/padding
// math.
//
// Usage:
//   <Card>...neutral surface card with shadow...</Card>
//   <Card variant="paper">...warm cream "journal" feel...</Card>
//   <Card variant="sage">...quiet wisdom / quote feel...</Card>
//   <Card variant="amber">...invitation / soft CTA feel...</Card>
//   <Card variant="dashed">...empty-state, "tap to fill"...</Card>
//
// Pair with <Section> for vertical rhythm between cards.

import type { ReactNode } from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import { colors, radii, cardPadding, shadows } from '@/ui/tokens';

export type CardVariant = 'surface' | 'paper' | 'sage' | 'amber' | 'dashed';

interface Props {
  variant?: CardVariant;
  /** Override or extend the base padding (default = cardPadding = 18). */
  padding?: number;
  /** Override the corner radius (default = radii.l = 18). */
  radius?: number;
  /** Drop the shadow (useful inside other cards or sheets). */
  noShadow?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const VARIANT_BASE: Record<CardVariant, ViewStyle> = {
  surface: {
    backgroundColor: colors.surface,
    borderColor: colors.hairline,
    borderWidth: 1,
  },
  paper: {
    backgroundColor: colors.paper,
    borderColor: colors.amber + '33',
    borderWidth: 1,
  },
  sage: {
    backgroundColor: colors.sagePale + '80',
    borderColor: colors.sage + '44',
    borderWidth: 1,
  },
  amber: {
    backgroundColor: colors.amberPale + 'A0',
    borderColor: colors.amber + '55',
    borderWidth: 1,
  },
  dashed: {
    backgroundColor: 'transparent',
    borderColor: colors.amber + '55',
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
};

export function Card({
  variant = 'surface',
  padding = cardPadding,
  radius = radii.l,
  noShadow = false,
  style,
  children,
}: Props) {
  return (
    <View
      style={[
        {
          padding,
          borderRadius: radius,
        },
        VARIANT_BASE[variant],
        !noShadow && variant !== 'dashed' ? shadows.slip : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}
