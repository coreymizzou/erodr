# Erodr Restoration Prototype

This repository reconstructs the historical Erodr college social network for private product research. It is a restoration baseline, not a redesign. The main visual reference is an attributed 2017 App Store screenshot; the historical behavior model also uses contemporaneous 2013–2014 product descriptions.

The app opens in a zero-configuration demo mode with a populated Mizzou community. Supabase migrations and seed SQL provide the production-shaped backend path without making local exploration depend on external infrastructure.

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- Expo Go or an iOS Simulator for mobile development
- Optional: Supabase CLI and a Supabase project for backend integration

## Run the app

```bash
npm install
npm run ios
```

Other targets:

```bash
npm start
npm run android
npm run web
```

On the login screen, choose **Demo Login · Mizzou**. Demo mode is intentionally local and deterministic; no credentials, `.edu` verification, or network connection are required.

## Demo identity

- User: Maya Jefferson
- University: University of Missouri (Mizzou)
- Demo email shown in the UI: `maya.jefferson@missouri.edu`
- Supabase seed password for all seeded auth rows: `demo1234`

The local Expo demo does not authenticate against Supabase. The seed password is only for a local Supabase project loaded from `supabase/seed/seed.sql`.

## Supabase setup

1. Create a project or start the local Supabase stack.
2. Copy `.env.example` to `.env.local` and set the project URL and public anon key.
3. Apply `supabase/migrations/202608080001_initial_erodr.sql`.
4. Load `supabase/seed/seed.sql` in a local/research environment.
5. Restart Expo so `EXPO_PUBLIC_*` variables are included in the client bundle.

Never add a service-role key to an Expo environment. The mobile client is prepared in `apps/mobile/src/lib/supabase.ts`; the current first-milestone screens deliberately remain on the offline demo adapter until backend endpoint integration is enabled.

## Verification

```bash
npm run typecheck
npm test
cd apps/mobile
EXPO_NO_TELEMETRY=1 npx expo export --platform web --output-dir /tmp/erodr-web-export
```

The tests cover erosion calculations, expiration filtering, vote changes, post-draft authorization, deletion ownership, and anonymous identity projection.

## Project structure

```text
apps/mobile/                 Expo Router React Native app
packages/domain/             Shared erosion, privacy, and post rules
supabase/migrations/         PostgreSQL schema, functions, triggers, and RLS
supabase/seed/               25 users, 60 posts, 108 responses, votes
reference/                   Historical evidence, separated by provenance
docs/                        Audit, screen map, terminology, architecture notes
```

## Historical evidence and uncertainty

Start with:

- `docs/REFERENCE_INVENTORY.md`
- `docs/SCREEN_MAP.md`
- `docs/TERMINOLOGY.md`
- `docs/MISSING_ASSETS.md`
- `docs/RECONSTRUCTION_NOTES.md`

No original project assets were present when work began. The three bundled campus images are clearly labeled generated demo media. The lowercase splash/login wordmark is live-text placeholder treatment, not claimed original artwork.
