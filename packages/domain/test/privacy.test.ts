import assert from 'node:assert/strict';
import test from 'node:test';

import { canDeleteOwnRecord, projectIdentity, projectPrivateSender } from '../src/privacy.ts';

test('anonymous projection contains no author identity or UUID', () => {
  const projected = projectIdentity({
    authorId: 'secret-author-uuid',
    anonymous: true,
    anonymousGender: 'Woman',
    author: { id: 'secret-author-uuid', displayName: 'Maya Jefferson', avatarUrl: 'secret.jpg' },
  });
  const serialized = JSON.stringify(projected);
  assert.deepEqual(projected, { anonymous: true, anonymousGender: 'Woman' });
  assert.equal(serialized.includes('secret-author-uuid'), false);
  assert.equal(serialized.includes('Maya Jefferson'), false);
  assert.equal(serialized.includes('secret.jpg'), false);
});

test('identified projection includes only the public author summary', () => {
  const projected = projectIdentity({
    authorId: 'author-1',
    anonymous: false,
    author: { id: 'author-1', displayName: 'Maya Jefferson' },
  });
  assert.equal(projected.anonymous, false);
  if (!projected.anonymous) assert.equal(projected.author.displayName, 'Maya Jefferson');
});

test('only an authenticated author can delete their record', () => {
  assert.equal(canDeleteOwnRecord('author-1', 'author-1'), true);
  assert.equal(canDeleteOwnRecord('author-2', 'author-1'), false);
  assert.equal(canDeleteOwnRecord(null, 'author-1'), false);
});

test('private replies do not reveal an anonymous source author to a responder', () => {
  const projected = projectPrivateSender({
    viewerId: 'responder-1',
    sourceAuthorId: 'secret-author-uuid',
    sourceWasAnonymous: true,
    sender: { id: 'secret-author-uuid', displayName: 'Maya Jefferson' },
  });
  assert.deepEqual(projected, { label: 'Anonymous poster', profileId: null, sentByMe: false });
});

test('anonymous source author can still see the responder profile', () => {
  const projected = projectPrivateSender({
    viewerId: 'secret-author-uuid',
    sourceAuthorId: 'secret-author-uuid',
    sourceWasAnonymous: true,
    sender: { id: 'responder-1', displayName: 'Lauren Nguyen' },
  });
  assert.deepEqual(projected, { label: 'Lauren Nguyen', profileId: 'responder-1', sentByMe: false });
});
