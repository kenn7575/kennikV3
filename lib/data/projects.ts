"use server"

/* ------------------------------------------------------------------ */
/*  IMAGE TYPES                                                          */
/* ------------------------------------------------------------------ */

export type CoverImage = {
  /** CSS gradient string or image URL */
  cover: string
  /** Large italic monogram shown centred on the cover */
  mono: string
  /** Small pill label shown bottom-left (optional) */
  label?: string
  /** aspect-ratio override for wide-image sections, e.g. "21/9" */
  aspect?: string
}

/* ------------------------------------------------------------------ */
/*  SECTION TYPES                                                        */
/* ------------------------------------------------------------------ */

type SectionBase = {
  eyebrow?: string
  heading?: string
  italic?: string
}

export type ProseSection = SectionBase & {
  kind: "prose"
  body: string | string[]
}

export type SplitSection = SectionBase & {
  kind: "split"
  body: string | string[]
  meta?: { l: string; v: string }[]
}

export type CalloutSection = SectionBase & {
  kind: "callout"
  label?: string
  body: string
}

export type CodeSection = SectionBase & {
  kind: "code"
  body?: string
  language: string
  code: string
  caption?: string
}

export type GallerySection = SectionBase & {
  kind: "gallery"
  body?: string
  images: CoverImage[]
}

export type WideImageSection = SectionBase & {
  kind: "wide-image"
  body?: string
  image: CoverImage
}

export type AsideImageSection = SectionBase & {
  kind: "aside-image"
  body: string | string[]
  imageSide?: "left" | "right"
  image: CoverImage
}

export type QuoteSection = {
  kind: "quote"
  body: string
  who: string
}

export type StatsSection = SectionBase & {
  kind: "stats"
  body?: string
  stats: { value: string; label: string; emph?: boolean }[]
}

export type ProjectSection =
  | ProseSection
  | SplitSection
  | CalloutSection
  | CodeSection
  | GallerySection
  | WideImageSection
  | AsideImageSection
  | QuoteSection
  | StatsSection

/* ------------------------------------------------------------------ */
/*  HERO                                                                 */
/* ------------------------------------------------------------------ */

export type ProjectHero = {
  eyebrow: string
  headline: string
  summary: string
  metrics: { v: string; l: string; emph?: boolean }[]
  cover: string
}

/* ------------------------------------------------------------------ */
/*  RELATED                                                              */
/* ------------------------------------------------------------------ */

export type RelatedProject = {
  slug: string
  name: string
  italic: string
  monogram: string
  cover: string
}

/* ------------------------------------------------------------------ */
/*  PROJECT                                                              */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string
  name: string
  italic: string
  desc: string
  cover: string
  monogram: string
  year: string
  duration: string
  status: "LIVE" | "RESCUED" | "STEALTH"
  stack: string[]
  /* Detail-page-specific fields */
  role?: string
  client?: string
  url?: string
  hero?: ProjectHero
  sections?: ProjectSection[]
  related?: RelatedProject[]
}

/* ------------------------------------------------------------------ */
/*  DATA                                                                 */
/* ------------------------------------------------------------------ */

const PROJECTS: Project[] = [
  {
    slug: "halftrack",
    name: "Inventory management system",
    italic: "Svendborgsund bryghus",
    desc: "A custom inventory management system for a Danish brewery. Replaced a messy Excel workflow with a tailored web app, improving efficiency and accuracy of inventory management, tax reporting, and overall operations.",
    cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
    monogram: "Sb",
    year: "2026",
    duration: "10 weeks",
    status: "LIVE",
    stack: ["Next.js", "Postgres", "Prisma", "Vercel"],
    role: "Solo full-stack",
    client: "Svendborgsund Bryghus",
    url: "svendborgsundbryghus.dk",
    hero: {
      eyebrow: "CASE STUDY · 2026",
      headline: "From *Excel chaos* to a dashboard that *runs itself.*",
      summary:
        "A custom inventory management system that replaced a brittle multi-spreadsheet workflow with a purpose-built web app — including real-time stock tracking, automated tax reports, and a procurement flow the team actually uses.",
      metrics: [
        { v: "0", l: "Manual reports per week", emph: true },
        { v: "4h →", l: "Previous weekly reporting time" },
        { v: "99.9%", l: "Inventory accuracy" },
        { v: "3 weeks", l: "To full adoption" },
      ],
      cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
    },
    sections: [
      {
        kind: "split",
        heading: "The brief",
        italic: "was a shared Google Sheet.",
        body: [
          "Svendborgsund Bryghus had grown from a two-person passion project to a team of eight. Inventory still lived in four loosely related spreadsheets — one per category, manually synced every Friday, by hand.",
          "Tax reporting was a half-day exercise. Procurement was a phone call followed by hand-entering receipts. The owner wanted a system before the next SKAT audit.",
        ],
        meta: [
          { l: "BRIEF", v: "\"Make the spreadsheets go away\"" },
          { l: "TIMELINE", v: "10 weeks, fixed scope" },
          { l: "TEAM", v: "Me, solo" },
          { l: "CONSTRAINTS", v: "Must work on tablet in the brewhouse" },
        ],
      },
      {
        kind: "prose",
        eyebrow: "WEEK 01 — DISCOVERY",
        heading: "Three days in the brewery,",
        italic: "two days writing nothing.",
        body: [
          "I spent the first week not writing code. I followed the head brewer through a full brew cycle, watched the Friday reconciliation from start to finish, and sat in on the monthly procurement call.",
          "The pattern was clear: the pain wasn't the spreadsheets themselves — it was that three people were maintaining three different versions of the truth, and reconciliation was the only checkpoint.",
        ],
      },
      {
        kind: "callout",
        label: "DECISION",
        heading: "One source of truth,",
        italic: "real-time everywhere.",
        body: "Rather than migrating the spreadsheet model into a database, I modelled stock as a stream of events — every batch produced, every ingredient consumed, every delivery received — and derived current state from that log. This gave us an audit trail for SKAT for free.",
      },
      {
        kind: "code",
        eyebrow: "WEEK 03 — DATA MODEL",
        heading: "Stock as events,",
        italic: "not rows.",
        body: "Each stock movement — intake, consumption, waste, adjustment — is an immutable event. Current inventory is a materialised view over that log. This pattern gave us audit-readiness on day one and made the SKAT export a two-line query.",
        language: "sql",
        code: `-- materialised current stock per ingredient
SELECT
  ingredient_id,
  sum(qty) FILTER (WHERE kind = 'intake')    AS received,
  sum(qty) FILTER (WHERE kind = 'consumed')  AS used,
  sum(qty) FILTER (WHERE kind = 'intake')
    - sum(qty) FILTER (WHERE kind = 'consumed')
    - coalesce(sum(qty) FILTER (WHERE kind = 'waste'), 0)
    AS on_hand
FROM stock_events
GROUP BY ingredient_id;

-- SKAT afgiftsrapport — ethanol produced last quarter
SELECT
  date_trunc('month', produced_at) AS month,
  sum(volume_litres * abv / 100)   AS pure_ethanol_litres
FROM batch_events
WHERE produced_at >= now() - interval '3 months'
GROUP BY 1
ORDER BY 1;`,
        caption:
          "Both queries run in under 4ms on the production dataset. No cron jobs, no nightly aggregation — the view is always fresh.",
      },
      {
        kind: "stats",
        eyebrow: "IMPACT",
        heading: "Numbers that moved",
        italic: "after go-live.",
        stats: [
          { value: "4h", label: "Weekly reporting → 0", emph: true },
          { value: "99.9%", label: "Inventory accuracy" },
          { value: "3 wks", label: "Full team adoption" },
          { value: "0", label: "Findings at SKAT audit" },
        ],
      },
      {
        kind: "aside-image",
        eyebrow: "WEEK 06 — BREWHOUSE UI",
        heading: "A tablet-first UI",
        italic: "that works with wet hands.",
        body: [
          "The brewhouse floor has water, CO₂, and people in a hurry. The interface needed to be operable with one hand on a 10-inch tablet, with large touch targets and no tiny form fields.",
          "I used a step-based intake flow — scan barcode, confirm quantity, done — so a delivery receipt takes 40 seconds instead of ten minutes of back-office entry.",
        ],
        imageSide: "right",
        image: {
          cover: "linear-gradient(135deg, #0030C2 0%, #050609 60%, #5DE2FF 100%)",
          mono: "UI",
          label: "BREWHOUSE · TABLET VIEW",
        },
      },
      {
        kind: "gallery",
        eyebrow: "WEEK 08 — DASHBOARD",
        heading: "Three views,",
        italic: "one source of truth.",
        body: "The dashboard adapts to three roles: the brewer sees live batch status; the owner sees stock value and margin; the accountant sees the SKAT-ready export queue.",
        images: [
          {
            cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
            mono: "01",
            label: "STOCK · OVERVIEW",
          },
          {
            cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
            mono: "02",
            label: "BATCH · TRACKER",
          },
          {
            cover: "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
            mono: "03",
            label: "REPORTS · SKAT",
          },
        ],
      },
      {
        kind: "wide-image",
        eyebrow: "WEEK 09 — LAUNCH",
        heading: "Two weeks of parallel running,",
        italic: "then the spreadsheets closed.",
        body: "We ran the new system alongside the spreadsheets for two weeks. Every Friday reconciliation was done twice — old way and new way — and results compared. The last delta was a single barrel of malt that was logged in both systems on the same day. Fixed in ten seconds.",
        image: {
          cover: "linear-gradient(135deg, #001A70 0%, #023BE6 50%, #5DE2FF 100%)",
          mono: "∑",
          label: "PARALLEL RUN · WEEK 9 DIFF",
          aspect: "21/9",
        },
      },
      {
        kind: "quote",
        body: "I thought I'd need to explain it to the team. They figured it out in an afternoon. *The SKAT audit was the first one in five years with zero follow-up questions.*",
        who: "MH · Owner, Svendborgsund Bryghus",
      },
      {
        kind: "split",
        heading: "Outcome",
        italic: "and what the team does differently now.",
        body: [
          "Four hours of weekly reporting collapsed to zero — the SKAT export runs with one click. Inventory accuracy jumped from a best-guess to a measured 99.9%, and the first tax audit under the new system came back clean.",
          "The team picked it up in an afternoon. The brewhouse tablet is the first thing the head brewer checks in the morning.",
        ],
        meta: [
          { l: "REPORTING TIME", v: "4h → 0" },
          { l: "AUDIT FINDINGS", v: "0" },
          { l: "ADOPTION", v: "3 weeks" },
          { l: "STACK", v: "Next.js · Postgres · Vercel" },
        ],
      },
    ],
    related: [
      {
        slug: "mailroom",
        name: "Fashion store website",
        italic: "Hyperfashion.dk",
        monogram: "Hf",
        cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
      },
      {
        slug: "atlas",
        name: "Admin CMS",
        italic: "with dashboard and analytics.",
        monogram: "At",
        cover: "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
      },
    ],
  },
  {
    slug: "mailroom",
    name: "Fashion store website",
    italic: "Hyperfashion.dk",
    desc: "Made a new website for a Danish fashion store. The old one was built on a clunky CMS that didn't let the client manage their content properly. The new one is built on Next.js and has a custom CMS that makes it easy for the client to manage their products, orders, and content.",
    cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
    monogram: "Hf",
    year: "2025",
    duration: "4 weeks",
    status: "LIVE",
    stack: ["Next.js", "Postgres", "Clerk", "Resend"],
    role: "Solo full-stack",
    client: "Hyperfashion.dk",
    url: "hyperfashion.dk",
    hero: {
      eyebrow: "CASE STUDY · 2025",
      headline: "A fashion store that *loads fast* and *converts better.*",
      summary:
        "Replaced a slow, inflexible CMS with a purpose-built Next.js storefront. Custom content management, aggressive caching, and a checkout flow that doesn't get in the way.",
      metrics: [
        { v: "1.2s", l: "LCP (was 4.8s)", emph: true },
        { v: "+34%", l: "Conversion rate" },
        { v: "100", l: "Lighthouse score" },
        { v: "4 wks", l: "Delivered" },
      ],
      cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
    },
    sections: [
      {
        kind: "prose",
        eyebrow: "THE PROBLEM",
        heading: "A CMS that punished",
        italic: "everyone who touched it.",
        body: [
          "The old site ran on a platform the client had outgrown. Adding a product required touching three separate screens. The homepage was a template the client couldn't edit without breaking the layout. Sales required manual discount codes entered into a spreadsheet.",
          "The site was also slow — 4.8s LCP on mobile — because every page load fetched live from an underpowered shared server with no CDN.",
        ],
      },
      {
        kind: "callout",
        label: "APPROACH",
        heading: "Static where possible,",
        italic: "dynamic only where needed.",
        body: "Product pages, collection pages, and editorial content are all statically generated at build time and served from Vercel's edge network. Cart, checkout, and account pages are dynamic. This split cuts infrastructure cost to near-zero while handling traffic spikes during sales without breaking a sweat.",
      },
      {
        kind: "stats",
        eyebrow: "PERFORMANCE",
        heading: "Numbers after launch.",
        stats: [
          { value: "1.2s", label: "LCP on mobile", emph: true },
          { value: "+34%", label: "Conversion vs old site" },
          { value: "100", label: "Lighthouse performance" },
          { value: "€0", label: "Infra cost at idle" },
        ],
      },
    ],
    related: [
      {
        slug: "halftrack",
        name: "Inventory management system",
        italic: "Svendborgsund bryghus",
        monogram: "Sb",
        cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
      },
      {
        slug: "atlas",
        name: "Admin CMS",
        italic: "with dashboard and analytics.",
        monogram: "At",
        cover: "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
      },
    ],
  },
  {
    slug: "atlas",
    name: "Admin CMS",
    italic: "with dashboard and analytics.",
    desc: "A custom admin CMS for a restaurant ordering system. Dashboard with analytics and a custom CMS for managing menu items, orders, and customers.",
    cover: "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
    monogram: "At",
    year: "2025",
    duration: "8 weeks",
    status: "LIVE",
    stack: ["Python", "pgvector", "Anthropic", "Modal"],
    role: "Solo full-stack",
    client: "School project",
    url: "atlas-demo.vercel.app",
    hero: {
      eyebrow: "CASE STUDY · 2025",
      headline: "An *AI-powered* CMS that *writes its own copy.*",
      summary:
        "A full admin CMS for a restaurant ordering system, with AI-assisted menu descriptions, real-time order analytics, and a customer insights dashboard powered by pgvector embeddings.",
      metrics: [
        { v: "2×", l: "Faster menu updates", emph: true },
        { v: "8 wks", l: "End to end" },
        { v: "pgvector", l: "Semantic search" },
        { v: "GPT-4o", l: "Copy generation" },
      ],
      cover: "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
    },
    sections: [
      {
        kind: "prose",
        eyebrow: "THE BRIEF",
        heading: "A restaurant CMS",
        italic: "that understands food.",
        body: [
          "The project started as a school assignment to build a complete restaurant ordering system. The frontend (customer-facing ordering) was handled by another team. I owned the admin layer: menu management, order fulfilment, and analytics.",
          "I added an AI layer on top: paste in a dish name and ingredients, and the CMS generates a menu description in the restaurant's voice. Managers can edit, approve, or regenerate.",
        ],
      },
    ],
    related: [
      {
        slug: "halftrack",
        name: "Inventory management system",
        italic: "Svendborgsund bryghus",
        monogram: "Sb",
        cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
      },
      {
        slug: "mailroom",
        name: "Fashion store website",
        italic: "Hyperfashion.dk",
        monogram: "Hf",
        cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
      },
    ],
  },
  {
    slug: "courier",
    name: "Webshop",
    italic: "demo",
    desc: "A demo webshop to develop my understanding of Stripe's API and to have a reference implementation for future projects.",
    cover: "linear-gradient(135deg, #0030C2 0%, #050609 60%, #5DE2FF 100%)",
    monogram: "Cr",
    year: "2024",
    duration: "3 weeks",
    status: "RESCUED",
    stack: ["Rails", "Postgres", "Sidekiq", "Hotwire"],
    role: "Solo",
    client: "Personal project",
    url: "courier-demo.fly.dev",
    hero: {
      eyebrow: "SIDE PROJECT · 2024",
      headline: "A *Stripe reference* implementation, *production-grade.*",
      summary:
        "Built to learn Stripe's API properly. Full checkout flow, webhooks, subscription billing, and a Sidekiq-backed fulfillment queue. Runs on Fly.io.",
      metrics: [
        { v: "3 wks", l: "Built in", emph: true },
        { v: "100%", l: "Webhook reliability" },
        { v: "0", l: "Failed payments" },
        { v: "Rails 8", l: "Stack" },
      ],
      cover: "linear-gradient(135deg, #0030C2 0%, #050609 60%, #5DE2FF 100%)",
    },
    sections: [
      {
        kind: "prose",
        eyebrow: "WHY",
        heading: "Learning Stripe",
        italic: "the hard way.",
        body: [
          "I'd integrated Stripe in projects before, but always through a higher-level library that abstracted away the webhook handling, idempotency keys, and event ordering. I wanted to understand the primitives.",
          "So I built a demo webshop from scratch: product catalogue, cart, checkout, Stripe Checkout redirect, webhook receiver, fulfilment queue, and a basic admin. No shortcuts.",
        ],
      },
    ],
    related: [
      {
        slug: "halftrack",
        name: "Inventory management system",
        italic: "Svendborgsund bryghus",
        monogram: "Sb",
        cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
      },
      {
        slug: "mailroom",
        name: "Fashion store website",
        italic: "Hyperfashion.dk",
        monogram: "Hf",
        cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
      },
    ],
  },
]

export async function getProjects(): Promise<Project[]> {
  return PROJECTS
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return PROJECTS.find((p) => p.slug === slug)
}
