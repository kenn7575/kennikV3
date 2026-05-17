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
    <div className="sticky top-0 z-50 border-b border-(--cobalt-border) bg-[rgba(8,9,15,0.65)] saturate-140 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-310 items-center justify-between px-[clamp(20px,4vw,56px)] py-3.5">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 rounded-full border border-(--cobalt-border) bg-transparent px-3.5 py-2 text-[13px] font-normal text-(--fg2) no-underline transition-[border-color,color] duration-140 hover:border-(--cobalt-border-hi) hover:text-(--fg1)"
        >
          <ArrowLeft size={14} /> <span>All work</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <Tag dot={project.status === "LIVE"} strong>
            {project.status}
          </Tag>
          <Tag>{project.year}</Tag>
          <Tag>{project.duration}</Tag>
        </div>
      </div>
      <div
        className="linear absolute -bottom-px left-0 h-px bg-(--cobalt-500) [box-shadow:0_0_8px_var(--cobalt-500)] transition-[width] duration-80"
        style={{ width: pct + "%" }}
      />
    </div>
  )
}
