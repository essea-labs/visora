// Persistent key-value storage adapter for Zustand persist middleware.
//
// Implementation note: we initially used react-native-mmkv (faster), but
// MMKV v4 ships as a Nitro Module which Expo Go doesn't support. Using
// AsyncStorage instead — slightly slower but works in Expo Go AND in EAS
// production builds. For onboarding state and auth-flag persistence this
// is plenty fast (~1ms reads, ~5ms writes on real devices).
//
// If perf becomes a real concern at scale, we can swap to MMKV behind an
// EAS dev build (Phase B.3+) without touching consumers.

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

export const storage: StateStorage = {
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  getItem: (name) => AsyncStorage.getItem(name),
  removeItem: (name) => AsyncStorage.removeItem(name),
};
