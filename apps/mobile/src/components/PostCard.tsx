import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useErodrStore } from '@/state/ErodrStore';
import { erodrTheme } from '@/theme/erodrTheme';
import type { VisiblePost } from '@/types/models';
import { Avatar } from './Avatar';

interface PostCardProps {
  post: VisiblePost;
  detail?: boolean;
}

function ageLabel(createdAt: string): string {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
}

export function PostCard({ post, detail = false }: PostCardProps) {
  const router = useRouter();
  const { vote } = useErodrStore();
  const score = post.positiveCount - post.negativeCount;
  const authorLabel = post.anonymous
    ? `Anonymous ${post.anonymousGender === 'Woman' ? 'Female' : post.anonymousGender === 'Man' ? 'Male' : 'Rodie'}`
    : post.author.displayName;
  const location = post.anonymous ? 'Some place...' : `${post.university.city}, ${post.university.state}`;
  const openDetail = () => router.push({ pathname: '/post/[id]', params: { id: post.id } });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Pressable
          disabled={post.anonymous}
          onPress={() => !post.anonymous && router.push({ pathname: '/profile/[id]', params: { id: post.author.id } })}
        >
          <Avatar anonymous={post.anonymous} profile={post.anonymous ? undefined : post.author} size={52} />
        </Pressable>
        <View style={styles.identity}>
          <Text numberOfLines={1} style={styles.author}>{authorLabel}</Text>
          <Text numberOfLines={1} style={styles.school}>{post.university.shortName}</Text>
        </View>
        <View style={styles.timeBlock}>
          <Text numberOfLines={1} style={styles.location}>{location}</Text>
          <View style={styles.ageRow}>
            <Ionicons color={erodrTheme.colors.action} name="time-outline" size={18} />
            <Text style={styles.age}>{ageLabel(post.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.notch} />
      </View>

      <Pressable disabled={detail} onPress={openDetail} style={styles.content}>
        {post.imageSource ? <Image contentFit="cover" source={post.imageSource} style={styles.photo} transition={100} /> : null}
        <View style={styles.bodyShell}>
          {score >= 35 ? <Ionicons color="#D09A19" name="trophy-outline" size={32} style={styles.trophy} /> : null}
          <Text style={styles.body}>{post.body}</Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Text style={styles.score}>{score}</Text>
        <Pressable accessibilityLabel="Positive vote" hitSlop={8} onPress={() => vote(post.id, 1)} style={styles.voteButton}>
          <Ionicons color={post.myVote === 1 ? erodrTheme.colors.historicalGreen : erodrTheme.colors.action} name="chevron-up" size={38} />
        </Pressable>
        <Pressable accessibilityLabel="Negative vote" hitSlop={8} onPress={() => vote(post.id, -1)} style={styles.voteButton}>
          <Ionicons color={post.myVote === -1 ? erodrTheme.colors.destructive : erodrTheme.colors.action} name="chevron-down" size={38} />
        </Pressable>
        <Pressable accessibilityLabel="Open comments" onPress={openDetail} style={styles.comments}>
          <Text style={styles.commentCount}>{post.responseCount}</Text>
          <Ionicons color={erodrTheme.colors.action} name="chatbubble" size={32} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: erodrTheme.colors.surface,
    borderColor: erodrTheme.colors.historicalGreen,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 13,
    marginHorizontal: 9,
    overflow: 'hidden',
  },
  headerRow: {
    alignItems: 'center',
    borderBottomColor: '#111111',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 75,
    paddingHorizontal: 11,
    paddingVertical: 8,
    zIndex: 2,
  },
  identity: { flex: 1, paddingLeft: 12, paddingRight: 5 },
  author: { color: erodrTheme.colors.author, fontFamily: erodrTheme.type.family, fontSize: 19, fontWeight: '700' },
  school: { color: erodrTheme.colors.secondaryText, fontFamily: erodrTheme.type.family, fontSize: 17, marginTop: 1 },
  timeBlock: { alignItems: 'flex-end', maxWidth: 112 },
  location: { color: erodrTheme.colors.secondaryText, fontFamily: erodrTheme.type.family, fontSize: 16 },
  ageRow: { alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: 2 },
  age: { color: erodrTheme.colors.secondaryText, fontFamily: erodrTheme.type.family, fontSize: 16 },
  notch: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#111111',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#111111',
    borderRightWidth: StyleSheet.hairlineWidth,
    bottom: -9,
    height: 18,
    left: 137,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    width: 18,
  },
  content: { backgroundColor: '#FFFFFF' },
  photo: { aspectRatio: 1.08, borderBottomColor: '#111111', borderBottomWidth: StyleSheet.hairlineWidth, width: '100%' },
  bodyShell: { minHeight: 100, paddingHorizontal: 23, paddingVertical: 27 },
  body: { color: erodrTheme.colors.text, fontFamily: erodrTheme.type.family, fontSize: 20, fontWeight: '400', lineHeight: 27 },
  trophy: { position: 'absolute', right: 21, top: 11 },
  actions: { alignItems: 'center', flexDirection: 'row', height: erodrTheme.metrics.actionRowHeight, paddingHorizontal: 24 },
  score: { color: '#3B3B3B', fontFamily: erodrTheme.type.family, fontSize: 22, fontWeight: '700', minWidth: 66 },
  voteButton: { alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  comments: { alignItems: 'center', flexDirection: 'row', gap: 17, marginLeft: 'auto' },
  commentCount: { color: '#3B3B3B', fontFamily: erodrTheme.type.family, fontSize: 17, fontWeight: '700' },
});
