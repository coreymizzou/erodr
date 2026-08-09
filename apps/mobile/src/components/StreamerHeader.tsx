import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { erodrTheme } from '@/theme/erodrTheme';

interface StreamerHeaderProps {
  onStreams: () => void;
  onNotifications: () => void;
}

export function StreamerHeader({ onStreams, onNotifications }: StreamerHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { height: 65 + insets.top, paddingTop: insets.top }]}>
      <Pressable accessibilityLabel="Choose stream" hitSlop={12} onPress={onStreams} style={styles.side}>
        <Ionicons color={erodrTheme.colors.historicalGreen} name="school" size={31} />
      </Pressable>
      <Text accessibilityRole="header" style={styles.wordmark}>erodr</Text>
      <Pressable accessibilityLabel="Notifications" hitSlop={12} onPress={onNotifications} style={[styles.side, styles.right]}>
        <Ionicons color={erodrTheme.colors.black} name="notifications-outline" size={30} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: erodrTheme.colors.surface,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  side: { alignItems: 'flex-start', justifyContent: 'center', width: 54 },
  right: { alignItems: 'flex-end' },
  wordmark: {
    color: '#333333',
    flex: 1,
    fontFamily: erodrTheme.type.family,
    fontSize: 43,
    fontWeight: '200',
    letterSpacing: -1.8,
    lineHeight: 49,
    textAlign: 'center',
  },
});
