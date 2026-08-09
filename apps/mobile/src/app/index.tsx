import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/login'), 900);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Pressable onPress={() => router.replace('/login')} style={styles.screen}>
      <Image
        contentFit="contain"
        source={require('../../assets/erodr/original/erodr-radar.jpeg')}
        style={styles.radar}
      />
      <Text style={styles.note}>INTERNAL RESTORATION PROTOTYPE</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: '#000000',
    flex: 1,
    justifyContent: 'center',
  },
  radar: { height: 310, marginTop: -28, width: 310 },
  note: {
    bottom: 28,
    color: '#5B5B5B',
    fontSize: 9,
    letterSpacing: 1.4,
    position: 'absolute',
  },
});
