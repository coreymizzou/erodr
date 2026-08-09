# Reconstruction Notes

## Evidence policy

The reconstruction uses three confidence labels:

- **Observed:** directly visible in the firsthand files under `reference/user-supplied/` or the later screenshot under `reference/external/`.
- **Documented:** described by contemporaneous Erodr/company coverage.
- **Approximation:** required for a functioning prototype but not established by available evidence.

UI constants include comments indicating which values were pixel-sampled and which are inferred. Supplied original assets are preserved byte-for-byte and used where applicable.

## Era selection

The target era is now the firsthand iPhone 5/5s interface visible in the user-supplied screenshots, broadly 2013–2015. Its white `erodr` header, green-outline Streamer cards, labeled Streamer/Map/Post/Chat/Profile tabs, and period profile treatment supersede the later 2017 green/cyan Classmates shell. The 2017 screenshot remains useful evidence for later evolution but is no longer the primary visual target.

## Major approximations

1. **Erosion formula.** No exact formula was found. The prototype uses the requested fallback: six-hour base life, +5 minutes per positive vote, −10 minutes per negative vote, 72-hour cap, and five-minute minimum immediately following a vote. All constants are centralized.
2. **Visual erosion.** The firsthand cards show a clock/age but do not prove a remaining-life meter. The prototype communicates erosion through age and feed expiration without adding a game-like rail.
3. **Bottom navigation.** Streamer, Map, Post, Chat, and Profile labels and silhouettes follow `1NFJTtrL.png`; icon shapes are the closest bundled Ionicons until original glyphs are supplied.
4. **Anonymous identity.** Anonymous posts display `Anonymous Male` or `Anonymous Female` when seeded/provided. Client-facing post types omit author identifiers and profile joins for anonymous rows.
5. **Location.** Demo coordinates are centered on Mizzou and “Nearest” uses simulated distances. Schema supports latitude, longitude, and radius.
6. **Login/splash/composer.** Login and composer remain period-compatible inferences. Splash uses the supplied radar asset. Profile now follows two supplied captures closely.
7. **Expiration retention.** Rows remain in the prototype database for administrative research but active views/RPCs exclude `expires_at <= now()` using database time.

## First-milestone implementation plan

1. Establish a strict TypeScript Expo Router workspace and shared erosion domain package.
2. Recreate the observed Streamer shell and feed density with reusable historical components.
3. Add deterministic local demo data so the app opens fully populated without Supabase credentials.
4. Implement composer, anonymous/identified presentation, optimistic voting, expiration filtering, public responses, profiles, and private response routing.
5. Add normalized Supabase schema, security-definer public feed projection, RLS, rich SQL seed generation, and setup docs.
6. Verify type checks/domain tests and capture a modern iPhone render for comparison when an Expo simulator is available.

## Open evidence requests

Highest-value additions are original splash/login captures, composer screenshots, response/private-message screens, original navigation/action glyphs, and any documentation of the erosion formula. The supplied logo/app icon and profile captures resolved major earlier gaps.

## Dependency advisory note

An `npm audit --omit=dev` check on 2026-08-08 reports 22 moderate/high advisories through the current Expo SDK 57 / React Native / Metro build stack. npm's proposed automatic fix downgrades to Expo 53 and React Native 0.72, which is incompatible with the official SDK 57 scaffold and was not applied. There are no critical advisories and no hand-written vulnerable package use identified. Recheck Expo's upstream releases before distributing beyond the internal prototype; do not run `npm audit fix --force` without reviewing the SDK compatibility change.
