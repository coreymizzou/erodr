import { formatRemaining, remainingFraction } from '@erodr/domain';
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
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} hr ago` : `${Math.floor(hours / 24)} d ago`;
}

export function PostCard({ post, detail = false }: PostCardProps) {
  const router = useRouter();
  const { vote } = useErodrStore();
  const authorLabel = post.anonymous ? 'Anonymous' : post.author.displayName;
  const location = post.anonymous
    ? `${post.anonymousGender ?? 'Student'} · ${post.university.shortName}`
    : `${post.university.shortName}. ${post.university.city}, ${post.university.state} (USA)`;
  const life = remainingFraction(new Date(post.createdAt), new Date(post.expiresAt), new Date());
  const erodedOpacity = 0.72 + life * 0.28;

  const openDetail = () => router.push({ pathname: '/post/[id]', params: { id: post.id } });

  return (
    <View style={[styles.card, { opacity: erodedOpacity }]}>
      <View style={styles.headerRow}>
        <Pressable
          disabled={post.anonymous}
          onPress={() => !post.anonymous && router.push({ pathname: '/profile/[id]', params: { id: post.author.id } })}
        >
          <Avatar anonymous={post.anonymous} profile={post.anonymous ? undefined : post.author} />
        </Pressable>
        <View style={styles.identity}>
          <Text numberOfLines={1} style={styles.author}>{authorLabel}</Text>
          <Text numberOfLines={1} style={styles.location}>{location}</Text>
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.age}>{ageLabel(post.createdAt)}</Text>
          <View style={styles.lifeRow}>
            <Ionicons color={erodrTheme.colors.action} name="time-outline" size={14} />
            <Text style={styles.remaining}>{formatRemaining(post.expiresAt)} left</Text>
          </View>
        </View>
      </View>

      <Pressable disabled={detail} onPress={openDetail}>
        <Text style={styles.body}>{post.body}</Text>
        {post.imageSource ? (
          <Image contentFit="cover" source={post.imageSource} style={styles.photo} transition={120} />
        ) : null}
      </Pressable>

      <View style={styles.lifeTrack}>
        <View style={[styles.lifeFill, { width: `${Math.max(2, life * 100)}%` }]} />
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityLabel="Positive vote" hitSlop={8} onPress={() => vote(post.id, 1)} style={styles.voteButton}>
          <Ionicons
            color={post.myVote === 1 ? erodrTheme.colors.cyan : erodrTheme.colors.action}
            name="chevron-up"
            size={34}
          />
          <Text style={[styles.voteCount, post.myVote === 1 && styles.selectedAction]}>{post.positiveCount}</Text>
        </Pressable>
        <Pressable accessibilityLabel="Negative vote" hitSlop={8} onPress={() => vote(post.id, -1)} style={styles.voteButton}>
          <Ionicons
            color={post.myVote === -1 ? erodrTheme.colors.destructive : erodrTheme.colors.action}
            name="chevron-down"
            size={34}
          />
          <Text style={[styles.voteCount, post.myVote === -1 && styles.negativeAction]}>{post.negativeCount}</Text>
        </Pressable>
        <Pressable accessibilityLabel="Flag post" hitSlop={8} style={styles.iconOnly}>
          <Ionicons color={erodrTheme.colors.action} name="flag" size={26} />
        </Pressable>
        <Pressable accessibilityLabel="Open comments" onPress={openDetail} style={styles.comments}>
          <Text style={styles.commentsLabel}>Comments</Text>
          <Ionicons color={erodrTheme.colors.action} name="chatbubble" size={28} />
          <Text style={styles.commentCount}>{post.responseCount}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: erodrTheme.colors.surface,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  identity: { flex: 1, justifyContent: 'center', paddingLeft: 10, paddingRight: 5 },
  author: {
    color: erodrTheme.colors.author,
    fontFamily: erodrTheme.type.family,
    fontSize: erodrTheme.type.author,
    fontWeight: '400',
  },
  location: {
    color: erodrTheme.colors.secondaryText,
    fontFamily: erodrTheme.type.family,
    fontSize: erodrTheme.type.metadata,
    fontWeight: '300',
    marginTop: 3,
  },
  timeBlock: { alignItems: 'flex-end', paddingTop: 2 },
  age: {
    color: '#A0A0A0',
    fontFamily: erodrTheme.type.family,
    fontSize: erodrTheme.type.metadata,
    fontWeight: '300',
  },
  lifeRow: { alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: 5 },
  remaining: {
    color: erodrTheme.colors.action,
    fontFamily: erodrTheme.type.family,
    fontSize: 11,
  },
  body: {
    color: erodrTheme.colors.text,
    fontFamily: erodrTheme.type.family,
    fontSize: erodrTheme.type.body,
    fontWeight: '400',
    lineHeight: 24,
    paddingBottom: 16,
    paddingHorizontal: 12,
    paddingTop: 18,
  },
  photo: { aspectRatio: 1.08, width: '100%' },
  lifeTrack: { backgroundColor: '#F0F0F0', height: 2 },
  lifeFill: { backgroundColor: erodrTheme.colors.cyan, height: 2 },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    height: erodrTheme.metrics.actionRowHeight,
    paddingHorizontal: 12,
  },
  voteButton: { alignItems: 'center', flexDirection: 'row', marginRight: 10 },
  voteCount: {
    color: erodrTheme.colors.action,
    fontFamily: erodrTheme.type.family,
    fontSize: 13,
    marginLeft: -3,
  },
  selectedAction: { color: erodrTheme.colors.cyan },
  negativeAction: { color: erodrTheme.colors.destructive },
  iconOnly: { marginLeft: 2, paddingHorizontal: 7 },
  comments: { alignItems: 'center', flexDirection: 'row', gap: 8, marginLeft: 'auto' },
  commentsLabel: {
    color: erodrTheme.colors.action,
    fontFamily: erodrTheme.type.family,
    fontSize: erodrTheme.type.action,
    fontWeight: '300',
  },
  commentCount: {
    color: erodrTheme.colors.action,
    fontFamily: erodrTheme.type.family,
    fontSize: 18,
    fontWeight: '300',
  },
});
