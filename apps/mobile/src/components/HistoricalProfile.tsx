import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { erodrTheme } from '@/theme/erodrTheme';
import type { PublicProfile, VisiblePost } from '@/types/models';
import { Avatar } from './Avatar';
import { PostCard } from './PostCard';

const galleryImages = [
  require('../../assets/erodr/demo/generated-demo-campus-friends.png'),
  require('../../assets/erodr/demo/generated-demo-campus-quad.png'),
  require('../../assets/erodr/demo/generated-demo-late-night-pizza.png'),
];

interface HistoricalProfileProps {
  profile: PublicProfile;
  posts: VisiblePost[];
  own?: boolean;
}

function monthYear(value: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(value));
}

export function HistoricalProfile({ profile, posts, own = false }: HistoricalProfileProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const actions = [
    ['chatbubbles', 'Start Chat'],
    ['link', 'Connect'],
    ['ban', 'Block'],
  ] as const;

  const header = (
    <View>
      <View style={[styles.nav, { height: 58 + insets.top, paddingTop: insets.top }]}>
        <Pressable onPress={() => own ? router.replace('/(tabs)/classmates') : router.back()} style={styles.navSide}>
          <Text style={styles.navAction}>Done</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.navTitle}>{profile.displayName}</Text>
        <View style={[styles.navSide, styles.navRight]}>
          {!own ? <Text style={styles.report}>Report Abuse</Text> : null}
        </View>
      </View>

      <View style={styles.hero}>
        <Avatar profile={profile} size={78} />
        <View style={styles.heroIdentity}>
          <Text numberOfLines={1} style={styles.heroName}>{profile.displayName}</Text>
          <Text style={styles.heroSchool}>Mizzou</Text>
        </View>
        {profile.validated ? (
          <View style={styles.validated}>
            <Ionicons color={erodrTheme.colors.historicalGreen} name="checkmark-circle-outline" size={45} />
            <Text style={styles.validatedText}>Validated</Text>
          </View>
        ) : null}
        <View style={styles.gallery}>
          {[0, 1, 2, 0, 1].map((imageIndex, index) => (
            <Image key={`${imageIndex}-${index}`} contentFit="cover" source={galleryImages[imageIndex]} style={styles.galleryImage} />
          ))}
        </View>
      </View>

      <View style={styles.profileBody}>
        <Text style={styles.bio}>{profile.bio}{'\n'}IG @{profile.displayName.split(' ')[0]?.toLowerCase()}rodr</Text>
        <Text style={styles.tenure}>Rodie since {monthYear(profile.rodieSince)}</Text>
        <Text style={styles.likes}><Text style={styles.likesNumber}>{profile.likesCollected}</Text> Likes collected</Text>
        {profile.connectionCount > 150 ? (
          <View style={styles.connections}>
            <Ionicons color="#E36B0A" name="link" size={28} />
            <Text style={styles.connectionText}><Text style={styles.likesNumber}>{profile.connectionCount}</Text> Connections</Text>
          </View>
        ) : null}
        <View style={styles.actions}>
          {actions.map(([icon, label]) => (
            <Pressable key={label} style={styles.actionButton}>
              <Ionicons color={erodrTheme.colors.action} name={icon} size={34} />
              <Text style={styles.actionLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {posts.length ? <Text style={styles.activityTitle}>PUBLIC POSTS</Text> : null}
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={header}
      contentContainerStyle={styles.list}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      style={styles.screen}
    />
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: erodrTheme.colors.feedGutter, flex: 1 },
  list: { paddingBottom: 10 },
  nav: { alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomColor: '#D8D8D8', borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', paddingHorizontal: 10 },
  navSide: { justifyContent: 'center', width: 90 },
  navRight: { alignItems: 'flex-end' },
  navAction: { color: erodrTheme.colors.historicalGreen, fontSize: 18 },
  navTitle: { color: '#111111', flex: 1, fontSize: 21, fontWeight: '700', textAlign: 'center' },
  report: { color: erodrTheme.colors.historicalGreen, fontSize: 12, fontWeight: '600' },
  hero: { alignItems: 'center', backgroundColor: '#858585', flexDirection: 'row', height: 130, paddingBottom: 22, paddingHorizontal: 28 },
  heroIdentity: { flex: 1, marginLeft: 18 },
  heroName: { color: '#D4D4D4', fontSize: 20 },
  heroSchool: { color: '#D4D4D4', fontSize: 16, marginTop: 7 },
  validated: { alignItems: 'center' },
  validatedText: { color: erodrTheme.colors.historicalGreen, fontSize: 16, marginTop: 1 },
  gallery: { bottom: -36, flexDirection: 'row', gap: 4, left: 145, position: 'absolute' },
  galleryImage: { backgroundColor: '#D2D2D2', height: 48, width: 48 },
  profileBody: { alignItems: 'center', backgroundColor: '#EFEFEF', minHeight: 362, paddingHorizontal: 20, paddingTop: 52 },
  bio: { color: '#676767', fontSize: 15, fontStyle: 'italic', lineHeight: 20, textAlign: 'center' },
  tenure: { color: '#676767', fontSize: 20, marginTop: 8 },
  likes: { color: '#676767', fontSize: 19, marginTop: 7 },
  likesNumber: { fontWeight: '700' },
  connections: { alignItems: 'center', borderColor: '#A5A5A5', borderRadius: 3, borderWidth: 1, flexDirection: 'row', gap: 18, marginTop: 26, paddingHorizontal: 18, paddingVertical: 10 },
  connectionText: { color: '#676767', fontSize: 18 },
  actions: { flexDirection: 'row', gap: 18, marginTop: 'auto', paddingBottom: 22 },
  actionButton: { alignItems: 'center', borderColor: '#9F9F9F', borderRadius: 3, borderWidth: 1, height: 82, justifyContent: 'center', width: 100 },
  actionLabel: { color: erodrTheme.colors.action, fontSize: 15, marginTop: 5 },
  activityTitle: { backgroundColor: '#EFEFEF', color: erodrTheme.colors.secondaryText, fontSize: 11, letterSpacing: 1, paddingHorizontal: 13, paddingVertical: 8 },
});
