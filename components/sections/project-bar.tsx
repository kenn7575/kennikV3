"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Tag } from "@/components/ui/tag"
import type { Project } from "@/lib/data/projects"

export function PDBar({ project }: { project: Project }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-50 backdrop-blur-[14px] saturate-[140%] bg-[rgba(8,9,15,0.65)] border-b border-[var(--cobalt-border)]">
      <div className="flex justify-between items-center py-[14px] px-[clamp(20px,4vw,56px)] max-w-[1240px] mx-auto">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 py-2 px-[14px] text-[13px] font-normal bg-transparent text-[var(--fg2)] rounded-full border border-[var(--cobalt-border)] no-underline transition-[border-color,color] duration-[140ms] hover:border-[var(--cobalt-border-hi)] hover:text-[var(--fg1)]"
        >
          <ArrowLeft size={14} /> <span>All work</span>
        </Link>
        <div className="flex items-center gap-[10px]">
          <Tag dot={project.status === "LIVE"} strong>
            {project.status}
          </Tag>
          <Tag>{project.year}</Tag>
          <Tag>{project.duration}</Tag>
        </div>
      </div>
      <div
        className="absolute left-0 -bottom-px h-px bg-[var(--cobalt-500)] [box-shadow:0_0_8px_var(--cobalt-500)] transition-[width] duration-[80ms] linear"
        style={{ width: pct + "%" }}
      />
    </div>
  )
}
