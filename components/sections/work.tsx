"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Tag } from "@/components/ui/tag"
import { SectionHead } from "@/components/ui/section-head"
import { useTilt } from "@/hooks/use-tilt"
import type { Project } from "@/lib/data/projects"
import type { ProjectStat } from "@/lib/data/stats"

function ProjectCard({ project }: { project: Project }) {
  const tiltRef = useTilt(4)

  return (
    <a
      ref={tiltRef as React.RefObject<HTMLAnchorElement>}
      href={`/work/${project.slug}`}
      className="group relative flex cursor-pointer flex-col gap-6 text-inherit no-underline transition-all duration-240"
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
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-480 group-hover:opacity-70"
        style={{ background: "var(--mesh-soft)", borderRadius: "inherit" }}
      />

      {/* Cover */}
      <div
        className="relative overflow-hidden transition-transform duration-480 group-hover:-translate-y-0.5 group-hover:scale-[1.01]"
        style={{
          aspectRatio: "16/10",
          borderRadius: 16,
          border: "1px solid var(--cobalt-border)",
        }}
      >
        {project.coverImage ? (
          <Image src={project.coverImage} alt={project.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: project.cover }} />
        )}
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
      <div className="relative z-1 flex items-start justify-between gap-4">
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
            <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
              — {project.italic}
            </em>
          </h3>
          <p
            style={{
              margin: "8px 0 0",
              color: "var(--fg2)",
              fontSize: 14.5,
              lineHeight: 1.5,
            }}
          >
            {project.desc}
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <Tag>{project.year}</Tag>
            <Tag>{project.duration}</Tag>
            <Tag dot={project.status === "LIVE"} strong>
              {project.status}
            </Tag>
          </div>
        </div>
        <span
          className="inline-flex shrink-0 items-center justify-center transition-all duration-240 group-hover:-rotate-45 group-hover:border-[--cobalt-500] group-hover:bg-[--cobalt-500] group-hover:text-white"
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

function StatsRibbon({ stats }: { stats: ProjectStat[] }) {
  return (
    <div
      className="mt-14 grid grid-cols-2 lg:grid-cols-4"
      style={{
        borderTop: "1px solid var(--cobalt-border)",
        borderBottom: "1px solid var(--cobalt-border)",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-col gap-1.5 px-5 py-7 ${
            i % 2 === 0 ? "border-r border-[--cobalt-border-lo]" : ""
          } ${
            i < stats.length - 2
              ? "border-b border-[--cobalt-border-lo] lg:border-b-0"
              : ""
          } ${
            i < stats.length - 1
              ? "border-[--cobalt-border-lo] lg:border-r"
              : "lg:border-r-0"
          }`}
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
  stats: ProjectStat[]
}

export function Work({ projects, stats }: WorkProps) {
  return (
    <section id="work" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="FEATURED PROJECTS · 2023 — 2026"
          title={
            <>
              Things I&apos;ve{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                built lately.
              </em>
            </>
          }
          description="A preview of my recent work — each one shipped, each one hurt a little. But each one also added some value."
          row
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <StatsRibbon stats={stats} />
      </div>
    </section>
  )
}
