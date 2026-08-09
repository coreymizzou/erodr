import assert from 'node:assert/strict';
import test from 'node:test';

import { validatePostDraft } from '../src/posts.ts';

const validDraft = {
  body: 'What is happening on the Quad?',
  authenticatedUserId: 'profile-1',
  authorId: 'profile-1',
  universityId: 'mizzou',
  profileUniversityId: 'mizzou',
};

test('accepts an authenticated campus post', () => {
  assert.deepEqual(validatePostDraft(validDraft), { valid: true });
});

test('accepts an image-only post', () => {
  assert.deepEqual(validatePostDraft({ ...validDraft, body: '', imageUrl: 'photo.jpg' }), { valid: true });
});

test('rejects impersonation and cross-campus creation', () => {
  assert.deepEqual(validatePostDraft({ ...validDraft, authorId: 'profile-2' }), { valid: false, reason: 'author' });
  assert.deepEqual(validatePostDraft({ ...validDraft, universityId: 'jmu' }), { valid: false, reason: 'university' });
});

test('rejects empty and overlong posts', () => {
  assert.deepEqual(validatePostDraft({ ...validDraft, body: '   ' }), { valid: false, reason: 'content' });
  assert.deepEqual(validatePostDraft({ ...validDraft, body: 'x'.repeat(601) }), { valid: false, reason: 'length' });
});
