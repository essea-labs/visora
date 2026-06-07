// Visora — root layout
// Sets up providers, gesture root, status bar, and the Cosmic register
// background as the app's default. Daylit screens layer over this.

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostHogProvider } from 'posthog-react-native';
import * as Sentry from '@sentry/react-native';
import 'react-native-reanimated';

import { colors } from '@/ui/tokens';

// ── Sentry crash reporting ─────────────────────────────────
// R47: wired so we catch production crashes from day one. Disabled in
// dev (we don't want our own noisy dev errors filling the project) and
// when no DSN is set, so the build doesn't blow up in environments
// missing the secret.
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
if (SENTRY_DSN && !__DEV__) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Trace 10% of transactions — enough to spot performance regressions
    // without blowing through the free-tier quota.
    tracesSampleRate: 0.1,
    // Strip identifying info from breadcrumbs by default; we'll
    // explicitly tag the user ID once Supabase auth lands (Phase B.7).
    sendDefaultPii: false,
  });
}

// ── PostHog analytics ──────────────────────────────────────
// R51: lightweight install. We just initialise the SDK; event tracking
// (ritual_completed, win_captured, vision_created, etc.) gets layered
// on later. Default host is US cloud. Disabled in dev + when no key
// set so we don't pollute the project with simulator events.
const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_ENABLED = !!POSTHOG_KEY && !__DEV__;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30s — UI feels live without thrashing the network
      gcTime: 5 * 60_000,       // 5min before cached data is GC'd
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function RootLayout() {
  return (
    <PostHogProvider
      apiKey={POSTHOG_KEY}
      options={{
        host: 'https://us.i.posthog.com',
        // `disabled: true` short-circuits all event capture. Active only
        // in production AND when a key is configured.
        disabled: !POSTHOG_ENABLED,
        // Capture app foreground / background / first-install events.
        // No PII — just lifecycle.
        captureAppLifecycleEvents: true,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cosmicA }}>
          <KeyboardProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.cosmicA },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            {/* Modal routes — sit above the tab stack */}
            <Stack.Screen
              name="ritual"
              options={{
                presentation: 'fullScreenModal',
                animation: 'fade',
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="capture-win"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="reading"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="wisdom"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="win-detail"
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="vision-area-sheet"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="vision-detail"
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="vision-celebrate"
              options={{
                presentation: 'fullScreenModal',
                animation: 'fade',
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="vision-archive"
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="profile"
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
          </Stack>
            <StatusBar style="light" />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </PostHogProvider>
  );
}

// Sentry.wrap adds an error boundary that catches React render errors
// and reports them. No-op when Sentry.init wasn't called (dev / missing DSN).
export default Sentry.wrap(RootLayout);
