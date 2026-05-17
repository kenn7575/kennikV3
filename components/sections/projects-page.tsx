"use client"

import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/data/projects"

/* ------------------------------------------------------------------ */
/*  Static bench data — "what's on the bench right now"                 */
/* ------------------------------------------------------------------ */

const BENCH = [
  { t: "Resolving p99 spikes on a SaaS billing API", c: "ON · WK 3" },
  { t: "A small Rust LSP for SQL migrations", c: "SHIP · WK 1" },
  { t: "Mentoring two devs on a Rails-to-Hono port", c: "ON · WK 5" },
]

/* ------------------------------------------------------------------ */
/*  Hero                                                                 */
/* ------------------------------------------------------------------ */

function PIHero({ projects }: { projects: Project[] }) {
  const yearNums = projects.map((p) => parseInt(p.year)).filter(Boolean)
  const yearMin = yearNums.length ? Math.min(...yearNums) : 2022
  const yearMax = yearNums.length ? Math.max(...yearNums) : 2026

  return (
    <section className="relative isolate overflow-hidden pt-[clamp(80px,12vw,160px)] pb-[clamp(48px,6vw,72px)]">
      {/* Mesh */}
      <div className="absolute inset-[-20%] z-0 [background:radial-gradient(at_20%_30%,rgba(2,59,230,0.28),transparent_50%),radial-gradient(at_80%_10%,rgba(178,102,255,0.16),transparent_55%)]" />
      {/* Grain */}
      <div className="absolute inset-0 z-0 [background-image:var(--grain-url)] opacity-40 mix-blend-overlay" />

      <div className="shell relative z-1">
        {/* Breadcrumbs */}
        <div className="mb-14 flex items-center gap-3.5 font-mono text-[12px] tracking-[0.14em] text-[--fg3] uppercase">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[--fg2] transition-colors duration-(--d-fast) hover:text-[--cobalt-300]"
          >
            <ArrowLeft size={12} />
            Kennik.dk
          </Link>
          <span className="text-[--fg-mute]">/</span>
          <span>Projects</span>
        </div>

        {/* Big title */}
        <h1 className="m-0 font-display text-[clamp(4rem,14vw,13rem)] leading-[0.86] font-normal tracking-tighter text-balance text-[--fg1]">
          Selected{" "}
          <em style={{ color: "var(--cobalt-300)" }} className="italic">
            work.
          </em>
        </h1>

        {/* Sub row: meta + blurb */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-7 pt-7">
          {/* Blurb */}
          <p className="m-0 max-w-[44ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-normal text-pretty text-[--fg2]">
            A complete, honest record. The work I&apos;d want a stranger to see
            — plus some open-source side-projects tagged{" "}
            <em className="text-[--ember] italic">STEALTH</em>, mixed in for
            context.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Bench                                                                */
/* ------------------------------------------------------------------ */

function PIBench() {
  return (
    <section className="border-t border-b border-[--cobalt-border] bg-white/[0.012] py-7">
      <div className="shell">
        <div
          className="bench-inner grid items-start gap-9"
          style={{ gridTemplateColumns: "180px 1fr" }}
        >
          {/* Label */}
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-[--cobalt-300] uppercase">
              <span className="h-1.5 w-1.5 shrink-0 animate-[pulse_2.4s_ease-out_infinite] rounded-full bg-[--success] shadow-[0_0_8px_var(--success)]" />
              CURRENTLY · ON THE BENCH
            </span>
            <span className="font-display text-[20px] leading-[1.1] tracking-[-0.02em] text-[--fg1] italic">
              What I&apos;m <em className="italic">working on</em> right now.
            </span>
          </div>

          {/* List */}
          <div className="flex flex-col border-t border-[--cobalt-border-lo]">
            {BENCH.map((b, i) => (
              <div
                key={i}
                className={`grid items-baseline gap-6 py-3 ${i < BENCH.length - 1 ? "border-b border-[--cobalt-border-lo]" : ""}`}
                style={{ gridTemplateColumns: "1fr 140px" }}
              >
                <span className="font-sans text-base leading-[1.4] text-[--fg1]">
                  {b.t}
                </span>
                <span className="text-right font-mono text-[11px] tracking-[0.14em] text-[--fg3] uppercase">
                  {b.c}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Featured — alternating big rows                                      */
/* ------------------------------------------------------------------ */

function FeatCover({ project }: { project: Project }) {
  return (
    <div className="feat-cover relative aspect-5/4 overflow-hidden rounded-[28px] border border-[--cobalt-border-hi] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)] transition-transform duration-(--d-slow) ease-out">
      <div
        className="feat-cover-grad absolute inset-0 transition-transform duration-(--d-slow) ease-out"
        style={{ background: project.cover }}
      />
      <div className="absolute inset-0 [background-image:var(--grain-url)] opacity-35 mix-blend-overlay" />
      <div className="absolute inset-0 flex items-center justify-center font-display text-[clamp(5rem,14vw,12rem)] tracking-tighter text-white/94 italic [text-shadow:0_4px_32px_rgba(0,0,0,0.5)]">
        {project.monogram}
      </div>
    </div>
  )
}

function PIFeatured({ items }: { items: Project[] }) {
  return (
    <section className="flex flex-col border-t border-[--cobalt-border] py-[clamp(64px,10vw,120px)]">
      <div className="shell">
        {items.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className={`pi-feat-row relative grid items-center gap-[clamp(40px,6vw,80px)] py-[clamp(40px,6vw,80px)] text-inherit no-underline ${i < items.length - 1 ? "border-b border-[--cobalt-border-lo]" : ""}`}
            style={{ gridTemplateColumns: i % 2 === 0 ? "6fr 5fr" : "5fr 6fr" }}
          >
            {/* Index label */}
            <span className="absolute top-9 left-0 font-mono text-[11px] tracking-[0.18em] text-[--cobalt-300] uppercase">
              FEATURED / {String(i + 1).padStart(2, "0")}
            </span>

            {/* Cover (reversed on odd) */}
            <div style={{ order: i % 2 === 1 ? 1 : 0 }}>
              <FeatCover project={p} />
            </div>

            {/* Text */}
            <div
              className="flex flex-col gap-6 self-center"
              style={{ order: i % 2 === 1 ? 0 : 1 }}
            >
              {/* Eyebrow row */}
              <span className="inline-flex items-center gap-3 font-mono text-[12px] tracking-[0.16em] text-[--fg3] uppercase">
                <span className="text-[--fg1]">{p.year}</span>
                <span className="inline-block h-px w-8 bg-[--fg-mute]" />
                <span>{p.duration}</span>
                <span className="inline-block h-px w-8 bg-[--fg-mute]" />
                <span
                  className={
                    p.status === "LIVE"
                      ? "text-[--success]"
                      : "text-[--warning]"
                  }
                >
                  {p.status}
                </span>
              </span>

              {/* Heading */}
              <h2 className="m-0 font-display text-[clamp(2.6rem,5.5vw,5rem)] leading-[0.96] font-normal tracking-[-0.045em] text-balance text-[--fg1]">
                {p.name}{" "}
                <em style={{ color: "var(--fg2)" }} className="italic">
                  — {p.italic}
                </em>
              </h2>

              {/* Description */}
              <p className="m-0 max-w-[50ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.55] text-[--fg2]">
                {p.desc}
              </p>

              {/* CTA */}
              <span className="feat-cta inline-flex items-center gap-3 self-start rounded-full border border-[--cobalt-border-hi] px-5.5 py-3.5 text-sm font-medium text-[--fg1] transition-[background,border-color,color] duration-(--d-base)">
                View case study <ArrowUpRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Grid card                                                             */
/* ------------------------------------------------------------------ */

function PICard({ p, size }: { p: Project; size: "xl" | "lg" | "md" | "sm" }) {
  const isRescue = p.status === "RESCUED"
  const isStealth = p.status === "STEALTH"

  const badgeCls = isStealth
    ? "bg-[rgba(255,106,61,0.18)] text-[--ember] border-[rgba(255,106,61,0.4)]"
    : isRescue
      ? "bg-[rgba(255,200,87,0.18)] text-[--warning] border-[rgba(255,200,87,0.4)]"
      : "bg-black/40 text-white/[0.92] border-white/[0.18]"

  const spanCols = size === "xl" ? 2 : size === "lg" ? 2 : 1
  const spanRows = size === "xl" ? 2 : 1
  const minH = size === "xl" ? 320 : 200

  return (
    <Link
      href={`/work/${p.slug}`}
      className="pi-card group relative flex flex-col overflow-hidden rounded-[22px_22px_22px_22px/26px_26px_26px_26px] border border-[--cobalt-border] bg-[--ink-900] text-inherit no-underline transition-[border-color,transform] duration-(--d-base) ease-(--ease-spring)"
      style={{ gridColumn: `span ${spanCols}`, gridRow: `span ${spanRows}` }}
    >
      {/* Cover */}
      <div
        className="relative flex-1 overflow-hidden border-b border-[--cobalt-border-lo]"
        style={{ minHeight: minH }}
      >
        <div
          className="card-grad absolute inset-0 transition-transform duration-(--d-slow) ease-out"
          style={{ background: p.cover }}
        />
        <div className="absolute inset-0 [background-image:var(--grain-url)] opacity-35 mix-blend-overlay" />
        <div
          className={`absolute inset-0 flex items-center justify-center font-display tracking-tighter text-white/92 italic [text-shadow:0_4px_24px_rgba(0,0,0,0.5)] ${size === "xl" ? "text-[clamp(4rem,7vw,7.5rem)]" : "text-[clamp(2.4rem,5vw,4.5rem)]"}`}
        >
          {p.monogram}
        </div>

        {/* Badge top-left */}
        <span
          className={`absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full border px-2.25 py-1 font-mono text-[10px] tracking-[0.16em] uppercase backdrop-blur-sm ${badgeCls}`}
        >
          <span className="h-1.25 w-1.25 rounded-full bg-current shadow-[0_0_6px_currentColor]" />
          {isStealth ? "STEALTH" : isRescue ? "RESCUED" : p.status}
        </span>

        {/* Year top-right */}
        <span className="absolute top-3.5 right-3.5 rounded-full bg-black/40 px-2.25 py-1 font-mono text-[11px] tracking-[0.12em] text-white/85 backdrop-blur-sm">
          {p.year}
        </span>
      </div>

      {/* Meta footer */}
      <div
        className={`relative flex flex-col gap-2 ${size === "xl" ? "px-7 pt-5.5 pb-6" : "px-5.5 pt-4.5 pb-5"}`}
      >
        <h3
          className={`m-0 font-display leading-[1.05] font-normal tracking-tight text-[--fg1] ${size === "xl" ? "text-[36px]" : "text-[24px]"}`}
        >
          {p.name} <em className="text-[--fg2] italic">— {p.italic}</em>
        </h3>
        {size !== "sm" && (
          <p
            className={`m-0 leading-normal text-[--fg2] ${size === "xl" ? "text-[15.5px]" : "text-sm"}`}
          >
            {p.desc}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between border-t border-dashed border-[--cobalt-border] pt-3 font-mono text-[11px] tracking-[0.12em] text-[--fg3] uppercase">
          <span>{p.duration}</span>
          <span className="card-arr inline-flex h-7 w-7 items-center justify-center rounded-full border border-[--cobalt-border-hi] text-[--fg1] transition-[background,border-color,transform,color] duration-(--d-base) ease-(--ease-spring)">
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Grid — varied-size cards                                             */
/* ------------------------------------------------------------------ */

const SIZES: ("xl" | "lg" | "md" | "sm")[] = [
  "lg",
  "md",
  "md",
  "md",
  "lg",
  "sm",
  "md",
  "lg",
  "md",
  "sm",
  "md",
  "sm",
  "sm",
]

function PIGrid({ items }: { items: Project[] }) {
  return (
    <section className="border-t border-[--cobalt-border] py-[clamp(64px,10vw,120px)]">
      <div className="shell">
        {/* Head */}
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[12px] font-medium tracking-[0.12em] text-[--fg3] uppercase">
              EVERY PROJECT — CLIENT + EXPERIMENT
            </span>
            <h2 className="mt-2.5 mb-0 font-display text-[clamp(2rem,4vw,3rem)] leading-none font-normal tracking-[-0.035em] text-[--fg1]">
              The <em className="text-[--fg2] italic">rest of it.</em>
            </h2>
          </div>
          <p className="m-0 max-w-[44ch] text-base leading-[1.55] text-[--fg2]">
            Sized roughly by how much I learned. Rescued and Stealth projects
            are tagged so you can tell the story at a glance.
          </p>
        </div>

        {/* Masonry grid */}
        <div className="pi-grid grid grid-flow-dense auto-rows-[minmax(280px,auto)] grid-cols-[repeat(4,1fr)] gap-4.5">
          {items.map((p, i) => (
            <PICard key={p.slug} p={p} size={SIZES[i % SIZES.length]} />
          ))}
        </div>

        {/* Foot note */}
        <div className="mt-9 text-center font-mono text-[12px] tracking-[0.12em] text-[--fg3] uppercase">
          THAT&apos;S THE WHOLE LIST ·{" "}
          <Link
            href="/#contact"
            className="text-[--fg1] underline underline-offset-[0.3em]"
          >
            START SOMETHING NEW
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Root component                                                        */
/* ------------------------------------------------------------------ */

export function ProjectsPage({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, 2)
  const rest = projects.slice(2)

  return (
    <>
      <PIHero projects={projects} />
      <PIBench />
      <PIFeatured items={featured} />
      <PIGrid items={rest} />
    </>
  )
}
