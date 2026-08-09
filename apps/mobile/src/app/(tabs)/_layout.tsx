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
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: erodrTheme.colors.surface,
          borderTopColor: erodrTheme.colors.surface,
          height: erodrTheme.metrics.tabBarHeight,
          paddingBottom: 5,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="classmates"
        options={{ tabBarAccessibilityLabel: 'Classmates', tabBarIcon: ({ color }) => <Ionicons color={color} name="power-outline" size={35} /> }}
      />
      <Tabs.Screen
        name="inbox"
        options={{ tabBarAccessibilityLabel: 'Responses', tabBarIcon: ({ color }) => <Ionicons color={color} name="chatbubbles-outline" size={34} /> }}
      />
      <Tabs.Screen
        name="compose"
        options={{ tabBarAccessibilityLabel: 'Post', tabBarIcon: ({ color }) => <Ionicons color={color} name="pencil-outline" size={35} /> }}
      />
      <Tabs.Screen
        name="alerts"
        options={{ tabBarAccessibilityLabel: 'Alerts', tabBarIcon: ({ color }) => <Ionicons color={color} name="notifications-outline" size={35} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarAccessibilityLabel: 'Profile', tabBarIcon: ({ color }) => <Ionicons color={color} name="person-outline" size={36} /> }}
      />
    </Tabs>
  );
}
