# Kennik.dk — Portfolio Site

Next.js 16 portfolio for Kennik Kollemorten, freelance full-stack developer based in Copenhagen.

## Stack

- **Next.js 16** with App Router and React Server Components
- **TypeScript** strict mode
- **Tailwind CSS v4** (PostCSS, no config file — tokens via `@theme` in `globals.css`)
- **shadcn/ui** style: `radix-nova`, base color: `neutral`
- **Google Fonts**: Instrument Serif (display headings), Geist (body), Geist Mono (labels/code)

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

## File Structure

```
app/
  layout.tsx          — Root layout; loads all 3 Google fonts
  page.tsx            — Async server component; fetches all data, renders all sections
  globals.css         — COBALT design tokens + Tailwind theme + layout utilities

components/
  sections/           — One file per page section (server or client as needed)
    header.tsx        — Sticky nav, "use client" for scroll handlers
    hero.tsx          — WebGL prism bg, "use client"
    services.tsx      — 2-col grid, server component (async)
    problems.tsx      — Problem/solution table, server component
    work.tsx          — Project cards with tilt effect, "use client"
    process.tsx       — 5-step process list, server component
    stack.tsx         — Tech stack cards + marquee, server component
    why.tsx           — 3-col reason grid, server component
    availability.tsx  — CTA strip, "use client"
    about.tsx         — Bio + photo placeholder, server component
    testimonials.tsx  — Testimonial cards, server component
    pricing.tsx       — 3 package cards with featured state, "use client"
    faq.tsx           — Accordion, "use client" for open state
    contact.tsx       — Contact form with success state, "use client"
    footer.tsx        — Footer with gradient text, server component

  ui/
    button.tsx        — shadcn Button (pre-existing)
    tag.tsx           — Pill badge with optional dot indicator
    eyebrow.tsx       — Monospace uppercase label with left rule
    logo.tsx          — Kennik.dk SVG logo
    marquee.tsx       — Infinite scrolling marquee strip
    scroll-cue.tsx    — Animated scroll indicator
    section-head.tsx  — Section title + eyebrow wrapper (row or stacked)
    reveal-text.tsx   — Word-by-word fade-in animation, "use client"
    scramble.tsx      — Number scramble on scroll into view, "use client"
    prism-background.tsx — WebGL raymarched prism shader, "use client"

hooks/
  use-magnetic.ts     — Magnetic hover drift for buttons
  use-tilt.ts         — 3D card tilt on cursor
  use-reveal.ts       — IntersectionObserver reveal (.in class)
  use-scramble.ts     — Number scramble animation

lib/
  data/               — "use server" repository files (placeholder JSON → future DB)
    services.ts       — 4 service offerings
    projects.ts       — 4 featured projects
    problems.ts       — 8 problem/solution pairs
    process.ts        — 5 process steps
    stack.ts          — 6 tech stack groups + marquee items
    why.ts            — 6 differentiators
    testimonials.ts   — 4 client testimonials
    packages.ts       — 3 pricing packages
    faq.ts            — 8 FAQ items
  utils.ts            — cn() Tailwind merge utility
```

## Data Layer Pattern

All data lives in `lib/data/*.ts` as typed arrays behind async getter functions marked `"use server"`. This allows a future database swap without touching components:

```ts
// lib/data/services.ts
"use server"
export async function getServices(): Promise<Service[]> {
  return SERVICES // swap for: return db.query(...)
}
```

Page-level data fetching is done in `app/page.tsx` using `Promise.all()`. Sections that need data accept it as props. Sections with server-side data needs are async server components.

## Adding shadcn Components

```bash
npx shadcn add <component>
```

Components land in `components/ui/`. Style them with COBALT CSS variables.

## Sections Order

Header → Hero → Services → Problems → Work → Process → Stack → Why → Availability → About → Testimonials → Pricing → FAQ → Contact → Footer

## Key Implementation Notes

- Dark mode is the default and only theme (set in `theme-provider.tsx`)
- `--cobalt-border` replaces Tailwind's `border-border` for section dividers
- The prism WebGL canvas uses `position: absolute` inside the hero section
- All section titles use `font-family: var(--font-display)` (Instrument Serif) with `font-weight: 400`
- Italic text within headings (`<em>`) uses `color: var(--fg2)` for the muted serif style
- Cobalt accents (`<em style={{ color: "var(--cobalt-300)" }}>`) are used sparingly
- `.shell` = max-width 1240px container with fluid padding
- `.section` = vertical padding with `section + section` border-top dividers
