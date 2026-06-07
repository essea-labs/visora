// Morning ritual — round 11 audio-first redesign.
//
// The previous 5-beat timer flow fought with the audio narration. The new
// flow is audio-driven, Calm/Waking-Up-style: photo backdrop, breathing
// orb centered, big play in the middle-bottom, scrubber + 15s skip
// controls above it. The audio IS the experience. No per-beat text
// changes.
//
// When the audio finishes, we transition to the Anchor screen — the user
// types their intention, taps Continue, and the ritual completes.
//
// Today's voice variant is picked by useRitualAudio() (Mon→1 … Fri→5,
// weekend wraps) and shown in the small "Wednesday · Dorothy" pill at
// the top so the user knows which voice they're listening to.

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';

import { CosmicBackground } from '@/ui/components/CosmicBackground';
import { BreathingOrb } from '@/ui/components/BreathingOrb';
import { PrimaryCta } from '@/ui/components/PrimaryCta';
import { useDailyStore } from '@/core/stores/useDailyStore';
import { useVisionAreasStore } from '@/core/stores/useVisionAreasStore';
import { photoById } from '@/core/constants/photoLibrary';
import { useRitualAudio } from '@/core/audio/useRitualAudio';
import { colors, radii, typography } from '@/ui/tokens';

type Phase = 'listen' | 'anchor';

const SKIP_MS = 15_000;

export default function Ritual() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('listen');

  const previousIntention = useDailyStore((s) => s.intentionText);
  const completeRitual = useDailyStore((s) => s.completeRitual);
  const setStoredIntention = useDailyStore((s) => s.setIntention);
  const visions = useVisionAreasStore((s) => s.visions);

  const [intention, setIntention] = useState(previousIntention);

  // R46: backdrop now pulls from the user's vision photos directly
  // (was reading from useOnboardingStore.selectedPhotoIds which
  // belonged to the deprecated photos.tsx onboarding screen — that
  // store path stayed empty in the v2 flow, leaving the ritual with
  // no backdrop). Picks the first active vision's first photo.
  const backdrop = (() => {
    for (const v of visions) {
      if (v.completedAt) continue;
      const firstPhoto = v.photos?.[0];
      if (firstPhoto?.uri) return { uri: firstPhoto.uri };
      if (firstPhoto?.libraryId) {
        const p = photoById(firstPhoto.libraryId);
        if (p) return p.source;
      }
    }
    return null;
  })();

  // Voice playback. Auto-plays once loaded; transitions to the anchor
  // phase when the clip finishes.
  const audio = useRitualAudio();
  useEffect(() => {
    if (audio.isLoaded && !audio.isPlaying && !audio.didFinish && phase === 'listen') {
      audio.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.isLoaded]);

  useEffect(() => {
    if (audio.didFinish && phase === 'listen') {
      // Audio's done — let the user type their intention.
      Haptics.selectionAsync();
      setPhase('anchor');
    }
  }, [audio.didFinish, phase]);

  const handleExit = () => {
    Alert.alert(
      'Exit the ritual?',
      "You can pick up tomorrow morning. Today's progress won't be saved.",
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            audio.pause().catch(() => {});
            router.back();
          },
        },
      ],
    );
  };

  const finish = () => {
    if (intention.trim()) setStoredIntention(intention.trim());
    completeRitual();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)/home');
  };

  const togglePlay = () => {
    if (!audio.isLoaded) return;
    Haptics.selectionAsync();
    if (audio.isPlaying) audio.pause();
    else audio.play();
  };

  const skipBack = () => {
    if (!audio.isLoaded) return;
    Haptics.selectionAsync();
    audio.seekTo(Math.max(0, audio.positionMs - SKIP_MS));
  };

  const skipForward = () => {
    if (!audio.isLoaded) return;
    Haptics.selectionAsync();
    audio.seekTo(audio.positionMs + SKIP_MS);
  };

  // mm:ss formatter
  const fmt = (ms: number): string => {
    const total = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // R42: variantLabel was here ("Mon · Lily" etc.) for the pill. Removed
  // since we only have one variant until the July 3 quota reset.

  // ── LISTEN phase ────────────────────────────────────────────
  if (phase === 'listen') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
        {backdrop && (
          <Image
            source={backdrop}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.32,
            }}
            resizeMode="cover"
            blurRadius={6}
          />
        )}
        <CosmicBackground variant="default">
          <SafeAreaView style={{ flex: 1 }}>
            {/* Top chrome — × close only.
                R42: the day · voice variant pill was removed because we
                only play one voice (Daniel) until the ElevenLabs free
                quota resets July 3. Once we have all 5 variants again
                with the new "you" script, restore the pill — see git
                history for the previous markup. */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 6,
              }}
            >
              <ChromeIconButton onPress={handleExit} />
            </View>

            {/* Center: breathing orb + "now playing" line */}
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 32,
                gap: 36,
              }}
            >
              <BreathingOrb size="hero" amplitude={0.5} />
              <View style={{ alignItems: 'center', gap: 8 }}>
                <Text
                  style={{
                    fontSize: 10.5,
                    fontWeight: '700',
                    letterSpacing: 2.2,
                    textTransform: 'uppercase',
                    color: colors.amber,
                  }}
                >
                  Now playing
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontStyle: 'italic',
                    color: colors.cream,
                    letterSpacing: -0.3,
                    lineHeight: 28,
                    textAlign: 'center',
                    maxWidth: 280,
                  }}
                >
                  Picture who you want to become.
                </Text>
              </View>
            </View>

            {/* Bottom controls — scrubber + 15s back / play / 15s fwd */}
            <View style={{ paddingHorizontal: 28, paddingBottom: 28 }}>
              {/* Scrubber */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: 'rgba(250,246,239,0.65)',
                    letterSpacing: 0.4,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {fmt(audio.positionMs)}
                </Text>
                <Slider
                  style={{ flex: 1, height: 18 }}
                  minimumValue={0}
                  maximumValue={Math.max(1, audio.durationMs)}
                  value={Math.min(audio.positionMs, audio.durationMs)}
                  onSlidingComplete={(v) => audio.seekTo(v)}
                  minimumTrackTintColor={colors.cream}
                  maximumTrackTintColor="rgba(250,246,239,0.18)"
                  thumbTintColor={colors.cream}
                  disabled={!audio.isLoaded}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: 'rgba(250,246,239,0.4)',
                    letterSpacing: 0.4,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {fmt(audio.durationMs)}
                </Text>
              </View>

              {/* Control row */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 18,
                }}
              >
                <ControlButton
                  icon="rotate-ccw"
                  onPress={skipBack}
                  disabled={!audio.isLoaded}
                  label="15"
                />
                <PlayPauseButton
                  isPlaying={audio.isPlaying}
                  onPress={togglePlay}
                  disabled={!audio.isLoaded}
                />
                <ControlButton
                  icon="rotate-cw"
                  onPress={skipForward}
                  disabled={!audio.isLoaded}
                  label="15"
                />
              </View>
            </View>
          </SafeAreaView>
        </CosmicBackground>
      </View>
    );
  }

  // ── ANCHOR phase ────────────────────────────────────────────
  // After the audio finishes, the user types their intention.
  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      <CosmicBackground variant="terra">
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 12,
            }}
          >
            <ChromeIconButton onPress={handleExit} />
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: '700',
                letterSpacing: 2.2,
                textTransform: 'uppercase',
                color: colors.amber,
              }}
            >
              Anchor it
            </Text>
            <View style={{ width: 38 }} />
          </View>

          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 32,
              paddingTop: 30,
              paddingBottom: 30,
            }}
            keyboardShouldPersistTaps="handled"
            bottomOffset={120}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: '500',
                color: colors.cream,
                letterSpacing: -0.6,
                lineHeight: 32,
                marginBottom: 14,
              }}
            >
              Write today's intention.
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'rgba(250,246,239,0.7)',
                lineHeight: 21,
                marginBottom: 26,
              }}
            >
              One sentence. Use "I am" — like an affirmation.
            </Text>
            <View
              style={{
                padding: 18,
                borderRadius: radii.l,
                backgroundColor: 'rgba(250,246,239,0.06)',
                borderWidth: 1,
                borderColor: colors.amber + '55',
              }}
            >
              <TextInput
                autoFocus
                value={intention}
                onChangeText={setIntention}
                placeholder="I am building what I'm proud of."
                placeholderTextColor="rgba(250,246,239,0.4)"
                multiline
                maxLength={140}
                style={{
                  fontSize: 17,
                  color: colors.cream,
                  lineHeight: 24,
                  fontStyle: intention ? 'italic' : 'normal',
                  letterSpacing: -0.2,
                  padding: 0,
                  minHeight: 80,
                }}
                textAlignVertical="top"
              />
            </View>
          </KeyboardAwareScrollView>

          <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
            <PrimaryCta
              label="Complete the ritual"
              onPress={finish}
              disabled={intention.trim().length < 2}
            />
          </KeyboardStickyView>
        </SafeAreaView>
      </CosmicBackground>
    </View>
  );
}

// ─── Top-chrome × close button ──────────────────────────────
// Round 26: extracted into its own component so LISTEN and ANCHOR
// phases use the exact same shape, position, and styling. Matches
// the back-button pattern used across Settings, Vision Detail, and
// Win Detail so the user's eye doesn't have to relearn where to tap.
function ChromeIconButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
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
      <Feather name="x" size={18} color={colors.cream} />
    </Pressable>
  );
}

// ─── Side control button (15s skip back / fwd) ──────────────
function ControlButton({
  icon,
  onPress,
  disabled,
  label,
}: {
  icon: 'rotate-ccw' | 'rotate-cw';
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      style={({ pressed }) => ({
        width: 56,
        height: 56,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.35 : pressed ? 0.55 : 1,
      })}
    >
      <Feather name={icon} size={28} color="rgba(250, 246, 239, 0.85)" />
      {label && (
        <Text
          style={{
            position: 'absolute',
            top: 22,
            fontSize: 9,
            fontWeight: '700',
            color: 'rgba(250, 246, 239, 0.85)',
            letterSpacing: 0.3,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// ─── Big play/pause in the middle ────────────────────────────
function PlayPauseButton({
  isPlaying,
  onPress,
  disabled,
}: {
  isPlaying: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      style={({ pressed }) => ({
        width: 84,
        height: 84,
        borderRadius: 999,
        backgroundColor: 'rgba(250,246,239,0.94)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.45,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 14 },
        elevation: 12,
        opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
      })}
    >
      <Feather
        name={isPlaying ? 'pause' : 'play'}
        size={34}
        color={colors.ink}
        style={{ marginLeft: isPlaying ? 0 : 4 }}
      />
    </Pressable>
  );
}
