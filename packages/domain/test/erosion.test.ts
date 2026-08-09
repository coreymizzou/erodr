import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EROSION_CONFIG,
  applyVoteToExpiration,
  calculateExpiresAt,
  filterActive,
  remainingFraction,
} from '../src/erosion.ts';

const createdAt = new Date('2026-01-01T00:00:00.000Z');

test('uses a six-hour base lifespan', () => {
  const expiresAt = calculateExpiresAt(createdAt, { positive: 0, negative: 0 });
  assert.equal(expiresAt.getTime() - createdAt.getTime(), EROSION_CONFIG.baseLifespanMs);
});

test('positive and negative votes change erosion using centralized constants', () => {
  const expiresAt = calculateExpiresAt(createdAt, { positive: 3, negative: 2 });
  assert.equal(
    expiresAt.getTime() - createdAt.getTime(),
    EROSION_CONFIG.baseLifespanMs +
      3 * EROSION_CONFIG.positiveVoteExtensionMs -
      2 * EROSION_CONFIG.negativeVoteReductionMs,
  );
});

test('changing a vote removes the old effect before applying the new one', () => {
  const now = new Date('2026-01-01T01:00:00.000Z');
  const current = calculateExpiresAt(createdAt, { positive: 1, negative: 0 });
  const changed = applyVoteToExpiration(current, 1, -1, now, createdAt);
  assert.equal(
    changed.getTime(),
    createdAt.getTime() +
      EROSION_CONFIG.baseLifespanMs -
      EROSION_CONFIG.negativeVoteReductionMs,
  );
});

test('a vote cannot leave less than five minutes immediately remaining', () => {
  const now = new Date('2026-01-01T05:59:00.000Z');
  const current = new Date('2026-01-01T06:00:00.000Z');
  const adjusted = applyVoteToExpiration(current, 0, -1, now, createdAt);
  assert.equal(adjusted.getTime() - now.getTime(), EROSION_CONFIG.minimumRemainingAfterVoteMs);
});

test('active filtering excludes expired posts', () => {
  const now = new Date('2026-01-01T12:00:00.000Z');
  const posts = [
    { id: 'active', expiresAt: '2026-01-01T13:00:00.000Z' },
    { id: 'expired', expiresAt: '2026-01-01T11:59:59.000Z' },
  ];
  assert.deepEqual(filterActive(posts, now).map((post) => post.id), ['active']);
});

test('remaining fraction is clamped', () => {
  const expiresAt = new Date(createdAt.getTime() + 1000);
  assert.equal(remainingFraction(createdAt, expiresAt, new Date(createdAt.getTime() + 500)), 0.5);
  assert.equal(remainingFraction(createdAt, expiresAt, new Date(createdAt.getTime() + 2000)), 0);
});
