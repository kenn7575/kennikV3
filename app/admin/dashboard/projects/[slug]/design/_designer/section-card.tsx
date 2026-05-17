"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, GripVertical, Trash2, Eye, EyeOff } from "lucide-react"
import type { ProjectSection } from "@/lib/data/projects"
import { SECTION_KINDS, SectionKind, selectCls, iconBtnCls } from "./primitives"
import { SectionEditor } from "./section-editors"

export function SectionCard({
  s,
  index,
  total,
  onMove,
  onRemove,
  onChange,
  onKindChange,
}: {
  s: ProjectSection
  index: number
  total: number
  onMove: (from: number, to: number) => void
  onRemove: (i: number) => void
  onChange: (i: number, s: ProjectSection) => void
  onKindChange: (i: number, kind: SectionKind) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-2 overflow-hidden rounded-[10px] border border-(--cobalt-border)">
      <div className="flex items-center gap-1.5 bg-(--ink-900) px-3 py-2.5">
        <span className="flex items-center text-(--fg-mute)">
          <GripVertical size={14} />
        </span>
        <span className="min-w-4.5 text-center font-mono text-[10px] tracking-widest text-(--fg3) uppercase">
          {index + 1}
        </span>
        <select
          value={s.kind}
          onChange={(e) => onKindChange(index, e.target.value as SectionKind)}
          className={selectCls + " flex-1 text-[12px]"}
        >
          {SECTION_KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => onMove(index, index - 1)}
          disabled={index === 0}
          className={iconBtnCls + (index === 0 ? " opacity-30" : "")}
        >
          <ChevronUp size={13} />
        </button>
        <button
          onClick={() => onMove(index, index + 1)}
          disabled={index === total - 1}
          className={iconBtnCls + (index === total - 1 ? " opacity-30" : "")}
        >
          <ChevronDown size={13} />
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          className={iconBtnCls + (open ? " text-(--cobalt-300)" : " text-(--fg3)")}
        >
          {open ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button
          onClick={() => onRemove(index)}
          className={iconBtnCls + " text-(--danger,#FF5470)"}
        >
          <Trash2 size={13} />
        </button>
      </div>
      {open && (
        <div className="border-t border-t-(--cobalt-border-lo) px-3.5 pt-3.5 pb-2">
          <SectionEditor s={s} onChange={(ns) => onChange(index, ns)} />
        </div>
      )}
    </div>
  )
}
