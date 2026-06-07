// PrimaryCta — terra gradient pill button used across onboarding.
// SPEC §7.4 component spec.

import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, radii } from '@/ui/tokens';

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function PrimaryCta({ label, onPress, disabled = false }: Props) {
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress?.();
  };

  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24 }}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => ({
          height: 60,
          borderRadius: radii.full,
          opacity: disabled ? 0.4 : pressed ? 0.92 : 1,
          shadowColor: colors.terra,
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.55,
          shadowRadius: 40,
          elevation: 8,
        })}
      >
        <LinearGradient
          colors={[colors.terra, colors.terraDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            borderRadius: radii.full,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: colors.cream,
              fontSize: 16,
              fontWeight: '600',
              letterSpacing: 0.1,
            }}
          >
            {label}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
