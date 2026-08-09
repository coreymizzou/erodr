import { Pressable, StyleSheet, Text, View } from 'react-native';

import { erodrTheme } from '@/theme/erodrTheme';

type FeedOrder = 'popular' | 'recent' | 'nearest';

interface FeedSelectorProps {
  value: FeedOrder;
  onChange: (value: FeedOrder) => void;
}

const options: { label: string; value: FeedOrder }[] = [
  { label: 'Popular', value: 'popular' },
  { label: 'Recent', value: 'recent' },
  { label: 'Nearest', value: 'nearest' },
];

export function FeedSelector({ value, onChange }: FeedSelectorProps) {
  return (
    <View style={styles.background}>
      <View style={styles.control}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.segment, selected && styles.selected]}
            >
              <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: erodrTheme.colors.selectorBackground,
    borderBottomColor: '#AFAFAF',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  control: {
    flexDirection: 'row',
    height: 49,
  },
  segment: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  selected: { backgroundColor: erodrTheme.colors.surface },
  label: {
    color: erodrTheme.colors.black,
    fontFamily: erodrTheme.type.family,
    fontSize: erodrTheme.type.segment,
    fontWeight: '400',
  },
  selectedLabel: { color: erodrTheme.colors.historicalGreen, fontWeight: '400' },
});
