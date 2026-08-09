# Reconstruction Notes

## Evidence policy

The workspace contained no supplied references. The implementation therefore uses three confidence labels:

- **Observed:** directly visible in `reference/external/erodr-app-store-2017.png`.
- **Documented:** described by contemporaneous Erodr/company coverage.
- **Approximation:** required for a functioning prototype but not established by available evidence.

UI constants include comments indicating which values were pixel-sampled and which are inferred. Original assets will replace placeholders without changing feature architecture.

## Era selection

The only visual artifact is from 2017, while the strongest behavioral descriptions are from 2013–2014. The first milestone uses the 2017 Classmates feed shell and preserves earlier historically documented behaviors (Streamer proximity, Anonymous Ticker, private responses, user-set lifespan). This is a composite restoration baseline, not proof that every control coexisted in one release.

## Major approximations

1. **Erosion formula.** No exact formula was found. The prototype uses the requested fallback: six-hour base life, +5 minutes per positive vote, −10 minutes per negative vote, 72-hour cap, and five-minute minimum immediately following a vote. All constants are centralized.
2. **Visual erosion.** Remaining-life tint/opacity is subtle and confined to a slim time rail/clock treatment so it does not introduce a game-like metaphor absent from the screenshot.
3. **Bottom navigation.** Observed silhouettes are mapped to Classmates, Responses, Compose, Alerts, and Profile. Labels remain hidden, matching the screenshot.
4. **Anonymous identity.** Anonymous posts display `Anonymous` plus gender only when seeded/provided. Client-facing post types omit author identifiers and profile joins for anonymous rows.
5. **Location.** Demo coordinates are centered on Mizzou and “Nearest” uses simulated distances. Schema supports latitude, longitude, and radius.
6. **Login/splash/composer/profile.** These are built with observed green/cyan/gray, square geometry, dense dividers, and period iOS typography, but layouts remain inferred until original captures are supplied.
7. **Expiration retention.** Rows remain in the prototype database for administrative research but active views/RPCs exclude `expires_at <= now()` using database time.

## First-milestone implementation plan

1. Establish a strict TypeScript Expo Router workspace and shared erosion domain package.
2. Recreate the observed Classmates shell and feed density with reusable historical components.
3. Add deterministic local demo data so the app opens fully populated without Supabase credentials.
4. Implement composer, anonymous/identified presentation, optimistic voting, expiration filtering, public responses, profiles, and private response routing.
5. Add normalized Supabase schema, security-definer public feed projection, RLS, rich SQL seed generation, and setup docs.
6. Verify type checks/domain tests and capture a modern iPhone render for comparison when an Expo simulator is available.

## Open evidence requests

Highest-value additions are original splash/login captures, an uncompressed logo/app icon, composer screenshots, response/private-message screens, profile/gallery captures, and any documentation of the erosion formula.

## Dependency advisory note

An `npm audit --omit=dev` check on 2026-08-08 reports 22 moderate/high advisories through the current Expo SDK 57 / React Native / Metro build stack. npm's proposed automatic fix downgrades to Expo 53 and React Native 0.72, which is incompatible with the official SDK 57 scaffold and was not applied. There are no critical advisories and no hand-written vulnerable package use identified. Recheck Expo's upstream releases before distributing beyond the internal prototype; do not run `npm audit fix --force` without reviewing the SDK compatibility change.
