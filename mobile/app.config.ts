// Visora — Expo config
// Variant-aware: dev / preview / production builds get distinct bundle IDs
// so they can install side-by-side during development.
//
// R48: rebranded from Innerproof. Tagline shipped everywhere is
// "Become who you envision." Brand vision is "Practice becoming. Daily."
import type { ExpoConfig, ConfigContext } from 'expo/config';

type Variant = 'development' | 'preview' | 'production';
const variant: Variant = (process.env.APP_VARIANT as Variant) ?? 'production';

const baseBundleId = 'com.essealabs.visora';
const bundleId =
  variant === 'development' ? `${baseBundleId}.dev`
  : variant === 'preview'   ? `${baseBundleId}.preview`
  : baseBundleId;

const appName =
  variant === 'development' ? 'Visora Dev'
  : variant === 'preview'   ? 'Visora Preview'
  : 'Visora';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: 'visora',
  version: '0.13.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'visora',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,

  ios: {
    bundleIdentifier: bundleId,
    supportsTablet: false,
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      // Background audio for the morning ritual
      UIBackgroundModes: ['audio'],
      // Photos for vision board + win capture
      NSPhotoLibraryUsageDescription:
        'Visora needs access to your photos so you can choose them for your vision board and capture them with your wins.',
      NSPhotoLibraryAddUsageDescription:
        'Save photos you capture for your wins.',
    },
    // Universal Links — for deep linking back into Visora from the marketing site
    associatedDomains: ['applinks:tryvisora.com'],
  },

  android: {
    package: bundleId,
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      backgroundColor: '#2A1F15', // cosmic-a
      foregroundImage: './assets/images/android-icon-foreground.png',
    },
  },

  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2A1F15', // cosmic-a (dark warm)
        image: './assets/images/splash-icon.png',
        imageWidth: 120,
        dark: {
          backgroundColor: '#2A1F15',
        },
      },
    ],
    'expo-apple-authentication',
    'expo-secure-store',
    [
      'expo-image-picker',
      {
        photosPermission:
          'Visora needs access to your photos so you can choose them for your vision board.',
      },
    ],
    [
      'expo-notifications',
      {
        sounds: [],
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },

  // Runtime config — read via Constants.expoConfig.extra
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    revenueCatPublicKey: process.env.EXPO_PUBLIC_REVENUECAT_KEY,
    posthogApiKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    appVariant: variant,
    eas: {
      projectId: process.env.EAS_PROJECT_ID, // filled in by `eas init`
    },
  },
});
