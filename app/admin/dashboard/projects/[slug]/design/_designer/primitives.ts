import type { Prisma } from "../../../../../../../generated/prisma/client"
import type { ProjectSection, CoverImage } from "@/lib/data/projects"

export type PrismaProject = Prisma.ProjectGetPayload<object>

export const SECTION_KINDS = [
  { value: "prose", label: "Prose" },
  { value: "split", label: "Split (text + meta)" },
  { value: "callout", label: "Callout" },
  { value: "code", label: "Code block" },
  { value: "gallery", label: "Gallery" },
  { value: "wide-image", label: "Wide image" },
  { value: "aside-image", label: "Aside image" },
  { value: "quote", label: "Quote" },
  { value: "stats", label: "Stats" },
] as const

export type SectionKind = (typeof SECTION_KINDS)[number]["value"]

export function defaultCover(): CoverImage {
  return {
    cover: "linear-gradient(135deg,#023BE6,#5A82FB)",
    mono: "Aa",
    label: "",
  }
}

export function defaultSection(kind: SectionKind): ProjectSection {
  switch (kind) {
    case "prose":
      return { kind, eyebrow: "", heading: "", italic: "", body: "" }
    case "split":
      return { kind, eyebrow: "", heading: "", italic: "", body: "", meta: [] }
    case "callout":
      return { kind, label: "NOTE", heading: "", body: "" }
    case "code":
      return { kind, eyebrow: "", heading: "", language: "typescript", code: "", caption: "" }
    case "gallery":
      return { kind, eyebrow: "", heading: "", images: [defaultCover()] }
    case "wide-image":
      return { kind, eyebrow: "", heading: "", image: defaultCover() }
    case "aside-image":
      return { kind, eyebrow: "", heading: "", body: "", image: defaultCover() }
    case "quote":
      return { kind, body: "", who: "" }
    case "stats":
      return { kind, eyebrow: "", heading: "", stats: [{ value: "", label: "" }] }
  }
}

// ── Shared CSS class strings ──────────────────────────────────────────────────

export const inputCls =
  "w-full px-2.5 py-2 bg-(--ink-900) border border-(--cobalt-border) rounded-[6px] text-(--fg1) font-sans text-[13px] outline-none box-border"

export const selectCls = inputCls

export const textareaCls =
  "w-full px-2.5 py-2 bg-(--ink-900) border border-(--cobalt-border) rounded-[6px] text-(--fg1) font-sans text-[13px] outline-none resize-y box-border"

export const monoInputCls =
  "w-full px-2.5 py-2 bg-(--ink-900) border border-(--cobalt-border) rounded-[6px] text-(--fg1) font-mono text-[12px] outline-none box-border"

export const labelCls =
  "block font-mono text-[11px] uppercase tracking-[0.1em] text-(--fg3) mb-[5px]"

export const rowCls = "flex flex-col gap-[5px] mb-[14px]"

export const iconBtnCls =
  "inline-flex items-center justify-center w-7 h-7 border border-(--cobalt-border) rounded-[6px] bg-transparent text-(--fg3) cursor-pointer text-[16px] shrink-0"

export const addRowBtnCls =
  "inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-(--cobalt-border) rounded-[6px] bg-transparent text-(--cobalt-300) cursor-pointer font-mono text-[11px] tracking-[0.08em] mb-2"
