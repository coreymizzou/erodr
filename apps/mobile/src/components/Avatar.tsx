import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { erodrTheme } from '@/theme/erodrTheme';
import type { PublicProfile } from '@/types/models';

interface AvatarProps {
  profile?: PublicProfile;
  anonymous?: boolean;
  size?: number;
}

export function Avatar({ profile, anonymous = false, size = erodrTheme.metrics.avatarSize }: AvatarProps) {
  const backgroundColor = anonymous ? '#B7B7B7' : profile?.avatarColor ?? '#777777';
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
      {anonymous ? (
        <Ionicons color="#202020" name="person" size={Math.round(size * 0.62)} />
      ) : (
        <Text style={[styles.initials, { fontSize: Math.round(size * 0.34) }]}>{profile?.initials ?? 'R'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: erodrTheme.colors.surface,
    fontFamily: erodrTheme.type.family,
    fontWeight: '500',
  },
});
