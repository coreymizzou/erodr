export const EROSION_CONFIG = {
  baseLifespanMs: 6 * 60 * 60 * 1_000,
  positiveVoteExtensionMs: 5 * 60 * 1_000,
  negativeVoteReductionMs: 10 * 60 * 1_000,
  maximumLifespanMs: 72 * 60 * 60 * 1_000,
  minimumRemainingAfterVoteMs: 5 * 60 * 1_000,
} as const;

export type VoteValue = -1 | 0 | 1;

export interface VoteTally {
  positive: number;
  negative: number;
}

export function calculateExpiresAt(
  createdAt: Date,
  tally: VoteTally,
  config = EROSION_CONFIG,
): Date {
  const voteAdjustment =
    tally.positive * config.positiveVoteExtensionMs -
    tally.negative * config.negativeVoteReductionMs;
  const lifespan = Math.min(
    config.maximumLifespanMs,
    Math.max(0, config.baseLifespanMs + voteAdjustment),
  );

  return new Date(createdAt.getTime() + lifespan);
}

export function applyVoteToExpiration(
  currentExpiresAt: Date,
  previousVote: VoteValue,
  nextVote: VoteValue,
  now: Date,
  createdAt: Date,
  config = EROSION_CONFIG,
): Date {
  const effect = (vote: VoteValue): number => {
    if (vote === 1) return config.positiveVoteExtensionMs;
    if (vote === -1) return -config.negativeVoteReductionMs;
    return 0;
  };

  const maximum = createdAt.getTime() + config.maximumLifespanMs;
  const minimum = now.getTime() + config.minimumRemainingAfterVoteMs;
  const adjusted = currentExpiresAt.getTime() - effect(previousVote) + effect(nextVote);

  return new Date(Math.min(maximum, Math.max(minimum, adjusted)));
}

export function remainingFraction(
  createdAt: Date,
  expiresAt: Date,
  now: Date,
): number {
  const total = expiresAt.getTime() - createdAt.getTime();
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, (expiresAt.getTime() - now.getTime()) / total));
}

export function isActive(expiresAt: Date | string, now = new Date()): boolean {
  return new Date(expiresAt).getTime() > now.getTime();
}

export function filterActive<T extends { expiresAt: string }>(posts: readonly T[], now = new Date()): T[] {
  return posts.filter((post) => isActive(post.expiresAt, now));
}

export function formatRemaining(expiresAt: Date | string, now = new Date()): string {
  const remainingMs = Math.max(0, new Date(expiresAt).getTime() - now.getTime());
  const minutes = Math.ceil(remainingMs / 60_000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.ceil(hours / 24)}d`;
}
