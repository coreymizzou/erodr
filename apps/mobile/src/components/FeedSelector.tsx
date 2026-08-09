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
    paddingHorizontal: 7,
    paddingVertical: 10,
  },
  control: {
    borderColor: erodrTheme.colors.cyan,
    borderRadius: 7,
    borderWidth: 1.5,
    flexDirection: 'row',
    height: 39,
    overflow: 'hidden',
  },
  segment: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  selected: { backgroundColor: erodrTheme.colors.cyan },
  label: {
    color: erodrTheme.colors.cyan,
    fontFamily: erodrTheme.type.family,
    fontSize: erodrTheme.type.segment,
    fontWeight: '300',
  },
  selectedLabel: { color: erodrTheme.colors.surface, fontWeight: '400' },
});
