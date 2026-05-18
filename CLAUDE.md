# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Kennik.dk — Portfolio Site

Next.js 16 portfolio for Kennik Kollemorten, freelance full-stack developer based in Svendborg.

## Stack

- **Next.js 16** with App Router and React Server Components
- **TypeScript** strict mode
- **Tailwind CSS v4** (PostCSS, no config file — tokens via `@theme` in `globals.css`)
- **shadcn/ui** style: `radix-nova`, base color: `neutral`
- **Google Fonts**: Instrument Serif (display headings), Geist (body), Geist Mono (labels/code)
- **Database**: PostgreSQL via Prisma (adapter-pg); client generated to `generated/prisma/`
- **Auth**: better-auth v1 (email/password, single-user admin)
- **Storage**: Firebase Admin SDK + Cloud Storage (`vennik-v3.firebasestorage.app`)
- **Error tracking**: Sentry (tunneled via `/monitoring`)

## Commands

```bash
npm run dev          # Next.js + Turbopack
npm run build        # prisma generate + migrate deploy + next build
npm run lint         # ESLint
npm run format       # Prettier
npm run typecheck    # tsc --noEmit
npm run seed         # prisma/seed.ts via tsx
```

No test framework is configured — there are no test files in this repo.

## Design System — COBALT

Dark-mode first. All tokens are CSS custom properties defined in `app/globals.css`.

**Key variables:**

- `--cobalt-500` (#023BE6) — primary brand color
- `--bg` / `--fg1` / `--fg2` / `--fg3` — semantic background/text
- `--cobalt-border` / `--cobalt-border-hi` / `--cobalt-border-lo` — border variants
- `--font-display` — Instrument Serif (h1, h2, display text, italic accents)
- `--font-sans` — Geist (body, nav, labels)
- `--font-mono` — Geist Mono (eyebrows, tags, monospaced labels)
- `--mesh` / `--mesh-soft` — gradient backgrounds
- `--glow-cobalt` / `--glow-cobalt-soft` — cobalt glow shadows
- `--ease-spring` / `--ease-emph` — custom easing curves

Layout utilities: `.shell` = 1240px container with fluid padding; `.section` = vertical padding with `section + section` border-top dividers.

## Architecture

### Public Site

`app/page.tsx` is an async RSC that fetches all data via `Promise.all()` and passes it as props to section components. All section components live in `components/sections/`. Client components are only used where interactivity is required (scroll handlers, WebGL, form state, animations).

**Sections order:** Header → Hero → Services → Problems → Work → Process → Stack → Why → Availability → About → Testimonials → Pricing → FAQ → Contact → Footer

### Data Layer

`lib/data/*.ts` files are `"use server"` modules exposing async getter functions backed by Prisma queries. The shape of each getter is the source of truth for what the section components accept as props.

### Admin Dashboard

All admin routes live under `app/admin/`. Access is protected by `middleware.ts` which checks for a `better-auth.session_token` cookie and redirects unauthenticated requests to `/admin/login`.

- `/admin/login` — sign in
- `/admin/signup` — one-time initial setup (blocked once a user exists)
- `/admin/dashboard/` — overview
- `/admin/dashboard/projects/[slug]/design` — visual section builder for project pages

Server actions in `app/admin/dashboard/projects/actions.ts` handle all project CRUD and call `revalidatePath()` / `revalidateTag()` to bust Next.js cache.

### Project Design Builder

Each project has a `sections` JSON field (stored as Prisma JSON column). The designer at `app/admin/dashboard/projects/[slug]/design/` lets you add/reorder/edit typed sections (prose, split, callout, code, gallery, wide-image, aside-image, quote, stats, hero). The rendered output is previewed via `POST /api/admin/preview-project` which returns inline HTML using COBALT tokens. Inline markup: `**bold**` and `*italic cobalt*`.

### Image Storage

`POST /api/admin/upload-image` accepts `multipart/form-data` with `file` (max 8 MB, image types only) and `slug`. It uploads to Firebase Storage at `project-images/{slug}/{uuid}.{ext}`, makes the file public, and returns `{ url: "https://storage.googleapis.com/..." }`. Cleanup helpers in `lib/storage.ts`: `deleteStorageFile()`, `deleteProjectImages()`, `extractCoverUrls()`.

### Authentication

`lib/session.ts` exports `getSession()` — call this in server actions and API routes to verify the user is logged in. Session lifetime is 7 days; cookie cache is 5 minutes.

## Environment Variables

| Variable                        | Purpose                                                           |
| ------------------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL`                  | Local PostgreSQL connection string                                |
| `DATABASE_URL_PROD`             | Neon pooler connection (used in production build)                 |
| `BETTER_AUTH_SECRET`            | Session encryption key                                            |
| `BETTER_AUTH_URL`               | Auth base URL (server-side)                                       |
| `NEXT_PUBLIC_BETTER_AUTH_URL`   | Auth base URL (client-side)                                       |
| `DISCORD_BOT_TOKEN`             | Contact form notifications                                        |
| `DISCORD_CHANNEL_ID`            | Discord target channel                                            |
| `SENTRY_AUTH_TOKEN`             | Source map uploads                                                |
| `FIREBASE_STORAGE_BUCKET`       | GCS bucket name                                                   |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Base64-encoded service account (prod); local dev uses a JSON file |

## Key Implementation Notes

- Dark mode is the default and only theme
- `--cobalt-border` replaces Tailwind's `border-border` for section dividers
- All section titles use `font-family: var(--font-display)` (Instrument Serif) with `font-weight: 400`
- Italic text within headings (`<em>`) uses `color: var(--fg2)` for the muted serif style
- Cobalt accents (`<em style={{ color: "var(--cobalt-300)" }}>`) are used sparingly
- The prism WebGL canvas uses `position: absolute` inside the hero section
- Prisma client is generated to `generated/prisma/` (not the default location) — import from there
- `next.config.mjs` whitelists `storage.googleapis.com` for Next.js Image

## Adding shadcn Components

```bash
npx shadcn add <component>
```

Components land in `components/ui/`. Style them with COBALT CSS variables.
