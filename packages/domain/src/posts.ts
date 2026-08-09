export interface PostDraft {
  body: string;
  imageUrl?: string;
  authenticatedUserId: string | null;
  authorId: string;
  universityId: string;
  profileUniversityId: string;
}

export type PostDraftValidation =
  | { valid: true }
  | { valid: false; reason: 'authentication' | 'author' | 'university' | 'content' | 'length' };

export function validatePostDraft(draft: PostDraft): PostDraftValidation {
  if (!draft.authenticatedUserId) return { valid: false, reason: 'authentication' };
  if (draft.authenticatedUserId !== draft.authorId) return { valid: false, reason: 'author' };
  if (draft.universityId !== draft.profileUniversityId) return { valid: false, reason: 'university' };
  if (!draft.body.trim() && !draft.imageUrl) return { valid: false, reason: 'content' };
  if (draft.body.length > 600) return { valid: false, reason: 'length' };
  return { valid: true };
}
