"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Tag } from "@/components/ui/tag"
import { Button } from "@/components/ui/button"

export function Header() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" })
  }

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        background: "rgba(8, 9, 15, 0.6)",
        borderBottom: "1px solid var(--cobalt-border)",
      }}
    >
      <div className="flex items-center justify-between py-4 max-w-[1240px] mx-auto px-[clamp(20px,4vw,56px)]">
        <Logo />

        <nav className="hidden md:flex gap-7">
          {["services", "process", "pricing", "about", "contact"].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="relative text-sm capitalize text-[--fg2] hover:text-[--fg1] transition-colors duration-[240ms] py-1.5 px-0.5 group"
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
              <span
                className="absolute left-0 bottom-0 h-px bg-[--cobalt-300] transition-all duration-[240ms]"
                style={{ right: "100%", transition: "right var(--d-base) var(--ease-out)" }}
                data-nav-underline
              />
            </button>
          ))}
          <Link
            href="/projects"
            className="relative text-sm capitalize text-[--fg2] hover:text-[--fg1] transition-colors duration-[240ms] py-1.5 px-0.5"
          >
            Work
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Tag dot>AVAILABLE Q3</Tag>
          <Button
            onClick={() => scrollTo("contact")}
            className="rounded-full gap-2 bg-[--cobalt-500] hover:bg-[--cobalt-400] text-white border-0"
            style={{ boxShadow: "var(--glow-cobalt-soft)" }}
          >
            Hire me
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>
    </header>
  )
}
