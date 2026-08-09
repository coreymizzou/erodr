import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ErodrHeader } from '@/components/ErodrHeader';
import { useErodrStore } from '@/state/ErodrStore';
import { erodrTheme } from '@/theme/erodrTheme';

function timeLabel(value: string) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60_000);
  return minutes < 60 ? `${Math.max(1, minutes)}m` : `${Math.floor(minutes / 60)}h`;
}

export default function InboxScreen() {
  const { conversations } = useErodrStore();
  return (
    <View style={styles.screen}>
      <ErodrHeader title="Chat" />
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.row}>
            <View style={styles.icon}>
              <Ionicons color="#FFFFFF" name={item.anonymousThread ? 'eye-off' : 'person'} size={23} />
            </View>
            <View style={styles.copy}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{timeLabel(item.updatedAt)}</Text>
              </View>
              <Text numberOfLines={1} style={styles.message}>{item.lastMessage}</Text>
            </View>
            {item.unread ? <View style={styles.badge}><Text style={styles.badgeText}>{item.unread}</Text></View> : null}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#FFFFFF', flex: 1 },
  row: { alignItems: 'center', borderBottomColor: erodrTheme.colors.divider, borderBottomWidth: 1, flexDirection: 'row', minHeight: 76, paddingHorizontal: 13 },
  icon: { alignItems: 'center', backgroundColor: erodrTheme.colors.cyan, borderRadius: 23, height: 46, justifyContent: 'center', width: 46 },
  copy: { flex: 1, marginLeft: 12 },
  titleRow: { flexDirection: 'row' },
  title: { color: erodrTheme.colors.author, flex: 1, fontSize: 17 },
  time: { color: erodrTheme.colors.action, fontSize: 12 },
  message: { color: erodrTheme.colors.secondaryText, fontSize: 14, marginTop: 5 },
  badge: { alignItems: 'center', backgroundColor: erodrTheme.colors.cyan, borderRadius: 11, height: 22, justifyContent: 'center', marginLeft: 8, width: 22 },
  badgeText: { color: '#FFFFFF', fontSize: 12 },
});
