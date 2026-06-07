// Fab — floating action button used on the Wins tab to capture a new win.
// SPEC §6.6 places the FAB bottom-right above the tab bar.

import { Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { colors, radii } from '@/ui/tokens';

interface Props {
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  label?: string;
}

export function Fab({ onPress, icon = 'plus', label }: Props) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress();
  };

  // Pill (with label) vs round (icon-only)
  const isPill = !!label;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        position: 'absolute',
        right: 18,
        bottom: 18,
        opacity: pressed ? 0.92 : 1,
        shadowColor: colors.terra,
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.5,
        shadowRadius: 28,
        elevation: 8,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <LinearGradient
        colors={[colors.terra, colors.terraDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 56,
          minWidth: 56,
          paddingHorizontal: isPill ? 22 : 0,
          borderRadius: radii.full,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isPill ? 8 : 0,
        }}
      >
        <Feather name={icon} size={22} color={colors.cream} />
        {isPill && (
          <Text
            style={{
              color: colors.cream,
              fontSize: 15,
              fontWeight: '600',
              letterSpacing: 0.1,
            }}
          >
            {label}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
