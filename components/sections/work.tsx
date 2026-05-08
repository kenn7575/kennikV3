"use client"

import { ArrowUpRight } from "lucide-react"
import { Tag } from "@/components/ui/tag"
import { SectionHead } from "@/components/ui/section-head"
import { useTilt } from "@/hooks/use-tilt"
import type { Project } from "@/lib/data/projects"

function ProjectCard({ project }: { project: Project }) {
  const tiltRef = useTilt(4)

  return (
    <a
      ref={tiltRef as React.RefObject<HTMLAnchorElement>}
      href={`#case/${project.slug}`}
      className="relative flex flex-col gap-6 no-underline text-inherit transition-all duration-[240ms] cursor-pointer group"
      style={{
        borderRadius: "28px 28px 28px 28px / 32px 32px 32px 32px",
        border: "1px solid var(--cobalt-border)",
        background: "var(--surface)",
        padding: 28,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Halo */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity duration-[480ms] pointer-events-none"
        style={{ background: "var(--mesh-soft)", borderRadius: "inherit" }}
      />

      {/* Cover */}
      <div
        className="relative overflow-hidden transition-transform duration-[480ms] group-hover:-translate-y-0.5 group-hover:scale-[1.01]"
        style={{
          aspectRatio: "16/10",
          borderRadius: 16,
          border: "1px solid var(--cobalt-border)",
        }}
      >
        <div className="absolute inset-0" style={{ background: project.cover }} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "var(--grain-url)",
            mixBlendMode: "overlay",
            opacity: 0.4,
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: "rgba(255,255,255,0.86)",
            letterSpacing: "-0.04em",
            textShadow: "0 2px 24px rgba(0,0,0,0.5)",
          }}
        >
          {project.monogram}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-[1] flex justify-between items-start gap-4">
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              lineHeight: 1,
              letterSpacing: "-0.025em",
              fontWeight: 400,
              color: "var(--fg1)",
              margin: 0,
            }}
          >
            {project.name}{" "}
            <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>— {project.italic}</em>
          </h3>
          <p style={{ margin: "8px 0 0", color: "var(--fg2)", fontSize: 14.5, lineHeight: 1.5 }}>
            {project.desc}
          </p>
          <div className="flex gap-2 flex-wrap mt-3.5">
            <Tag>{project.year}</Tag>
            <Tag>{project.duration}</Tag>
            <Tag dot={project.status === "LIVE"} strong>
              {project.status}
            </Tag>
          </div>
        </div>
        <span
          className="inline-flex items-center justify-center flex-shrink-0 transition-all duration-[240ms] group-hover:rotate-[-45deg] group-hover:bg-[--cobalt-500] group-hover:border-[--cobalt-500] group-hover:text-white"
          style={{
            width: 44,
            height: 44,
            border: "1px solid var(--cobalt-border)",
            borderRadius: 999,
          }}
        >
          <ArrowUpRight size={18} />
        </span>
      </div>
    </a>
  )
}

function StatsRibbon() {
  const stats = [
    { v: "42+", label: "SHIPPED PROJECTS · CAREER" },
    { v: "€2.4M", label: "CLIENT ARR INFLUENCED · 2025" },
    { v: "96%", label: "REPEAT-CLIENT RATE · 5 YR" },
    { v: "0", label: "P0 INCIDENTS · LAST 18 MOS" },
  ]

  return (
    <div
      className="grid mt-14"
      style={{
        gridTemplateColumns: "repeat(4, 1fr)",
        borderTop: "1px solid var(--cobalt-border)",
        borderBottom: "1px solid var(--cobalt-border)",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex flex-col gap-1.5 py-7 px-5"
          style={{
            borderRight: i < stats.length - 1 ? "1px solid var(--cobalt-border-lo)" : "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              lineHeight: 1,
              letterSpacing: "-0.035em",
              color: "var(--fg1)",
            }}
          >
            {s.v}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--fg3)",
            }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

type WorkProps = {
  projects: Project[]
}

export function Work({ projects }: WorkProps) {
  return (
    <section id="work" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="FEATURED PROJECTS · 2024 — 2026"
          title={
            <>
              Things I&apos;ve <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>built lately.</em>
            </>
          }
          description="A small slice — each one shipped, each one hurt a little. Click through for the post-mortems and the actual numbers."
          row
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <StatsRibbon />
      </div>
    </section>
  )
}
