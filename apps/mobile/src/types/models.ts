import type { ImageSourcePropType } from 'react-native';
import type { VoteValue } from '@erodr/domain';

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface PublicProfile {
  id: string;
  displayName: string;
  initials: string;
  universityId: string;
  classYear: number;
  bio: string;
  avatarColor: string;
}

export interface StoredPost {
  id: string;
  authorId: string;
  universityId: string;
  body: string;
  anonymous: boolean;
  anonymousGender?: 'Woman' | 'Man' | 'Unspecified';
  imageSource?: ImageSourcePropType;
  createdAt: string;
  expiresAt: string;
  distanceMiles: number;
  positiveCount: number;
  negativeCount: number;
  responseCount: number;
  myVote: VoteValue;
  audience: 'classmates' | 'ticker' | 'national';
}

interface VisiblePostBase {
  id: string;
  university: University;
  body: string;
  imageSource?: ImageSourcePropType;
  createdAt: string;
  expiresAt: string;
  distanceMiles: number;
  positiveCount: number;
  negativeCount: number;
  responseCount: number;
  myVote: VoteValue;
  audience: StoredPost['audience'];
}

export interface AnonymousVisiblePost extends VisiblePostBase {
  anonymous: true;
  anonymousGender?: StoredPost['anonymousGender'];
  author?: never;
}

export interface IdentifiedVisiblePost extends VisiblePostBase {
  anonymous: false;
  author: PublicProfile;
  anonymousGender?: never;
}

export type VisiblePost = AnonymousVisiblePost | IdentifiedVisiblePost;

export interface StoredResponse {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  anonymous: boolean;
  private: boolean;
  createdAt: string;
}

export type VisibleResponse = Omit<StoredResponse, 'authorId'> & {
  author?: PublicProfile;
};

export interface Conversation {
  id: string;
  title: string;
  participantLabel: string;
  anonymousThread: boolean;
  lastMessage: string;
  updatedAt: string;
  unread: number;
}
