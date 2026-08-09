import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ErodrHeader } from '@/components/ErodrHeader';
import { useErodrStore } from '@/state/ErodrStore';
import { erodrTheme } from '@/theme/erodrTheme';

const lifespanOptions = [1, 6, 12, 24];

export default function ComposeScreen() {
  const router = useRouter();
  const { createPost } = useErodrStore();
  const [body, setBody] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [lifespanHours, setLifespanHours] = useState(6);
  const [imageUri, setImageUri] = useState<string>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) setImageUri(result.assets[0]?.uri);
  };

  const publish = () => {
    if (!body.trim() && !imageUri) return;
    const id = createPost({
      body: body.trim() || 'Photo',
      anonymous,
      lifespanHours,
      imageSource: imageUri ? { uri: imageUri } : undefined,
    });
    setBody('');
    setImageUri(undefined);
    setAnonymous(false);
    router.replace({ pathname: '/post/[id]', params: { id } });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ErodrHeader
        right={(
          <Pressable disabled={!body.trim() && !imageUri} onPress={publish}>
            <Text style={[styles.postButton, !body.trim() && !imageUri && styles.disabled]}>Post</Text>
          </Pressable>
        )}
        title="New Post"
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput
          maxLength={600}
          multiline
          onChangeText={setBody}
          placeholder="What's happening right now?"
          placeholderTextColor="#A3A3A3"
          style={styles.composer}
          textAlignVertical="top"
          value={body}
        />
        {imageUri ? (
          <View>
            <Image contentFit="cover" source={{ uri: imageUri }} style={styles.preview} />
            <Pressable onPress={() => setImageUri(undefined)} style={styles.removePhoto}>
              <Ionicons color="#FFFFFF" name="close" size={21} />
            </Pressable>
          </View>
        ) : null}

        <Pressable onPress={pickImage} style={styles.row}>
          <Ionicons color={erodrTheme.colors.cyan} name="camera-outline" size={27} />
          <Text style={styles.rowLabel}>Add Photo</Text>
          <Ionicons color={erodrTheme.colors.action} name="chevron-forward" size={20} />
        </Pressable>

        <View style={styles.row}>
          <Ionicons color={erodrTheme.colors.cyan} name="eye-off-outline" size={27} />
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Anonymous</Text>
            <Text style={styles.rowHelp}>Your profile stays hidden. Gender only is shown.</Text>
          </View>
          <Switch
            onValueChange={setAnonymous}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#D4D4D4', true: erodrTheme.colors.cyan }}
            value={anonymous}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VISIBLE TO</Text>
          <View style={styles.audienceRow}>
            <Text style={styles.audience}>Mizzou Streamer</Text>
            <Text style={styles.audienceMeta}>Mizzou · within 5 miles</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STARTING LIFESPAN</Text>
          <View style={styles.lifespanRow}>
            {lifespanOptions.map((hours) => (
              <Pressable
                key={hours}
                onPress={() => setLifespanHours(hours)}
                style={[styles.lifespanButton, lifespanHours === hours && styles.selectedLifespan]}
              >
                <Text style={[styles.lifespanText, lifespanHours === hours && styles.selectedLifespanText]}>{hours}h</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.erosionNote}>Rodie's votes can lengthen or shorten the life of your post.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: erodrTheme.colors.selectorBackground, flex: 1 },
  postButton: { color: erodrTheme.colors.historicalGreen, fontFamily: erodrTheme.type.family, fontSize: 17 },
  disabled: { opacity: 0.45 },
  composer: {
    backgroundColor: '#FFFFFF',
    color: erodrTheme.colors.text,
    fontFamily: erodrTheme.type.family,
    fontSize: 19,
    lineHeight: 27,
    minHeight: 165,
    padding: 16,
  },
  preview: { aspectRatio: 1.25, width: '100%' },
  removePhoto: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 32,
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: erodrTheme.colors.divider,
    borderTopWidth: 1,
    flexDirection: 'row',
    minHeight: 61,
    paddingHorizontal: 16,
  },
  rowText: { flex: 1 },
  rowLabel: { color: erodrTheme.colors.text, flex: 1, fontFamily: erodrTheme.type.family, fontSize: 17, marginLeft: 12 },
  rowHelp: { color: erodrTheme.colors.secondaryText, fontSize: 11, marginLeft: 12, marginTop: 2 },
  section: { marginTop: 18 },
  sectionTitle: { color: '#818181', fontSize: 11, letterSpacing: 1, marginBottom: 6, marginLeft: 16 },
  audienceRow: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 13 },
  audience: { color: erodrTheme.colors.text, fontSize: 17 },
  audienceMeta: { color: erodrTheme.colors.secondaryText, fontSize: 13, marginTop: 3 },
  lifespanRow: { backgroundColor: '#FFFFFF', flexDirection: 'row', padding: 8 },
  lifespanButton: { alignItems: 'center', borderColor: erodrTheme.colors.cyan, borderWidth: 1, flex: 1, height: 38, justifyContent: 'center' },
  selectedLifespan: { backgroundColor: erodrTheme.colors.cyan },
  lifespanText: { color: erodrTheme.colors.cyan, fontSize: 16 },
  selectedLifespanText: { color: '#FFFFFF' },
  erosionNote: { color: erodrTheme.colors.secondaryText, fontSize: 12, lineHeight: 17, paddingHorizontal: 16, paddingTop: 8 },
});
