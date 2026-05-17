"use client"

import { useState } from "react"
import { inputCls } from "./primitives"

export type ProjectStub = {
  slug: string
  name: string
  italic: string
  monogram: string
  cover: string
}

export function RelatedPicker({
  allProjects,
  selfSlug,
  value,
  onChange,
}: {
  allProjects: ProjectStub[]
  selfSlug: string
  value: string[]
  onChange: (v: string[]) => void
}) {
  const [query, setQuery] = useState("")

  const candidates = allProjects.filter(
    (p) => p.slug !== selfSlug && !value.includes(p.slug)
  )
  const filtered = query.trim()
    ? candidates.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.slug.toLowerCase().includes(query.toLowerCase())
      )
    : candidates

  const selected = value
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter(Boolean) as ProjectStub[]

  function add(slug: string) {
    onChange([...value, slug])
    setQuery("")
  }
  function remove(slug: string) {
    onChange(value.filter((s) => s !== slug))
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {selected.map((p) => (
            <div
              key={p.slug}
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-(--cobalt-border-hi) bg-[rgba(2,59,230,0.12)] px-2 py-1"
            >
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm font-display text-[10px] text-white italic"
                style={{ background: p.cover }}
              >
                {p.monogram}
              </div>
              <span className="font-sans text-[12px] text-(--fg1)">{p.name}</span>
              <button
                onClick={() => remove(p.slug)}
                className="cursor-pointer border-none bg-transparent p-0 text-[14px] leading-none text-(--fg3)"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        className={inputCls + " mb-1.5"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects to add…"
      />

      {query.trim() && (
        <div className="max-h-50 overflow-hidden overflow-y-auto rounded-[6px] border border-(--cobalt-border)">
          {filtered.length === 0 ? (
            <div className="px-3 py-2.5 font-sans text-[12px] text-(--fg3)">
              No matches
            </div>
          ) : (
            filtered.map((p) => (
              <button
                key={p.slug}
                onClick={() => add(p.slug)}
                className="flex w-full cursor-pointer items-center gap-2.5 border-b border-none border-b-(--cobalt-border-lo) bg-(--ink-900) px-3 py-2 text-left text-(--fg1)"
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] font-display text-[11px] text-white italic"
                  style={{ background: p.cover }}
                >
                  {p.monogram}
                </div>
                <div>
                  <div className="font-sans text-[13px] text-(--fg1)">{p.name}</div>
                  <div className="font-mono text-[10px] tracking-[.08em] text-(--fg3)">
                    {p.slug}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
