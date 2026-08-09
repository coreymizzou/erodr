import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { ErodrHeader } from '@/components/ErodrHeader';
import { FeedSelector } from '@/components/FeedSelector';
import { PostCard } from '@/components/PostCard';
import { useErodrStore } from '@/state/ErodrStore';
import { erodrTheme } from '@/theme/erodrTheme';

export default function ClassmatesScreen() {
  const { feedOrder, getFeed, setFeedOrder } = useErodrStore();
  const [refreshing, setRefreshing] = useState(false);
  const [feed, setFeed] = useState<'classmates' | 'ticker' | 'national'>('classmates');
  const [showFeeds, setShowFeeds] = useState(false);
  const posts = getFeed(feed);
  const title = feed === 'classmates' ? 'Classmates' : feed === 'ticker' ? 'Anonymous Ticker' : 'National Posts';

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 450);
  };

  return (
    <View style={styles.screen}>
      <ErodrHeader
        right={(
          <Pressable
            accessibilityLabel="Feed filters"
            hitSlop={12}
            onPress={() => setShowFeeds(true)}
          >
            <Ionicons color="#FFFFFF" name="options-outline" size={32} />
          </Pressable>
        )}
        title={title}
      />
      <FeedSelector onChange={setFeedOrder} value={feedOrder} />
      <FlatList
        contentContainerStyle={styles.content}
        data={posts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl onRefresh={refresh} refreshing={refreshing} tintColor={erodrTheme.colors.cyan} />}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
      />
      <Modal animationType="fade" onRequestClose={() => setShowFeeds(false)} transparent visible={showFeeds}>
        <Pressable onPress={() => setShowFeeds(false)} style={styles.modalBackdrop}>
          <View style={styles.feedMenu}>
            <Text style={styles.menuTitle}>STREAMS</Text>
            {([
              ['classmates', 'Classmates', 'Validated Mizzou rodies nearby'],
              ['ticker', 'Anonymous Ticker', 'Anonymous posts from every college'],
              ['national', 'National Posts', 'Top identified posts nationwide'],
            ] as const).map(([value, label, detail]) => (
              <Pressable
                key={value}
                onPress={() => { setFeed(value); setShowFeeds(false); }}
                style={[styles.menuRow, feed === value && styles.activeMenuRow]}
              >
                <View style={styles.menuCopy}>
                  <Text style={[styles.menuLabel, feed === value && styles.activeMenuLabel]}>{label}</Text>
                  <Text style={styles.menuDetail}>{detail}</Text>
                </View>
                {feed === value ? <Ionicons color={erodrTheme.colors.cyan} name="checkmark" size={24} /> : null}
              </Pressable>
            ))}
            <Text style={styles.rangeNote}>Streamer range: 5 miles · All rodies</Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: erodrTheme.colors.feedGutter, flex: 1 },
  content: { paddingBottom: 7 },
  modalBackdrop: { backgroundColor: 'rgba(0,0,0,0.34)', flex: 1, justifyContent: 'flex-start', paddingTop: 110 },
  feedMenu: { backgroundColor: '#FFFFFF', marginHorizontal: 18, shadowColor: '#000000', shadowOpacity: 0.25, shadowRadius: 8 },
  menuTitle: { backgroundColor: erodrTheme.colors.selectorBackground, color: erodrTheme.colors.secondaryText, fontSize: 11, letterSpacing: 1, paddingHorizontal: 14, paddingVertical: 8 },
  menuRow: { alignItems: 'center', borderBottomColor: erodrTheme.colors.divider, borderBottomWidth: 1, flexDirection: 'row', minHeight: 67, paddingHorizontal: 14 },
  activeMenuRow: { borderLeftColor: erodrTheme.colors.cyan, borderLeftWidth: 3, paddingLeft: 11 },
  menuCopy: { flex: 1 },
  menuLabel: { color: erodrTheme.colors.text, fontSize: 17 },
  activeMenuLabel: { color: erodrTheme.colors.cyan },
  menuDetail: { color: erodrTheme.colors.secondaryText, fontSize: 12, marginTop: 3 },
  rangeNote: { color: erodrTheme.colors.secondaryText, fontSize: 12, padding: 13, textAlign: 'center' },
});
