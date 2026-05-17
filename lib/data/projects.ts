"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "../../generated/prisma/client"

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
/*  HELPERS                                                              */
/* ------------------------------------------------------------------ */

function rowToProject(row: Prisma.ProjectGetPayload<object>): Project {
  return {
    slug: row.slug,
    name: row.name,
    italic: row.italic,
    desc: row.desc,
    cover: row.cover,
    monogram: row.monogram,
    year: row.year,
    duration: row.duration,
    status: row.status as Project["status"],
    stack: row.stack,
    role: row.role ?? undefined,
    client: row.client ?? undefined,
    url: row.url ?? undefined,
    hero: row.hero ? (row.hero as unknown as ProjectHero) : undefined,
    sections: row.sections ? (row.sections as unknown as ProjectSection[]) : undefined,
    related: undefined, // resolved separately in getProject
  }
}

function rowToRelated(row: Prisma.ProjectGetPayload<object>): RelatedProject {
  return {
    slug: row.slug,
    name: row.name,
    italic: row.italic,
    monogram: row.monogram,
    cover: row.cover,
  }
}

/* ------------------------------------------------------------------ */
/*  QUERIES                                                              */
/* ------------------------------------------------------------------ */

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await prisma.project.findMany({ orderBy: { order: "asc" } })
    return rows.map(rowToProject)
  },
  ["projects"],
  { revalidate: 3600, tags: ["projects"] },
)

export async function getProject(slug: string): Promise<Project | undefined> {
  return unstable_cache(
    async (): Promise<Project | undefined> => {
      const row = await prisma.project.findUnique({ where: { slug } })
      if (!row) return undefined
      const project = rowToProject(row)
      if (row.relatedSlugs.length > 0) {
        const relatedRows = await prisma.project.findMany({
          where: { slug: { in: row.relatedSlugs } },
        })
        // preserve the order specified in relatedSlugs
        const bySlug = Object.fromEntries(relatedRows.map((r) => [r.slug, r]))
        project.related = row.relatedSlugs
          .filter((s) => bySlug[s])
          .map((s) => rowToRelated(bySlug[s]))
      }
      return project
    },
    ["project", slug],
    { revalidate: 3600, tags: ["projects"] },
  )()
}
