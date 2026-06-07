// O01b — Name capture
// Sits between welcome and why. Just so the app knows what to call
// the user in greetings. No surname, no email, no auth — that comes
// later with Sign in with Apple (Phase B.7).

import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useProfileStore } from '@/core/stores/useProfileStore';
import { colors, spacing, radii } from '@/ui/tokens';

const NAME_MAX = 30;

export default function NameStep() {
  const router = useRouter();
  const existingName = useProfileStore((s) => s.name);
  const setName = useProfileStore((s) => s.setName);
  const [draft, setDraft] = useState(existingName);

  const trimmed = draft.trim();
  const isReady = trimmed.length > 0;

  const handleContinue = () => {
    if (!isReady) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setName(trimmed);
    router.push('/(onboarding)/why');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      {/* Same warm gradient backdrop as the other onboarding screens */}
      <LinearGradient
        colors={[colors.terraDeep + '55', 'transparent']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 380 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 22,
              paddingTop: 60,
              paddingBottom: 28,
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 10.5,
                  fontWeight: '700',
                  letterSpacing: 2.4,
                  textTransform: 'uppercase',
                  color: colors.amber,
                  marginBottom: 14,
                }}
              >
                First, your name
              </Text>

              <Text
                style={{
                  fontSize: 30,
                  lineHeight: 36,
                  letterSpacing: -0.6,
                  fontWeight: '500',
                  color: colors.cream,
                  marginBottom: 14,
                }}
              >
                What should we call you?
              </Text>

              <Text
                style={{
                  fontSize: 14.5,
                  lineHeight: 21,
                  color: 'rgba(250,246,239,0.72)',
                  marginBottom: 32,
                }}
              >
                Just so Visora can greet you. Lives on this device only.
              </Text>

              <TextInput
                autoFocus
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={handleContinue}
                placeholder="Your first name"
                placeholderTextColor="rgba(250,246,239,0.30)"
                maxLength={NAME_MAX}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                style={{
                  fontSize: 22,
                  fontWeight: '500',
                  color: colors.cream,
                  letterSpacing: -0.3,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: radii.l,
                  backgroundColor: 'rgba(250,246,239,0.06)',
                  borderWidth: 1,
                  borderColor: 'rgba(250,246,239,0.15)',
                }}
              />
            </View>

            <Pressable
              onPress={handleContinue}
              disabled={!isReady}
              style={({ pressed }) => ({
                height: 60,
                borderRadius: radii.full,
                backgroundColor: isReady
                  ? pressed
                    ? '#E8E2D5'
                    : colors.cream
                  : 'rgba(250,246,239,0.18)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.m,
              })}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: isReady ? colors.terraDeep : 'rgba(31,19,8,0.4)',
                  letterSpacing: 0.1,
                }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
