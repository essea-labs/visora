// Main app tab bar — Round 12: "Today" → "Home" (one screen-name to
// match the broader scope of what now lives there: ritual, affirmations,
// and quote).
//
// Round 7: bumped the 3D feel. The bar now reads as a raised panel
// jutting up from the screen — strong upward shadow, brighter top
// highlight, and a subtle vertical gradient inside the bar. Active
// icon gets an amber glow.

import { Tabs } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/ui/tokens';

/**
 * Tab-bar background — a soft vertical gradient sits behind the
 * frosted-dark plate so the top edge reads as a highlight and the
 * bottom recedes. Combined with the upward shadow on `tabBarStyle`,
 * the bar feels raised off the screen.
 */
function TabBarBackground() {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(20,12,6,0.94)' }}>
      <LinearGradient
        colors={[
          'rgba(250,246,239,0.08)',
          'rgba(250,246,239,0.02)',
          'rgba(20,12,6,0)',
        ]}
        locations={[0, 0.35, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.amber,
        tabBarInactiveTintColor: 'rgba(250,246,239,0.55)',
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          // Bar is transparent — the gradient + dark plate live in the
          // tabBarBackground component above.
          backgroundColor: 'transparent',
          borderTopColor: 'rgba(250,246,239,0.16)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          // Upward shadow (negative height offset = shadow above the bar)
          // makes the bar look like it's lifted off the screen.
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.45,
          shadowRadius: 24,
          elevation: 24,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                shadowColor: colors.amber,
                shadowOpacity: focused ? 0.7 : 0,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 0 },
              }}
            >
              <Feather name="sun" size={size - 2} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="vision"
        options={{
          title: 'Vision',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                shadowColor: colors.amber,
                shadowOpacity: focused ? 0.7 : 0,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 0 },
              }}
            >
              <Feather name="compass" size={size - 2} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wins"
        options={{
          title: 'Wins',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                shadowColor: colors.amber,
                shadowOpacity: focused ? 0.7 : 0,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 0 },
              }}
            >
              <Feather name="anchor" size={size - 2} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
