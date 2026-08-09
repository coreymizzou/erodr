export interface AuthorSummary {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export type ProjectedIdentity =
  | { anonymous: true; anonymousGender?: string; author?: never }
  | { anonymous: false; author: AuthorSummary; anonymousGender?: never };

export function projectIdentity(input: {
  authorId: string;
  anonymous: boolean;
  anonymousGender?: string;
  author: AuthorSummary;
}): ProjectedIdentity {
  if (input.anonymous) {
    return {
      anonymous: true,
      ...(input.anonymousGender ? { anonymousGender: input.anonymousGender } : {}),
    };
  }
  return { anonymous: false, author: input.author };
}

export function canDeleteOwnRecord(userId: string | null, authorId: string): boolean {
  return userId !== null && userId === authorId;
}

export function projectPrivateSender(input: {
  viewerId: string;
  sourceAuthorId: string;
  sourceWasAnonymous: boolean;
  sender: AuthorSummary;
}): { label: string; profileId: string | null; sentByMe: boolean } {
  if (input.sender.id === input.viewerId) {
    return { label: 'You', profileId: input.sender.id, sentByMe: true };
  }
  if (
    input.sourceWasAnonymous &&
    input.sender.id === input.sourceAuthorId &&
    input.viewerId !== input.sourceAuthorId
  ) {
    return { label: 'Anonymous poster', profileId: null, sentByMe: false };
  }
  return { label: input.sender.displayName, profileId: input.sender.id, sentByMe: false };
}
