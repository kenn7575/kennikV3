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
      <div className="mx-auto flex max-w-310 items-center justify-between px-[clamp(20px,4vw,56px)] py-4">
        <Logo />

        <nav className="hidden gap-7 md:flex">
          {["services", "process", "pricing", "about", "contact"].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="group relative px-0.5 py-1.5 text-sm text-[--fg2] capitalize transition-colors duration-240 hover:text-[--fg1]"
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
              <span
                className="absolute bottom-0 left-0 h-px bg-[--cobalt-300] transition-all duration-240"
                style={{
                  right: "100%",
                  transition: "right var(--d-base) var(--ease-out)",
                }}
                data-nav-underline
              />
            </button>
          ))}
          <Link
            href="/projects"
            className="relative px-0.5 py-1.5 text-sm text-[--fg2] capitalize transition-colors duration-240 hover:text-[--fg1]"
          >
            Work
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Tag dot>AVAILABLE Q3</Tag>
          <Button
            onClick={() => scrollTo("contact")}
            className="gap-2 rounded-full border-0 bg-[--cobalt-500] text-white hover:bg-[--cobalt-400]"
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
