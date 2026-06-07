// O-Paywall — hard paywall, last step before the user enters the app.
//
// Position in flow: build-board → PAYWALL → complete.
//
// Hard paywall behaviour: no skip button. Apple App Review requires the
// three text links at the bottom (Restore / Terms / Privacy) and a way
// to exit the screen — we provide an unobtrusive × that closes the
// onboarding stack (user lands back at welcome on next launch since
// they're not onboarded).
//
// The subscribe action is currently a stub that flips the
// useSubscriptionStore flag and advances to /complete. When RevenueCat
// is wired (Phase B.8), replace `startTrial(plan)` with the real
// purchase flow + entitlement check.

import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';

import { useSubscriptionStore } from '@/core/stores/useSubscriptionStore';
import { colors } from '@/ui/tokens';

type Plan = 'yearly' | 'monthly';

const PRICES = {
  yearly: { display: '$29.00', period: '/ year', subtitle: '$2.42 / mo, save 19%' },
  monthly: { display: '$2.99', period: '/ month', subtitle: 'Cancel anytime' },
};

// Round 17: trimmed from 6 feature-y bullets to 4 outcome-focused value
// props. Each speaks to a transformation, not a feature list.
const FEATURES = [
  'A 3 minute daily ritual to embody your future self',
  'A vision board that grows with every win you capture',
  'Affirmations tuned to who you want to become',
  'Every win kept as evidence, your timeline of becoming',
];

export default function Paywall() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const startTrial = useSubscriptionStore((s) => s.startTrial);
  const restore = useSubscriptionStore((s) => s.restore);
  const [plan, setPlan] = useState<Plan>('yearly');

  const handleStart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Stub: flip the local entitlement flag. Real RevenueCat trial-start
    // call replaces this in Phase B.8.
    startTrial(plan);
    router.replace('/(onboarding)/complete');
  };

  const handleRestore = async () => {
    const ok = await restore();
    if (ok) {
      router.replace('/(onboarding)/complete');
    } else {
      Alert.alert(
        'No purchases found',
        "We couldn't find an active subscription on this Apple ID.",
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      {/* Atmospheric photo backdrop + dark gradient overlay */}
      <Image
        source={require('@/assets/images/library/hero-warm-bright.jpg')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 360 }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          'rgba(20,12,6,0.40)',
          'rgba(20,12,6,0.55)',
          colors.cosmicA,
          colors.cosmicA,
        ]}
        locations={[0, 0.35, 0.7, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Subtle × top-right — required by App Review */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 18,
            paddingTop: 6,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => ({
              width: 32,
              height: 32,
              borderRadius: 999,
              backgroundColor: 'rgba(20,12,6,0.5)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 0.7,
            })}
          >
            <Feather name="x" size={16} color={colors.cream} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 26,
            paddingTop: 24,
            paddingBottom: 24 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Eyebrow + hero copy */}
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '700',
              letterSpacing: 2.4,
              textTransform: 'uppercase',
              color: colors.amber,
              marginBottom: 12,
            }}
          >
            Visora · Full access
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '500',
              color: colors.cream,
              letterSpacing: -0.6,
              lineHeight: 34,
              marginBottom: 12,
            }}
          >
            Become who you{' '}
            <Text style={{ fontStyle: 'italic', fontWeight: '400', color: colors.terraLight }}>
              envision.
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 14.5,
              lineHeight: 21,
              color: 'rgba(250,246,239,0.78)',
              marginBottom: 28,
              maxWidth: 320,
            }}
          >
            Try Visora free for 7 days. Build a canvas of who you want to become, then capture the evidence: small wins, daily.
          </Text>

          {/* Feature list */}
          <View
            style={{
              padding: 18,
              borderRadius: 16,
              backgroundColor: 'rgba(250,246,239,0.05)',
              borderWidth: 1,
              borderColor: 'rgba(250,246,239,0.10)',
              gap: 12,
              marginBottom: 24,
            }}
          >
            {FEATURES.map((f, i) => (
              <View
                key={i}
                style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    backgroundColor: colors.amber + '26',
                    borderWidth: 1,
                    borderColor: colors.amber + '70',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 1,
                  }}
                >
                  <Feather name="check" size={11} color={colors.amber} />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 13.5,
                    color: colors.cream,
                    lineHeight: 19,
                    letterSpacing: -0.1,
                  }}
                >
                  {f}
                </Text>
              </View>
            ))}
          </View>

          {/* Plan toggle */}
          <PlanCard
            value="yearly"
            active={plan === 'yearly'}
            onSelect={() => setPlan('yearly')}
            badge="Best value · 7 day free trial"
          />
          <PlanCard
            value="monthly"
            active={plan === 'monthly'}
            onSelect={() => setPlan('monthly')}
          />

          {/* CTA */}
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => ({
              marginTop: 22,
              height: 58,
              borderRadius: 999,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.92 : 1,
              overflow: 'hidden',
              shadowColor: colors.terra,
              shadowOpacity: 0.55,
              shadowRadius: 30,
              shadowOffset: { width: 0, height: 14 },
              elevation: 8,
            })}
          >
            <LinearGradient
              colors={[colors.terra, colors.terraDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <Text
              style={{
                color: colors.cream,
                fontSize: 16,
                fontWeight: '600',
                letterSpacing: 0.2,
              }}
            >
              {plan === 'yearly' ? 'Start 7 day free trial' : 'Subscribe monthly'}
            </Text>
          </Pressable>

          <Text
            style={{
              marginTop: 12,
              textAlign: 'center',
              fontSize: 11,
              color: 'rgba(250,246,239,0.45)',
              lineHeight: 16,
            }}
          >
            {plan === 'yearly'
              ? 'Free for 7 days, then $29.00/year. Cancel anytime in Settings.'
              : '$2.99 per month. Cancel anytime in Settings.'}
          </Text>

          {/* Footer links — required by store policy */}
          <View
            style={{
              marginTop: 22,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 14,
            }}
          >
            <FooterLink label="Restore" onPress={handleRestore} />
            <FooterDot />
            <FooterLink
              label="Terms"
              onPress={() => Linking.openURL('https://tryvisora.com/terms').catch(() => {})}
            />
            <FooterDot />
            <FooterLink
              label="Privacy"
              onPress={() => Linking.openURL('https://tryvisora.com/privacy').catch(() => {})}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Plan card ───────────────────────────────────────────
function PlanCard({
  value,
  active,
  onSelect,
  badge,
}: {
  value: Plan;
  active: boolean;
  onSelect: () => void;
  badge?: string;
}) {
  const price = PRICES[value];
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => ({
        marginTop: 10,
        padding: 16,
        borderRadius: 14,
        backgroundColor: active
          ? 'rgba(216,154,90,0.18)'
          : 'rgba(250,246,239,0.04)',
        borderWidth: 1.5,
        borderColor: active ? colors.amber : 'rgba(250,246,239,0.12)',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {badge && (
        <View
          style={{
            position: 'absolute',
            top: -10,
            left: 16,
            paddingHorizontal: 8,
            height: 20,
            borderRadius: 999,
            backgroundColor: colors.amber,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 9,
              fontWeight: '700',
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: '#2A1F15',
            }}
          >
            {badge}
          </Text>
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {/* Radio dot */}
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            borderWidth: 1.5,
            borderColor: active ? colors.amber : 'rgba(250,246,239,0.35)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {active && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: colors.amber,
              }}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.cream,
              letterSpacing: -0.1,
              textTransform: 'capitalize',
            }}
          >
            {value}
          </Text>
          <Text
            style={{
              fontSize: 11.5,
              color: 'rgba(250,246,239,0.6)',
              letterSpacing: 0.2,
              marginTop: 1,
            }}
          >
            {price.subtitle}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: colors.cream,
              letterSpacing: -0.3,
            }}
          >
            {price.display}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: 'rgba(250,246,239,0.5)',
              letterSpacing: 0.4,
              marginTop: 1,
            }}
          >
            {price.period}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function FooterLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={6}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: 'rgba(250,246,239,0.55)',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FooterDot() {
  return (
    <Text style={{ color: 'rgba(250,246,239,0.3)', fontSize: 11 }}>·</Text>
  );
}
