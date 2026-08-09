import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { ErodrHeader } from '@/components/ErodrHeader';
import { profiles, universities } from '@/data/seed';
import { erodrTheme } from '@/theme/erodrTheme';

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const profile = profiles.find((item) => item.id === id);
  if (!profile) return null;
  const university = universities.find((item) => item.id === profile.universityId) ?? universities[0]!;
  return (
    <View style={styles.screen}>
      <ErodrHeader onBack={() => router.back()} title="Profile" />
      <View style={styles.card}>
        <Avatar profile={profile} size={96} />
        <Text style={styles.name}>{profile.displayName}</Text>
        <Text style={styles.school}>{university.shortName} · Class of {profile.classYear}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Profile by activity</Text>
        <Text style={styles.noticeCopy}>Erodr profiles are not searchable. You reached this rodie from a public post.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: erodrTheme.colors.feedGutter, flex: 1 },
  card: { alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingVertical: 28 },
  name: { color: erodrTheme.colors.author, fontSize: 25, marginTop: 12 },
  school: { color: erodrTheme.colors.secondaryText, fontSize: 14, marginTop: 5 },
  bio: { color: erodrTheme.colors.text, fontSize: 16, lineHeight: 22, marginTop: 16, textAlign: 'center' },
  notice: { backgroundColor: '#FFFFFF', marginTop: 18, padding: 16 },
  noticeTitle: { color: erodrTheme.colors.author, fontSize: 16 },
  noticeCopy: { color: erodrTheme.colors.secondaryText, fontSize: 13, lineHeight: 18, marginTop: 5 },
});
