// Profile — reached by tapping the avatar on the Home tab.
//
// Round 13 v1: read-only profile + stats overview. No editing yet — name
// and email are still hard-coded until auth lands (Phase B.7). Account
// management lives in /settings (reachable from the row near the bottom).

import { useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { useWinsStore } from '@/core/stores/useWinsStore';
import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { useProfileStore } from '@/core/stores/useProfileStore';
import { colors } from '@/ui/tokens';

// Email stays a placeholder until Sign in with Apple lands (Phase B.7).
const EMAIL = '';

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const wins = useWinsStore((s) => s.wins);
  const visions = useVisionAreasStore((s) => s.visions);
  const profileName = useProfileStore((s) => s.name);
  const NAME = profileName || 'Friend';

  const stats = useMemo(() => {
    const winsCount = wins.filter((w) => !w.deletedAt).length;
    const activeVisions = visions.filter((v) => !v.completedAt).length;
    const archivedVisions = visions.filter((v) => !!v.completedAt).length;
    // First-touch date: oldest vision createdAt or oldest win, fallback today.
    const allDates = [
      ...wins.map((w) => new Date(w.createdAt).getTime()),
      ...visions.map((v) => v.createdAt),
    ].filter((n) => n > 0);
    const firstTouch = allDates.length > 0 ? Math.min(...allDates) : Date.now();
    const daysSince = Math.max(
      1,
      Math.floor((Date.now() - firstTouch) / (24 * 60 * 60 * 1000)),
    );
    return { winsCount, activeVisions, archivedVisions, daysSince };
  }, [wins, visions]);

  const memberSince = (() => {
    const allDates = [
      ...wins.map((w) => new Date(w.createdAt).getTime()),
      ...visions.map((v) => v.createdAt),
    ].filter((n) => n > 0);
    if (allDates.length === 0) return 'today';
    const first = new Date(Math.min(...allDates));
    return first.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });
  })();

  const handleSignOut = () => {
    Alert.alert(
      'Sign out?',
      'Your data stays on this device. You can come back any time.',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          // No-op until auth lands.
          onPress: () => router.back(),
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      <LinearGradient
        colors={[colors.terraDeep + '55', 'transparent']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Top chrome — back only. Settings gear removed (Round 13.5);
            the Settings menu item below is the single entry point. */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => ({
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: 'rgba(250,246,239,0.06)',
              borderWidth: 1,
              borderColor: 'rgba(250,246,239,0.14)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Feather name="chevron-left" size={18} color={colors.cream} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero — large avatar + name + status */}
          <View style={{ alignItems: 'center', paddingTop: 16, paddingHorizontal: 28 }}>
            <LinearGradient
              colors={[colors.terraLight, colors.terra, colors.terraDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 88,
                height: 88,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'rgba(250,246,239,0.18)',
                shadowColor: colors.terra,
                shadowOpacity: 0.6,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 12 },
              }}
            >
              <Text
                style={{
                  color: colors.cream,
                  fontSize: 32,
                  fontWeight: '500',
                  letterSpacing: -0.6,
                }}
              >
                {NAME[0]}
              </Text>
            </LinearGradient>

            <Text
              style={{
                marginTop: 18,
                fontSize: 28,
                fontWeight: '500',
                color: colors.cream,
                letterSpacing: -0.5,
              }}
            >
              {NAME}
            </Text>
            <Text
              style={{
                marginTop: 6,
                fontSize: 12,
                color: 'rgba(250,246,239,0.5)',
                letterSpacing: 0.3,
              }}
            >
              Since {memberSince}
            </Text>
          </View>

          {/* Stats row */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 32,
              marginHorizontal: 22,
              padding: 18,
              borderRadius: 18,
              backgroundColor: 'rgba(250,246,239,0.06)',
              borderWidth: 1,
              borderColor: 'rgba(250,246,239,0.10)',
            }}
          >
            <Stat value={stats.winsCount} label="Wins" />
            <Divider />
            <Stat value={stats.activeVisions} label="Visions" />
            <Divider />
            <Stat value={stats.daysSince} label="Days in" />
          </View>

          {/* Archived count — quiet line, only if any */}
          {stats.archivedVisions > 0 && (
            <Pressable
              onPress={() => router.push('/vision-archive')}
              hitSlop={4}
              style={({ pressed }) => ({
                marginTop: 14,
                marginHorizontal: 22,
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: 'rgba(250,246,239,0.04)',
                borderWidth: 1,
                borderColor: 'rgba(250,246,239,0.08)',
                flexDirection: 'row',
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: colors.amber + 'D0',
                  marginRight: 8,
                }}
              />
              <Text style={{ flex: 1, fontSize: 12, color: 'rgba(250,246,239,0.7)', letterSpacing: 0.3 }}>
                {stats.archivedVisions} sealed {stats.archivedVisions === 1 ? 'vision' : 'visions'} in the archive
              </Text>
              <Feather name="chevron-right" size={14} color="rgba(250,246,239,0.4)" />
            </Pressable>
          )}

          {/* Menu items — round 13.5: "About" removed (already lives
              inside Settings, was a pure duplication). */}
          <View style={{ marginTop: 24, marginHorizontal: 22 }}>
            <MenuItem
              icon="settings"
              label="Settings"
              sublabel="Voice, account, about"
              onPress={() => router.push('/settings')}
            />
            <MenuItem
              icon="help-circle"
              label="Help & support"
              sublabel="Email us"
              onPress={() =>
                Linking.openURL('mailto:support@tryvisora.com?subject=Visora%20support').catch(() =>
                  Alert.alert('Email not available', 'Reach us at support@tryvisora.com'),
                )
              }
            />
          </View>

          {/* Sign out */}
          <Pressable
            onPress={handleSignOut}
            hitSlop={6}
            style={({ pressed }) => ({
              marginTop: 26,
              alignSelf: 'center',
              paddingHorizontal: 16,
              paddingVertical: 10,
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                color: colors.terraDeep,
              }}
            >
              Sign out
            </Text>
          </Pressable>

          <Text
            style={{
              marginTop: 18,
              textAlign: 'center',
              fontSize: 10,
              color: 'rgba(250,246,239,0.35)',
              letterSpacing: 0.4,
            }}
          >
            {EMAIL}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      <Text style={{ fontSize: 24, fontWeight: '500', color: colors.cream, letterSpacing: -0.5 }}>
        {value}
      </Text>
      <Text
        style={{
          fontSize: 9.5,
          fontWeight: '700',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: 'rgba(250,246,239,0.5)',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={{ width: 1, backgroundColor: 'rgba(250,246,239,0.10)' }} />;
}

function MenuItem({
  icon,
  label,
  sublabel,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  sublabel?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: pressed ? 'rgba(250,246,239,0.08)' : 'rgba(250,246,239,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(250,246,239,0.08)',
        marginBottom: 8,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: 'rgba(216,154,90,0.15)',
          borderWidth: 1,
          borderColor: 'rgba(216,154,90,0.30)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={icon} size={15} color={colors.amber} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.cream,
            letterSpacing: -0.2,
            marginBottom: 1,
          }}
        >
          {label}
        </Text>
        {!!sublabel && (
          <Text style={{ fontSize: 11, color: 'rgba(250,246,239,0.5)', letterSpacing: 0.2 }}>
            {sublabel}
          </Text>
        )}
      </View>
      <Feather name="chevron-right" size={16} color="rgba(250,246,239,0.4)" />
    </Pressable>
  );
}
