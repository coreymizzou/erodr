import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ErodrHeader } from '@/components/ErodrHeader';
import { erodrTheme } from '@/theme/erodrTheme';

export default function MapScreen() {
  return (
    <View style={styles.screen}>
      <ErodrHeader title="Map" />
      <View style={styles.map}>
        <View style={[styles.road, styles.roadOne]} />
        <View style={[styles.road, styles.roadTwo]} />
        <View style={[styles.range, styles.rangeLarge]} />
        <View style={[styles.range, styles.rangeSmall]} />
        <View style={styles.pin}>
          <Ionicons color="#FFFFFF" name="school" size={25} />
        </View>
        <Text style={styles.campus}>Mizzou</Text>
        <Text style={styles.rangeLabel}>Streamer range · 5 miles</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#E6E2D9', flex: 1 },
  map: { flex: 1, overflow: 'hidden' },
  road: { backgroundColor: '#FFFFFF', height: 28, left: -40, position: 'absolute', width: 560 },
  roadOne: { top: 190, transform: [{ rotate: '-22deg' }] },
  roadTwo: { top: 420, transform: [{ rotate: '38deg' }] },
  range: { borderColor: 'rgba(76,190,95,0.55)', borderRadius: 180, borderWidth: 2, position: 'absolute' },
  rangeLarge: { height: 300, left: 45, top: 155, width: 300 },
  rangeSmall: { height: 160, left: 115, top: 225, width: 160 },
  pin: { alignItems: 'center', backgroundColor: erodrTheme.colors.historicalGreen, borderRadius: 30, height: 60, justifyContent: 'center', left: '43%', position: 'absolute', top: 273, width: 60 },
  campus: { color: '#333333', fontSize: 20, fontWeight: '700', position: 'absolute', textAlign: 'center', top: 340, width: '100%' },
  rangeLabel: { bottom: 28, color: '#676767', fontSize: 15, position: 'absolute', textAlign: 'center', width: '100%' },
});
