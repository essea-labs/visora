// Settings — reached from Profile (or the gear icon top-right of Profile).
//
// Round 13 v1: scaffolds the structure. Toggles persist to a local
// settings store (TBD); for now they're useState placeholders so the
// switches feel real on-device. Real notification scheduling + audio
// override + account management land in subsequent rounds.

import {
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { ritualVoiceForDate } from '@/core/audio/ritualVoice';
import { useDailyStore } from '@/core/stores/useDailyStore';
import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { useSubscriptionStore } from '@/core/stores/useSubscriptionStore';
import { colors } from '@/ui/tokens';

const APP_VERSION = '0.13.0';
const EMAIL = 'shellena@example.com';

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const todayVoice = ritualVoiceForDate();
  const resetDaily = useDailyStore((s) => s.reset);
  const resetVisions = useVisionAreasStore((s) => s.reset);
  const resetSubscription = useSubscriptionStore((s) => s.reset);

  const handleReplayOnboarding = () => {
    Alert.alert(
      'Replay onboarding?',
      "We'll take you back to the welcome screen for a fresh run. Your visions will be cleared so you can rebuild them; your wins stay safe.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Replay',
          style: 'destructive',
          onPress: () => {
            // True replay = fresh start. Clear every store that drives
            // the onboarding routing AND the vision board itself.
            // Wins persist (separate store). If a win's visionId points
            // to a deleted vision, the UI handles it gracefully.
            // R46: useOnboardingStore.reset() removed — that store and
            // the deprecated photos/describe screens were deleted.
            resetDaily();
            resetVisions();
            resetSubscription();
            router.replace('/(onboarding)/welcome' as never);
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      <LinearGradient
        colors={[colors.terraDeep + '33', 'transparent']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Top chrome — back + title */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 12,
            gap: 14,
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
          <Text
            style={{
              flex: 1,
              fontSize: 24,
              fontWeight: '500',
              color: colors.cream,
              letterSpacing: -0.5,
            }}
          >
            Settings
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingBottom: 40 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Ritual ─────────────────────────────────── */}
          <SectionHeading>Ritual</SectionHeading>
          <SettingsCard>
            <InfoRow
              label="Today's voice"
              value={todayVoice.voiceName}
              hint="Voice-guided ritual"
            />
          </SettingsCard>

          {/* ── Account ────────────────────────────────── */}
          <SectionHeading>Account</SectionHeading>
          <SettingsCard>
            <InfoRow label="Email" value={EMAIL} />
            <Divider />
            <ActionRow
              label="Manage subscription"
              onPress={() => {
                // R46: real deep link to the iOS Subscriptions settings
                // page. Apple's recommended pattern — App Review requires
                // an in-app entry point to manage/cancel subscriptions.
                Linking.openURL('itms-apps://apps.apple.com/account/subscriptions').catch(() =>
                  Alert.alert(
                    'Open Settings',
                    'Go to Settings → your Apple ID → Subscriptions to manage your Visora plan.',
                  ),
                );
              }}
            />
          </SettingsCard>

          {/* ── About ──────────────────────────────────── */}
          <SectionHeading>About</SectionHeading>
          <SettingsCard>
            <InfoRow label="Version" value={APP_VERSION} hint={Platform.OS} />
            <Divider />
            <ActionRow
              label="Privacy policy"
              onPress={() => Linking.openURL('https://tryvisora.com/privacy').catch(() => {})}
            />
            <Divider />
            <ActionRow
              label="Terms of service"
              onPress={() => Linking.openURL('https://tryvisora.com/terms').catch(() => {})}
            />
            <Divider />
            <ActionRow label="Replay onboarding" onPress={handleReplayOnboarding} />
          </SettingsCard>

          {/* Sign out */}
          <Pressable
            onPress={() =>
              Alert.alert('Sign out?', 'Your data stays on this device.', [
                { text: 'Stay', style: 'cancel' },
                { text: 'Sign out', style: 'destructive', onPress: () => router.back() },
              ])
            }
            style={({ pressed }) => ({
              marginTop: 26,
              marginBottom: 12,
              alignSelf: 'center',
              paddingHorizontal: 18,
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Helpers ────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.8,
        textTransform: 'uppercase',
        color: colors.amber,
        marginTop: 22,
        marginBottom: 10,
        marginLeft: 4,
      }}
    >
      {children}
    </Text>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: 'rgba(250,246,239,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(250,246,239,0.10)',
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  );
}

function Divider() {
  return (
    <View style={{ height: 1, backgroundColor: 'rgba(250,246,239,0.08)', marginHorizontal: 14 }} />
  );
}

function InfoRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: '500',
          color: colors.cream,
          letterSpacing: -0.1,
        }}
      >
        {label}
      </Text>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 13, color: 'rgba(250,246,239,0.75)', letterSpacing: 0.1 }}>
          {value}
        </Text>
        {!!hint && (
          <Text
            style={{
              fontSize: 10,
              color: 'rgba(250,246,239,0.45)',
              letterSpacing: 0.3,
              marginTop: 1,
            }}
          >
            {hint}
          </Text>
        )}
      </View>
    </View>
  );
}

function ActionRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: '500',
          color: colors.cream,
          letterSpacing: -0.1,
        }}
      >
        {label}
      </Text>
      <Feather name="chevron-right" size={16} color="rgba(250,246,239,0.45)" />
    </Pressable>
  );
}
