import { useLocalSearchParams } from 'expo-router';

import { HistoricalProfile } from '@/components/HistoricalProfile';
import { profiles } from '@/data/seed';
import { useErodrStore } from '@/state/ErodrStore';

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { classmates } = useErodrStore();
  const profile = profiles.find((item) => item.id === id);
  if (!profile) return null;
  const posts = classmates.filter((post) => !post.anonymous && post.author.id === profile.id);
  return <HistoricalProfile posts={posts} profile={profile} />;
}
