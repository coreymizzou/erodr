import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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

import { Avatar } from '@/components/Avatar';
import { ErodrHeader } from '@/components/ErodrHeader';
import { PostCard } from '@/components/PostCard';
import { useErodrStore } from '@/state/ErodrStore';
import { erodrTheme } from '@/theme/erodrTheme';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addResponse, getPost, getResponses } = useErodrStore();
  const post = getPost(id);
  const responses = useMemo(() => getResponses(id), [getResponses, id]);
  const [body, setBody] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  if (!post) {
    return (
      <View style={styles.screen}>
        <ErodrHeader onBack={() => router.back()} title="Comments" />
        <View style={styles.missing}><Text>This post has eroded.</Text></View>
      </View>
    );
  }

  const submit = () => {
    if (!body.trim()) return;
    addResponse(post.id, body, anonymous);
    setBody('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0} style={styles.screen}>
      <ErodrHeader
        onBack={() => router.back()}
        right={post.anonymous ? (
          <Pressable accessibilityLabel="Private response">
            <Ionicons color="#FFFFFF" name="lock-closed-outline" size={25} />
          </Pressable>
        ) : undefined}
        title="Comments"
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <PostCard detail post={post} />
        <View style={styles.responseHeading}>
          <Text style={styles.responseHeadingText}>{responses.length} COMMENTS</Text>
          {post.anonymous ? <Text style={styles.privateHint}>Private response available</Text> : null}
        </View>
        {responses.map((response) => (
          <View key={response.id} style={styles.response}>
            <Avatar anonymous={response.anonymous} profile={response.author} size={38} />
            <View style={styles.responseCopy}>
              <Text style={styles.responseAuthor}>{response.anonymous ? 'Anonymous' : response.author?.displayName}</Text>
              <Text style={styles.responseBody}>{response.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.composerShell}>
        <View style={styles.anonymousToggle}>
          <Text style={styles.anonymousLabel}>Anon</Text>
          <Switch
            onValueChange={setAnonymous}
            style={styles.switch}
            trackColor={{ false: '#D4D4D4', true: erodrTheme.colors.cyan }}
            value={anonymous}
          />
        </View>
        <TextInput
          onChangeText={setBody}
          placeholder="Write a comment"
          placeholderTextColor="#9B9B9B"
          style={styles.input}
          value={body}
        />
        <Pressable onPress={submit} style={styles.send}>
          <Ionicons color={body.trim() ? erodrTheme.colors.cyan : '#C7C7C7'} name="arrow-up-circle" size={34} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: erodrTheme.colors.feedGutter, flex: 1 },
  missing: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  responseHeading: { alignItems: 'center', flexDirection: 'row', paddingHorizontal: 13, paddingVertical: 8 },
  responseHeadingText: { color: erodrTheme.colors.secondaryText, flex: 1, fontSize: 11, letterSpacing: 1 },
  privateHint: { color: erodrTheme.colors.cyan, fontSize: 11 },
  response: { backgroundColor: '#FFFFFF', borderBottomColor: erodrTheme.colors.divider, borderBottomWidth: 1, flexDirection: 'row', padding: 12 },
  responseCopy: { flex: 1, marginLeft: 10 },
  responseAuthor: { color: erodrTheme.colors.author, fontSize: 15 },
  responseBody: { color: erodrTheme.colors.text, fontSize: 16, lineHeight: 21, marginTop: 4 },
  composerShell: { alignItems: 'center', backgroundColor: '#FFFFFF', borderTopColor: erodrTheme.colors.divider, borderTopWidth: 1, flexDirection: 'row', minHeight: 59, paddingHorizontal: 8, paddingVertical: 7 },
  anonymousToggle: { alignItems: 'center', marginRight: 5 },
  anonymousLabel: { color: erodrTheme.colors.secondaryText, fontSize: 9 },
  switch: { transform: [{ scaleX: 0.68 }, { scaleY: 0.68 }] },
  input: { backgroundColor: '#F5F5F5', borderColor: '#DADADA', borderWidth: 1, color: erodrTheme.colors.text, flex: 1, fontSize: 15, height: 40, paddingHorizontal: 10 },
  send: { marginLeft: 6 },
});
