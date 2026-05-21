"use client"

import { useEffect, useState } from "react"
import type { Project } from "@/lib/data/projects"

const GRADIENT_A = "linear-gradient(135deg, #023BE6, #5A82FB)"
const GRADIENT_B = "linear-gradient(135deg, #1A1F3A, #023BE6)"
const GRADIENT_C = "linear-gradient(135deg, #5A82FB, #B266FF)"
const GRADIENT_D = "linear-gradient(135deg, #050609, #1A1F3A)"

const SHOWCASE_PROJECT: Project = {
  slug: "showcase",
  name: "Section Showcase",
  italic: "every kind, once.",
  desc: "Reference page showing one example of every project section kind.",
  cover: GRADIENT_A,
  monogram: "S",
  year: "2026",
  duration: "—",
  status: "STEALTH",
  stack: ["Next.js", "React", "TypeScript", "Tailwind"],
  role: "Reference",
  client: "Internal",
  url: "kennik.dk/admin",
  hero: {
    eyebrow: "KIND — hero",
    headline: "Section showcase — every kind, once.",
    summary:
      "One example of every section type, labeled with its kind so you can pick the right one when designing a project page.",
    metrics: [
      { v: "9", l: "Section kinds" },
      { v: "1", l: "Hero block", emph: true },
      { v: "10", l: "Examples total" },
    ],
    cover: GRADIENT_A,
  },
  sections: [
    {
      kind: "prose",
      eyebrow: "KIND — prose",
      heading: "Prose",
      italic: "long-form text.",
      body: [
        "A two-column layout with an eyebrow + heading on the left and flowing paragraphs on the right. Use this for narrative copy: background, decisions, retrospectives.",
        "Body can be a single string or an array of strings — each entry renders as its own paragraph. Inline **bold** and *italic cobalt* markup is supported throughout.",
      ],
    },
    {
      kind: "split",
      eyebrow: "KIND — split",
      heading: "Split",
      italic: "with metadata.",
      body: "Same two-column layout as prose, but with an optional metadata grid below the body. Good for project facts — year, role, stack, status — that benefit from a structured table.",
      meta: [
        { l: "Year", v: "2026" },
        { l: "Role", v: "Solo full-stack" },
        { l: "Stack", v: "Next.js, Prisma, Postgres" },
        { l: "Status", v: "Live" },
      ],
    },
    {
      kind: "callout",
      label: "KIND — callout",
      heading: "A highlighted note",
      italic: "stands out.",
      body: "Cobalt-tinted background with a label on the left. Use for **important asides**, *warnings*, or single key takeaways that need to break the flow.",
    },
    {
      kind: "code",
      eyebrow: "KIND — code",
      heading: "Code",
      italic: "syntax block.",
      body: "Optional intro text on the right, with a monospaced code block underneath. Language label shows in the top bar, optional caption sits below.",
      language: "typescript",
      code: `export async function getProject(slug: string) {
  const row = await prisma.project.findUnique({
    where: { slug },
  })
  return row ? rowToProject(row) : undefined
}`,
      caption: "lib/data/projects.ts",
    },
    {
      kind: "gallery",
      eyebrow: "KIND — gallery",
      heading: "Gallery",
      italic: "image grid.",
      body: "Two-column header (heading + optional body) followed by a 2- or 3-column image grid. Each image is a cover with a large italic monogram overlay.",
      images: [
        { cover: GRADIENT_A, mono: "A", label: "Alpha" },
        { cover: GRADIENT_B, mono: "B", label: "Beta" },
        { cover: GRADIENT_C, mono: "C", label: "Gamma" },
      ],
    },
    {
      kind: "wide-image",
      eyebrow: "KIND — wide-image",
      heading: "Wide image",
      italic: "full-bleed cover.",
      body: "A single hero-style image spanning the shell width. Aspect ratio is configurable — defaults to 16/9, this one uses 21/9.",
      image: { cover: GRADIENT_B, mono: "W", aspect: "21/9" },
    },
    {
      kind: "aside-image",
      eyebrow: "KIND — aside-image (right)",
      heading: "Aside image",
      italic: "text + image.",
      body: [
        "Text on one side, a 4:5 portrait-style image on the other. Use `imageSide: \"right\"` (default) or `\"left\"` to flip the layout.",
        "Good for callouts that need a visual anchor without going full-width.",
      ],
      imageSide: "right",
      image: { cover: GRADIENT_C, mono: "R" },
    },
    {
      kind: "aside-image",
      eyebrow: "KIND — aside-image (left)",
      heading: "Aside image",
      italic: "flipped layout.",
      body: "Same section with `imageSide: \"left\"` — image moves to the left column, text to the right.",
      imageSide: "left",
      image: { cover: GRADIENT_D, mono: "L" },
    },
    {
      kind: "quote",
      body: "A centered pull-quote in display italic, framed by a cobalt glow. Keep it short — one sentence reads best.",
      who: "KIND — quote",
    },
    {
      kind: "stats",
      eyebrow: "KIND — stats",
      heading: "Stats",
      italic: "metric grid.",
      body: "A bordered row of numeric stats. Set `emph: true` on one entry to render its value in italic cobalt for emphasis.",
      stats: [
        { value: "9", label: "Section kinds" },
        { value: "100%", label: "Type-safe", emph: true },
        { value: "1240px", label: "Shell width" },
        { value: "RSC", label: "Server-rendered" },
      ],
    },
  ],
}

export function ShowcaseIframe() {
  const [html, setHtml] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/preview-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(SHOWCASE_PROJECT),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Preview failed: ${res.status}`)
        return res.text()
      })
      .then((text) => {
        if (!cancelled) setHtml(text)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error")
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div
        style={{
          padding: 32,
          border: "1px solid var(--cobalt-border)",
          borderRadius: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--fg2)",
        }}
      >
        Failed to load preview: {error}
      </div>
    )
  }

  if (!html) {
    return (
      <div
        style={{
          height: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid var(--cobalt-border)",
          borderRadius: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--fg3)",
        }}
      >
        Loading preview…
      </div>
    )
  }

  return (
    <iframe
      srcDoc={html}
      title="Section showcase"
      style={{
        width: "100%",
        height: "85vh",
        border: "1px solid var(--cobalt-border)",
        borderRadius: 16,
        background: "var(--ink-950)",
      }}
    />
  )
}
