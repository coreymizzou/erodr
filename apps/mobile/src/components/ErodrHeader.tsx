import { Ionicons } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { erodrTheme } from '@/theme/erodrTheme';

interface ErodrHeaderProps {
  title: string;
  right?: ReactNode;
  onBack?: () => void;
}

export function ErodrHeader({ title, right, onBack }: ErodrHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.shell, { paddingTop: insets.top, height: 58 + insets.top }]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable accessibilityLabel="Back" hitSlop={12} onPress={onBack}>
            <Ionicons color={erodrTheme.colors.historicalGreen} name="chevron-back" size={31} />
          </Pressable>
        ) : null}
      </View>
      <Text numberOfLines={1} style={styles.title}>{title}</Text>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'center',
    backgroundColor: erodrTheme.colors.surface,
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  side: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 56,
  },
  right: { alignItems: 'flex-end' },
  title: {
    color: erodrTheme.colors.black,
    flex: 1,
    fontFamily: erodrTheme.type.family,
    fontSize: erodrTheme.type.title,
    fontWeight: '600',
    textAlign: 'center',
  },
});
