# Architecture

## App shape

The mobile app is an Expo SDK 54 React Native/TypeScript application using Expo Router. SDK 54 is intentionally pinned for compatibility with the current iPhone App Store build of Expo Go. The primary five-tab shell follows the firsthand 2013–2015 captures: Streamer, Map, Post, Chat, and Profile. The graduation-cap control switches the local Mizzou Streamer to the historically documented Anonymous Ticker and National Posts streams.

`ErodrStoreProvider` is the first-milestone offline adapter. It exposes the same sanitized model expected from Supabase, so the visual reconstruction remains immediately usable without infrastructure. TanStack Query is installed at the app boundary for the network adapter phase; local state handles optimistic first-milestone interaction without Redux.

## Domain package

`packages/domain/src/erosion.ts` owns all lifespan constants and calculations:

- six-hour fallback base lifespan
- +5 minutes for a positive vote
- −10 minutes for a negative vote
- 72-hour maximum life
- five-minute minimum remaining immediately after a vote

The exact historical formula is unknown. Consumers must import the centralized implementation rather than recreate these numbers.

`privacy.ts` projects stored identity into an anonymous or identified public union. `posts.ts` validates authenticated authorship, same-university creation, content presence, and body length. These rules mirror database checks/RLS but do not replace server authorization.

## Data model

The PostgreSQL migration defines normalized tables for:

- universities and profiles
- posts, post votes, and responses
- conversations, participants, and messages
- reports and blocks

Post coordinates, radius, university, and audience are first-class fields. `base_expires_at` preserves the chosen starting lifespan; `expires_at` is the current authoritative result.

## Anonymous identity protection

Post and response base tables contain `author_id` for routing, moderation, ownership, and abuse handling. Ordinary authenticated roles receive no direct `SELECT` privilege on those tables because row-level security cannot hide individual columns.

Clients read through security-definer functions:

- `get_active_posts(audience, university)`
- `get_post_responses(post_id)`

Both functions return author profile fields only when `anonymous = false`. Anonymous rows produce null author fields and may return the historically documented gender label. The TypeScript `VisiblePost` union also makes an `author` field impossible on the anonymous branch.

Anonymous content never appears in public profile post lists. A private response conversation retains real participant IDs internally while presenting `Anonymous poster` to the responder.

## Feed and expiration querying

`get_active_posts` uses database `now()`, not the client clock, and filters `expires_at > now()`. The offline adapter uses the same predicate only for demo behavior; it is not authoritative outside demo mode.

The local Streamer (`classmates` in the database enum for compatibility) restricts to a university. Anonymous Ticker requires anonymous posts with ticker audience. National Posts requires identified national-audience posts. Blocked authors are excluded inside the server-side feed function.

## Voting and erosion

`post_votes` has a composite primary key `(post_id, voter_id)`, enforcing one current vote per user per post. Changing a vote updates that row; removing a vote deletes it. A database trigger recounts vote values and updates `posts.expires_at` using database time and the centralized fallback constants mirrored in SQL.

The local adapter updates vote counts and lifespan synchronously for immediate feedback. Raw message rows are deliberately not added to the Realtime publication because a WAL payload would contain `sender_id`, undermining anonymous private-response presentation. A production network adapter should use a private sanitized Broadcast channel and invalidate `get_conversation_messages`; post votes can use ordinary Query invalidation instead of subscribing every feed row.

## RLS summary

- Profiles: authenticated read; self-update only.
- Posts: self-insert at the profile's university; self-delete; no direct reads.
- Votes: a user controls only their own composite-key row.
- Responses: self-insert/self-delete; no direct reads.
- Messages: read/insert only when a security-definer membership predicate confirms participation.
- Reports and blocks: owned by the acting user.

## Seed strategy

The local TypeScript seed and SQL seed both provide 25 profiles, 60 posts, more than 100 public responses, votes, five universities, and Mizzou-dominant conversation. SQL IDs are deterministic so tests and research scripts can refer to stable rows.

Generated demo media is intentionally separated under `apps/mobile/assets/erodr/demo/` and documented as non-historical.

Supplied original Erodr logo/radar files are isolated under `apps/mobile/assets/erodr/original/`. User screenshots containing personal photographs remain reference-only and are never used as seeded profile or post media.
