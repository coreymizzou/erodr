import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { erodrTheme } from '@/theme/erodrTheme';

export default function SplashScreen() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/login'), 900);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Pressable onPress={() => router.replace('/login')} style={styles.screen}>
      <View style={styles.mark}>
        <Text style={styles.wordmark}>erodr</Text>
        <View style={styles.rule} />
        <Text style={styles.tagline}>what's happening now</Text>
      </View>
      <Text style={styles.note}>INTERNAL RESTORATION PROTOTYPE</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: erodrTheme.colors.headerGreen,
    flex: 1,
    justifyContent: 'center',
  },
  mark: { alignItems: 'center', marginTop: -30 },
  wordmark: {
    color: erodrTheme.colors.surface,
    fontFamily: erodrTheme.type.family,
    fontSize: 58,
    fontWeight: '200',
    letterSpacing: -2,
  },
  rule: { backgroundColor: erodrTheme.colors.cyan, height: 3, marginTop: 4, width: 118 },
  tagline: {
    color: '#D8F1DD',
    fontFamily: erodrTheme.type.family,
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 1,
    marginTop: 9,
  },
  note: {
    bottom: 28,
    color: '#B9DCBF',
    fontFamily: erodrTheme.type.family,
    fontSize: 9,
    letterSpacing: 1.4,
    position: 'absolute',
  },
});
