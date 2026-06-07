// Reusable Cosmic-register backdrop — used by onboarding O02–O09 and the
// morning ritual. Two flavors per SPEC §7.1:
//   default: terra-deep wash from top
//   terra:   amber/terra wash, more saturated (used when an emotional moment
//            wants more warmth — e.g. O06 Name your vision)

import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/ui/tokens';

interface Props {
  variant?: 'default' | 'terra';
  children?: React.ReactNode;
}

export function CosmicBackground({ variant = 'default', children }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      <LinearGradient
        colors={
          variant === 'terra'
            ? [
                'rgba(192, 104, 72, 0.42)', // terra wash, stronger
                'rgba(122, 69, 48, 0.18)',
                'transparent',
              ]
            : [
                'rgba(158, 79, 50, 0.32)', // terra-deep wash
                'transparent',
                'rgba(122, 69, 48, 0.32)',
              ]
        }
        locations={variant === 'terra' ? [0, 0.4, 1] : [0, 0.5, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {children}
    </View>
  );
}
