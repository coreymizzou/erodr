import { HistoricalProfile } from '@/components/HistoricalProfile';
import { useErodrStore } from '@/state/ErodrStore';

export default function MyProfileScreen() {
  const { currentProfile, classmates } = useErodrStore();
  const visiblePosts = classmates.filter((post) => !post.anonymous && post.author.id === currentProfile.id);
  return <HistoricalProfile own posts={visiblePosts} profile={currentProfile} />;
}
