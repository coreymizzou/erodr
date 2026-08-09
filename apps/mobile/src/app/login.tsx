import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { erodrTheme } from '@/theme/erodrTheme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('maya.jefferson@missouri.edu');
  const enter = () => router.replace('/(tabs)/classmates');

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
        <View style={styles.brand}>
          <Text style={styles.wordmark}>erodr</Text>
          <Text style={styles.welcome}>Your college. Right now.</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>COLLEGE EMAIL</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@school.edu"
            placeholderTextColor="#AAAAAA"
            style={styles.input}
            value={email}
          />
          <Pressable onPress={enter} style={styles.primary}>
            <Text style={styles.primaryText}>Enter Erodr</Text>
          </Pressable>
          <Pressable onPress={enter} style={styles.demo}>
            <Text style={styles.demoText}>Demo Login · Mizzou</Text>
            <Text style={styles.demoSubtext}>No verification required</Text>
          </Pressable>
        </View>
        <Text style={styles.footnote}>Validated rodies see Classmates and National posts.</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: erodrTheme.colors.headerGreen, flex: 1 },
  screen: { backgroundColor: erodrTheme.colors.surface, flex: 1 },
  brand: {
    alignItems: 'center',
    backgroundColor: erodrTheme.colors.headerGreen,
    height: 245,
    justifyContent: 'center',
  },
  wordmark: {
    color: erodrTheme.colors.surface,
    fontFamily: erodrTheme.type.family,
    fontSize: 54,
    fontWeight: '200',
  },
  welcome: {
    color: '#D9F0DE',
    fontFamily: erodrTheme.type.family,
    fontSize: 16,
    fontWeight: '300',
    marginTop: 7,
  },
  form: { paddingHorizontal: 25, paddingTop: 32 },
  label: {
    color: erodrTheme.colors.secondaryText,
    fontFamily: erodrTheme.type.family,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 7,
  },
  input: {
    borderColor: '#CFCFCF',
    borderWidth: 1,
    color: erodrTheme.colors.text,
    fontFamily: erodrTheme.type.family,
    fontSize: 17,
    height: 49,
    paddingHorizontal: 12,
  },
  primary: {
    alignItems: 'center',
    backgroundColor: erodrTheme.colors.cyan,
    height: 49,
    justifyContent: 'center',
    marginTop: 13,
  },
  primaryText: { color: '#FFFFFF', fontFamily: erodrTheme.type.family, fontSize: 18 },
  demo: {
    alignItems: 'center',
    borderColor: erodrTheme.colors.headerGreen,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    marginTop: 18,
  },
  demoText: { color: erodrTheme.colors.headerGreen, fontFamily: erodrTheme.type.family, fontSize: 16 },
  demoSubtext: { color: erodrTheme.colors.secondaryText, fontSize: 11, marginTop: 2 },
  footnote: {
    bottom: 24,
    color: erodrTheme.colors.secondaryText,
    fontFamily: erodrTheme.type.family,
    fontSize: 12,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
  },
});
