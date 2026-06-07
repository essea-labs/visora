// WinCard — single-win row used in the Wins tab.
// Simplified: paper-card surface, body text, optional thumbnail, time pill.

import { View, Text, Image, Pressable } from 'react-native';
import { colors, radii, shadows } from '@/ui/tokens';
import type { Win } from '@/core/stores/useWinsStore';

interface Props {
  win: Win;
  onPress?: () => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  const hour12 = ((h + 11) % 12) + 1;
  const min = String(m).padStart(2, '0');
  return `${hour12}:${min} ${ampm}`;
}

export function WinCard({ win, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#F8F2E5' : colors.paper,
        borderRadius: radii.l,
        padding: 16,
        gap: 10,
        ...shadows.slip,
      })}
    >
      {/* Body */}
      <Text
        style={{
          fontSize: 15.5,
          lineHeight: 23,
          color: colors.ink,
          letterSpacing: -0.1,
        }}
      >
        {win.body}
      </Text>

      {/* Optional photo */}
      {win.photoUri && (
        <Image
          source={{ uri: win.photoUri }}
          style={{
            width: '100%',
            height: 180,
            borderRadius: radii.m,
            marginTop: 2,
          }}
          resizeMode="cover"
        />
      )}

      {/* Time stamp */}
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: colors.muted,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {formatTime(win.createdAt)}
      </Text>
    </Pressable>
  );
}
