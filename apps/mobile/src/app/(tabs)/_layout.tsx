import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { erodrTheme } from '@/theme/erodrTheme';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="classmates"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: erodrTheme.colors.selectedTabCyan,
        tabBarInactiveTintColor: erodrTheme.colors.inactiveTab,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontFamily: erodrTheme.type.family, fontSize: 12, marginTop: -3 },
        tabBarStyle: {
          backgroundColor: erodrTheme.colors.surface,
          borderTopColor: '#B8B8B8',
          height: erodrTheme.metrics.tabBarHeight,
          paddingBottom: 3,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="classmates"
        options={{ title: 'Streamer', tabBarAccessibilityLabel: 'Streamer', tabBarIcon: ({ color }) => <Ionicons color={color} name="home" size={34} /> }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: 'Map', tabBarAccessibilityLabel: 'Map', tabBarIcon: ({ color }) => <Ionicons color={color} name="location" size={33} /> }}
      />
      <Tabs.Screen
        name="compose"
        options={{ title: 'Post', tabBarAccessibilityLabel: 'Post', tabBarIcon: ({ color }) => <Ionicons color={color} name="create-outline" size={35} /> }}
      />
      <Tabs.Screen
        name="inbox"
        options={{ title: 'Chat', tabBarAccessibilityLabel: 'Chat', tabBarIcon: ({ color }) => <Ionicons color={color} name="chatbubbles" size={34} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons color={color} name="person" size={35} />,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen name="alerts" options={{ href: null }} />
    </Tabs>
  );
}
