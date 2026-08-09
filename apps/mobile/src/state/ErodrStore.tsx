import {
  applyVoteToExpiration,
  calculateExpiresAt,
  filterActive,
  type VoteValue,
} from '@erodr/domain';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { makeSeedBundle, profiles, universities } from '@/data/seed';
import type {
  Conversation,
  StoredPost,
  StoredResponse,
  VisiblePost,
  VisibleResponse,
} from '@/types/models';

type FeedOrder = 'popular' | 'recent' | 'nearest';

interface CreatePostInput {
  body: string;
  anonymous: boolean;
  imageSource?: StoredPost['imageSource'];
  lifespanHours: number;
}

interface StoreValue {
  currentProfile: (typeof profiles)[number];
  feedOrder: FeedOrder;
  setFeedOrder: (order: FeedOrder) => void;
  classmates: VisiblePost[];
  getFeed: (audience: StoredPost['audience']) => VisiblePost[];
  conversations: Conversation[];
  getPost: (id: string) => VisiblePost | undefined;
  getResponses: (postId: string) => VisibleResponse[];
  vote: (postId: string, value: Exclude<VoteValue, 0>) => void;
  createPost: (input: CreatePostInput) => string;
  addResponse: (postId: string, body: string, anonymous: boolean) => void;
}

const ErodrStore = createContext<StoreValue | null>(null);

function exposePost(post: StoredPost): VisiblePost {
  const university = universities.find((item) => item.id === post.universityId) ?? universities[0]!;
  const common = {
    id: post.id,
    university,
    body: post.body,
    imageSource: post.imageSource,
    createdAt: post.createdAt,
    expiresAt: post.expiresAt,
    distanceMiles: post.distanceMiles,
    positiveCount: post.positiveCount,
    negativeCount: post.negativeCount,
    responseCount: post.responseCount,
    myVote: post.myVote,
    audience: post.audience,
  };

  if (post.anonymous) {
    return { ...common, anonymous: true, anonymousGender: post.anonymousGender };
  }

  return {
    ...common,
    anonymous: false,
    author: profiles.find((profile) => profile.id === post.authorId) ?? profiles[0]!,
  };
}

function exposeResponse(response: StoredResponse): VisibleResponse {
  if (response.anonymous) {
    const { authorId: _privateAuthorId, ...safe } = response;
    return safe;
  }
  const { authorId, ...safe } = response;
  return { ...safe, author: profiles.find((profile) => profile.id === authorId) ?? profiles[0]! };
}

export function ErodrStoreProvider({ children }: PropsWithChildren) {
  const [seed] = useState(() => makeSeedBundle());
  const [posts, setPosts] = useState(seed.posts);
  const [responses, setResponses] = useState(seed.responses);
  const [feedOrder, setFeedOrder] = useState<FeedOrder>('recent');
  const currentProfile = profiles[0]!;

  const getPost = useCallback(
    (id: string) => {
      const post = posts.find((item) => item.id === id);
      return post ? exposePost(post) : undefined;
    },
    [posts],
  );

  const getResponses = useCallback(
    (postId: string) => responses.filter((item) => item.postId === postId && !item.private).map(exposeResponse),
    [responses],
  );

  const vote = useCallback((postId: string, requestedVote: Exclude<VoteValue, 0>) => {
    const now = new Date();
    setPosts((current) => current.map((post) => {
      if (post.id !== postId) return post;
      const nextVote: VoteValue = post.myVote === requestedVote ? 0 : requestedVote;
      return {
        ...post,
        positiveCount: post.positiveCount - (post.myVote === 1 ? 1 : 0) + (nextVote === 1 ? 1 : 0),
        negativeCount: post.negativeCount - (post.myVote === -1 ? 1 : 0) + (nextVote === -1 ? 1 : 0),
        myVote: nextVote,
        expiresAt: applyVoteToExpiration(
          new Date(post.expiresAt),
          post.myVote,
          nextVote,
          now,
          new Date(post.createdAt),
        ).toISOString(),
      };
    }));
  }, []);

  const createPost = useCallback((input: CreatePostInput) => {
    const createdAt = new Date();
    const requestedBase = new Date(createdAt.getTime() + input.lifespanHours * 60 * 60_000);
    const configuredBase = calculateExpiresAt(createdAt, { positive: 0, negative: 0 });
    const expiresAt = input.lifespanHours === 6 ? configuredBase : requestedBase;
    const id = `post-local-${createdAt.getTime()}`;
    const post: StoredPost = {
      id,
      authorId: currentProfile.id,
      universityId: currentProfile.universityId,
      body: input.body.trim(),
      anonymous: input.anonymous,
      anonymousGender: input.anonymous ? 'Woman' : undefined,
      imageSource: input.imageSource,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      distanceMiles: 0,
      positiveCount: 0,
      negativeCount: 0,
      responseCount: 0,
      myVote: 0,
      audience: 'classmates',
    };
    setPosts((current) => [post, ...current]);
    return id;
  }, [currentProfile.id, currentProfile.universityId]);

  const addResponse = useCallback((postId: string, body: string, anonymous: boolean) => {
    const response: StoredResponse = {
      id: `response-local-${Date.now()}`,
      postId,
      authorId: currentProfile.id,
      body: body.trim(),
      anonymous,
      private: false,
      createdAt: new Date().toISOString(),
    };
    setResponses((current) => [...current, response]);
    setPosts((current) => current.map((post) => (
      post.id === postId ? { ...post, responseCount: post.responseCount + 1 } : post
    )));
  }, [currentProfile.id]);

  const classmates = useMemo(() => {
    const active = filterActive(posts).filter((post) => post.universityId === 'mizzou' && post.audience === 'classmates');
    const sorted = [...active].sort((a, b) => {
      if (feedOrder === 'popular') {
        return (b.positiveCount - b.negativeCount) - (a.positiveCount - a.negativeCount);
      }
      if (feedOrder === 'nearest') return a.distanceMiles - b.distanceMiles;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted.map(exposePost);
  }, [feedOrder, posts]);

  const getFeed = useCallback((audience: StoredPost['audience']) => {
    const active = filterActive(posts).filter((post) => {
      if (audience === 'classmates') return post.universityId === 'mizzou' && post.audience === 'classmates';
      if (audience === 'ticker') return post.audience === 'ticker' && post.anonymous;
      return post.audience === 'national' && !post.anonymous;
    });
    return [...active]
      .sort((a, b) => {
        if (feedOrder === 'popular') return (b.positiveCount - b.negativeCount) - (a.positiveCount - a.negativeCount);
        if (feedOrder === 'nearest') return a.distanceMiles - b.distanceMiles;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .map(exposePost);
  }, [feedOrder, posts]);

  const value = useMemo<StoreValue>(() => ({
    currentProfile,
    feedOrder,
    setFeedOrder,
    classmates,
    getFeed,
    conversations: seed.conversations,
    getPost,
    getResponses,
    vote,
    createPost,
    addResponse,
  }), [addResponse, classmates, createPost, feedOrder, getFeed, getPost, getResponses, seed.conversations, vote]);

  return <ErodrStore.Provider value={value}>{children}</ErodrStore.Provider>;
}

export function useErodrStore(): StoreValue {
  const store = useContext(ErodrStore);
  if (!store) throw new Error('useErodrStore must be used inside ErodrStoreProvider');
  return store;
}
