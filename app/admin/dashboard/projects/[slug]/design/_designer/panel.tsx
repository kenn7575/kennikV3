"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export function Panel({
  title,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string
  badge?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-2.5 overflow-hidden rounded-[10px] border border-(--cobalt-border)">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between border-none bg-(--ink-900) px-3.5 py-3 font-sans text-[13px] font-medium text-(--fg1)"
      >
        <span className="flex items-center gap-2">
          {title}
          {badge && (
            <span className="font-mono text-[10px] tracking-widest text-(--cobalt-300) uppercase">
              {badge}
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-(--fg3)" />
        ) : (
          <ChevronDown size={14} className="text-(--fg3)" />
        )}
      </button>
      {open && (
        <div className="border-t border-t-(--cobalt-border-lo) px-3.5 pt-3.5 pb-2">
          {children}
        </div>
      )}
    </div>
  )
}
