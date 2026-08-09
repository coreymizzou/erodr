import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ErodrHeader } from '@/components/ErodrHeader';
import { erodrTheme } from '@/theme/erodrTheme';

const alerts = [
  ['arrow-up', 'Your post gained 5 more minutes.', '4 min ago'],
  ['chatbubble', 'Lauren commented on your post.', '18 min ago'],
  ['time', 'One of your posts has 45 minutes left.', '1 hr ago'],
] as const;

export default function AlertsScreen() {
  return (
    <View style={styles.screen}>
      <ErodrHeader title="Notifications" />
      {alerts.map(([icon, copy, age]) => (
        <View key={copy} style={styles.row}>
          <Ionicons color={erodrTheme.colors.cyan} name={icon} size={25} />
          <View style={styles.copy}>
            <Text style={styles.text}>{copy}</Text>
            <Text style={styles.age}>{age}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#FFFFFF', flex: 1 },
  row: { alignItems: 'center', borderBottomColor: erodrTheme.colors.divider, borderBottomWidth: 1, flexDirection: 'row', minHeight: 72, paddingHorizontal: 17 },
  copy: { marginLeft: 14 },
  text: { color: erodrTheme.colors.text, fontSize: 16 },
  age: { color: erodrTheme.colors.secondaryText, fontSize: 12, marginTop: 5 },
});
