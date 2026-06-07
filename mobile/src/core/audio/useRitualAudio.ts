// useRitualAudio — wraps expo-av so the ritual screen can play the
// ritual voice with full controls (play/pause/volume/seek).
//
// Behaviour:
//   • Loads the asset on mount, unloads on unmount.
//   • Configures the audio session so the voice keeps playing when the
//     phone is silent or face-down (matches the contemplative intent).
//   • Exposes a tiny state surface (isPlaying, position, duration, volume)
//     and three actions (play, pause, setVolume).

import { useEffect, useRef, useState } from 'react';
import { Audio, type AVPlaybackStatus } from 'expo-av';
import { ritualVoiceForDate, type RitualVoice } from './ritualVoice';

export interface RitualAudioState {
  /** The ritual voice. Kept on the surface for QA/debug display. */
  variant: RitualVoice;
  /** True once the asset has finished loading. */
  isLoaded: boolean;
  /** True while the asset is actively playing. */
  isPlaying: boolean;
  /** Playback position in milliseconds. */
  positionMs: number;
  /** Total clip duration in milliseconds (0 until loaded). */
  durationMs: number;
  /** Current volume 0–1. */
  volume: number;
  /** True if the asset finished playing (reached the end). */
  didFinish: boolean;

  play: () => Promise<void>;
  pause: () => Promise<void>;
  setVolume: (v: number) => Promise<void>;
  /** Seek to position (in ms). Useful for restart-from-zero. */
  seekTo: (positionMs: number) => Promise<void>;
}

export function useRitualAudio(): RitualAudioState {
  const variant = ritualVoiceForDate();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [didFinish, setDidFinish] = useState(false);

  // Load on mount, unload on unmount.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // Configure audio session so playback persists with silent switch on,
        // keeps playing in background, ducks other audio gracefully.
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false, // can be flipped on later when we add a play-from-lock-screen flow
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound, status } = await Audio.Sound.createAsync(
          variant.source,
          { shouldPlay: false, volume: 1 },
          onPlaybackStatusUpdate,
        );

        if (cancelled) {
          sound.unloadAsync().catch(() => {});
          return;
        }

        soundRef.current = sound;
        if (status.isLoaded) {
          setDurationMs(status.durationMillis ?? 0);
        }
        setIsLoaded(true);
      } catch (err) {
        // Asset missing or load failure — leave isLoaded false so the
        // UI can show a graceful fallback (no controls).
        // eslint-disable-next-line no-console
        console.warn('[ritual audio] load failed', err);
      }
    };

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      if (cancelled) return;
      if (!status.isLoaded) return;
      setIsPlaying(status.isPlaying);
      setPositionMs(status.positionMillis ?? 0);
      if (status.durationMillis) setDurationMs(status.durationMillis);
      if (status.didJustFinish) setDidFinish(true);
    };

    load();

    return () => {
      cancelled = true;
      const s = soundRef.current;
      soundRef.current = null;
      if (s) {
        s.unloadAsync().catch(() => {});
      }
    };
    // Only re-load if the chosen variant changes (essentially: only on
    // the first mount). Variant is derived from today's date so it's
    // stable within a session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant.source]);

  const play = async () => {
    const s = soundRef.current;
    if (!s) return;
    setDidFinish(false);
    if (positionMs >= durationMs && durationMs > 0) {
      await s.setPositionAsync(0);
    }
    await s.playAsync();
  };

  const pause = async () => {
    const s = soundRef.current;
    if (!s) return;
    await s.pauseAsync();
  };

  const setVolume = async (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    const s = soundRef.current;
    if (!s) return;
    await s.setVolumeAsync(clamped);
  };

  const seekTo = async (ms: number) => {
    const s = soundRef.current;
    if (!s) return;
    await s.setPositionAsync(Math.max(0, Math.min(ms, durationMs)));
  };

  return {
    variant,
    isLoaded,
    isPlaying,
    positionMs,
    durationMs,
    volume,
    didFinish,
    play,
    pause,
    setVolume,
    seekTo,
  };
}
