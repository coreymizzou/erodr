import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { ErodrHeader } from '@/components/ErodrHeader';
import { PostCard } from '@/components/PostCard';
import { useErodrStore } from '@/state/ErodrStore';
import { erodrTheme } from '@/theme/erodrTheme';

export default function MyProfileScreen() {
  const router = useRouter();
  const { currentProfile, classmates } = useErodrStore();
  const visiblePosts = classmates.filter((post) => !post.anonymous && post.author.id === currentProfile.id);
  return (
    <View style={styles.screen}>
      <ErodrHeader
        right={<Pressable onPress={() => router.replace('/login')}><Ionicons color="#FFFFFF" name="settings-outline" size={29} /></Pressable>}
        title="Profile"
      />
      <FlatList
        ListHeaderComponent={(
          <View style={styles.profileHeader}>
            <Avatar profile={currentProfile} size={84} />
            <Text style={styles.name}>{currentProfile.displayName}</Text>
            <Text style={styles.school}>Mizzou · Class of {currentProfile.classYear}</Text>
            <Text style={styles.bio}>{currentProfile.bio}</Text>
            <Text style={styles.sectionTitle}>PUBLIC POSTS</Text>
          </View>
        )}
        data={visiblePosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: erodrTheme.colors.feedGutter, flex: 1 },
  profileHeader: { alignItems: 'center', backgroundColor: '#FFFFFF', paddingTop: 22 },
  name: { color: erodrTheme.colors.author, fontSize: 23, marginTop: 10 },
  school: { color: erodrTheme.colors.secondaryText, fontSize: 14, marginTop: 4 },
  bio: { color: erodrTheme.colors.text, fontSize: 15, lineHeight: 21, paddingHorizontal: 32, paddingVertical: 13, textAlign: 'center' },
  sectionTitle: { alignSelf: 'stretch', backgroundColor: erodrTheme.colors.selectorBackground, color: erodrTheme.colors.secondaryText, fontSize: 11, letterSpacing: 1, paddingHorizontal: 13, paddingVertical: 8 },
});
