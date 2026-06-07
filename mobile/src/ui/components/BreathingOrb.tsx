// BreathingOrb — Visora's brand mark.
// SPEC §7.4 anatomy: radial gradient sphere with soft halo, breathing at
// 4s in / 4s out. Sizes: 64 (mini), 132 (medium), 180 (hero), 220 (ritual).
// Never static — even on settings screens it breathes at amplitude 0.3.
//
// Architecture (Appendix D §D.2): Skia for the radial gradient + glow,
// Reanimated 3 for the scale animation (worklet on UI thread, 60fps).

import { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  Canvas,
  Circle,
  RadialGradient,
  BlurMask,
  vec,
} from '@shopify/react-native-skia';
import { colors, motion } from '@/ui/tokens';

export type OrbSize = 'mini' | 'medium' | 'hero' | 'ritual';
export type OrbVariant = 'amber' | 'terra';

const SIZE_MAP: Record<OrbSize, number> = {
  mini: 64,
  medium: 132,
  hero: 180,
  ritual: 220,
};

interface BreathingOrbProps {
  /** Preset size or custom px value */
  size?: OrbSize | number;
  /**
   * Breath depth — controls how much the orb scales during each breath.
   * 0.3 = idle (settings, vision tab), 0.4 = ritual default,
   * 0.5 = R03 Picture (heightened presence).
   */
  amplitude?: number;
  /** amber = primary (you), terra = witness orb */
  variant?: OrbVariant;
  /** Pause breathing (e.g. when ritual is paused). Settles to scale 1. */
  paused?: boolean;
  style?: ViewStyle;
}

export function BreathingOrb({
  size = 'medium',
  amplitude = motion.orbAmplitudeIdle,
  variant = 'amber',
  paused = false,
  style,
}: BreathingOrbProps) {
  const px = typeof size === 'number' ? size : SIZE_MAP[size];
  const breath = useSharedValue(0); // 0 = full exhale, 1 = full inhale

  useEffect(() => {
    if (paused) {
      cancelAnimation(breath);
      breath.value = withTiming(0, { duration: 240 });
      return;
    }

    breath.value = withRepeat(
      withTiming(1, {
        duration: motion.breathCycleMs / 2,
        easing: motion.breathEase,
      }),
      -1,
      true, // reverse on each iteration → in / out / in / out
    );

    return () => {
      cancelAnimation(breath);
    };
  }, [paused, breath]);

  // Scale: amplitude 0.3 → 6% peak, 0.5 → 10%, 0.8 → 16%.
  // Visibly breathing without feeling aggressive.
  const animatedStyle = useAnimatedStyle(() => {
    const peakScale = 1 + amplitude * 0.20;
    const scale = 1 + (peakScale - 1) * breath.value;

    // Opacity pulse on the glow — brightest on full inhale.
    // Adds the "alive" feeling beyond raw scale change.
    const opacity = 0.85 + 0.15 * breath.value;

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Core gradient stops differ by variant
  const coreInner = 'rgba(255, 240, 220, 0.95)'; // warm white highlight
  const coreMid = variant === 'amber' ? colors.amber : colors.terra;
  const coreOuter = variant === 'amber' ? colors.amberDeep : colors.terraDeep;

  // Halo color — terra-light for warmth, semi-transparent
  const haloPrimary = colors.terraLight + 'BB';
  const haloSecondary = colors.amberPale + '55';

  // Allocate canvas larger than core to accommodate halo bleed
  const canvasSize = Math.round(px * 1.3);
  const canvasCenter = canvasSize / 2;
  const coreRadius = px / 2;

  return (
    <View
      style={[
        { width: px, height: px, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <Animated.View style={[{ width: canvasSize, height: canvasSize }, animatedStyle]}>
        <Canvas style={{ width: canvasSize, height: canvasSize }}>
          {/* Outer halo — soft glow extending past the core */}
          <Circle cx={canvasCenter} cy={canvasCenter} r={canvasCenter}>
            <RadialGradient
              c={vec(canvasCenter, canvasCenter)}
              r={canvasCenter}
              colors={[haloPrimary, haloSecondary, 'transparent']}
              positions={[0, 0.4, 1]}
            />
            <BlurMask blur={20} style="solid" />
          </Circle>

          {/* Inner glow — a tighter ring of warmth around the core */}
          <Circle cx={canvasCenter} cy={canvasCenter} r={coreRadius * 1.15}>
            <RadialGradient
              c={vec(canvasCenter, canvasCenter)}
              r={coreRadius * 1.15}
              colors={[colors.amber + 'BB', colors.terra + '66', 'transparent']}
              positions={[0, 0.5, 1]}
            />
            <BlurMask blur={8} style="solid" />
          </Circle>

          {/* Core — radial gradient with highlight at 38% / 32% (key light) */}
          <Circle cx={canvasCenter} cy={canvasCenter} r={coreRadius}>
            <RadialGradient
              // Highlight position offset: top-left quadrant
              c={vec(
                canvasCenter - coreRadius * 0.24, // 38% from left of core
                canvasCenter - coreRadius * 0.36, // 32% from top of core
              )}
              r={coreRadius * 1.1}
              colors={[coreInner, coreMid, coreOuter]}
              positions={[0, 0.55, 1]}
            />
          </Circle>
        </Canvas>
      </Animated.View>
    </View>
  );
}
