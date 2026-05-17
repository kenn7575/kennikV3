"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react"
import type { Prisma } from "../../../../../../generated/prisma/client"
import type {
  Project,
  ProjectSection,
  CoverImage,
  ProseSection,
  SplitSection,
  CalloutSection,
  CodeSection,
  GallerySection,
  WideImageSection,
  AsideImageSection,
  QuoteSection,
  StatsSection,
} from "@/lib/data/projects"
import { updateProjectNoRedirect } from "../../actions"

/* ────────────────────────────────────────────────────────── */
/*  Types                                                      */
/* ────────────────────────────────────────────────────────── */

type PrismaProject = Prisma.ProjectGetPayload<object>

const SECTION_KINDS = [
  { value: "prose", label: "Prose" },
  { value: "split", label: "Split (text + meta)" },
  { value: "callout", label: "Callout" },
  { value: "code", label: "Code block" },
  { value: "gallery", label: "Gallery" },
  { value: "wide-image", label: "Wide image" },
  { value: "aside-image", label: "Aside image" },
  { value: "quote", label: "Quote" },
  { value: "stats", label: "Stats" },
] as const

type SectionKind = (typeof SECTION_KINDS)[number]["value"]

/* ────────────────────────────────────────────────────────── */
/*  Defaults for new sections                                  */
/* ────────────────────────────────────────────────────────── */

function defaultSection(kind: SectionKind): ProjectSection {
  switch (kind) {
    case "prose":
      return { kind, eyebrow: "", heading: "", italic: "", body: "" }
    case "split":
      return { kind, eyebrow: "", heading: "", italic: "", body: "", meta: [] }
    case "callout":
      return { kind, label: "NOTE", heading: "", body: "" }
    case "code":
      return {
        kind,
        eyebrow: "",
        heading: "",
        language: "typescript",
        code: "",
        caption: "",
      }
    case "gallery":
      return { kind, eyebrow: "", heading: "", images: [defaultCover()] }
    case "wide-image":
      return { kind, eyebrow: "", heading: "", image: defaultCover() }
    case "aside-image":
      return { kind, eyebrow: "", heading: "", body: "", image: defaultCover() }
    case "quote":
      return { kind, body: "", who: "" }
    case "stats":
      return {
        kind,
        eyebrow: "",
        heading: "",
        stats: [{ value: "", label: "" }],
      }
  }
}

function defaultCover(): CoverImage {
  return {
    cover: "linear-gradient(135deg,#023BE6,#5A82FB)",
    mono: "Aa",
    label: "",
  }
}

/* ────────────────────────────────────────────────────────── */
/*  Shared field primitives                                   */
/* ────────────────────────────────────────────────────────── */

const inputCls =
  "w-full px-[10px] py-2 bg-[var(--ink-900)] border border-[var(--cobalt-border)] rounded-[6px] text-[var(--fg1)] font-sans text-[13px] outline-none box-border"

const selectCls = inputCls

const textareaCls =
  "w-full px-[10px] py-2 bg-[var(--ink-900)] border border-[var(--cobalt-border)] rounded-[6px] text-[var(--fg1)] font-sans text-[13px] outline-none resize-y box-border"

const monoInputCls =
  "w-full px-[10px] py-2 bg-[var(--ink-900)] border border-[var(--cobalt-border)] rounded-[6px] text-[var(--fg1)] font-mono text-[12px] outline-none box-border"

const labelCls =
  "block font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--fg3)] mb-[5px]"

const rowCls = "flex flex-col gap-[5px] mb-[14px]"

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className={rowCls}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? ""}
    />
  )
}

function TextArea({
  value,
  onChange,
  rows = 3,
  mono = false,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
  mono?: boolean
  placeholder?: string
}) {
  return (
    <textarea
      className={mono ? monoInputCls + " resize-y" : textareaCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder ?? ""}
    />
  )
}

/* ────────────────────────────────────────────────────────── */
/*  CoverImage editor                                         */
/* ────────────────────────────────────────────────────────── */

function CoverEditor({
  value,
  onChange,
  label = "Image",
}: {
  value: CoverImage
  onChange: (v: CoverImage) => void
  label?: string
}) {
  const set = (k: keyof CoverImage, v: string) =>
    onChange({ ...value, [k]: v || undefined })
  return (
    <div className="border border-[var(--cobalt-border-lo)] rounded-lg px-[14px] py-3 mb-[10px]">
      <div className={labelCls + " mb-[10px]"}>{label}</div>
      <Field label="cover (CSS gradient or URL)">
        <TextInput
          value={value.cover}
          onChange={(v) => set("cover", v)}
          placeholder="linear-gradient(135deg,#023BE6,#5A82FB)"
        />
        <div
          className="mt-[6px] h-9 rounded-[6px]"
          style={{ background: value.cover }}
        />
      </Field>
      <Field label="Mono text">
        <TextInput value={value.mono} onChange={(v) => set("mono", v)} />
      </Field>
      <Field label="Label (optional)">
        <TextInput
          value={value.label ?? ""}
          onChange={(v) => set("label", v)}
        />
      </Field>
      <Field label="Aspect ratio (optional)">
        <TextInput
          value={value.aspect ?? ""}
          onChange={(v) => set("aspect", v)}
          placeholder="16/9"
        />
      </Field>
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  Section editors                                           */
/* ────────────────────────────────────────────────────────── */

function BaseHeadingFields({
  s,
  onChange,
}: {
  s: { eyebrow?: string; heading?: string; italic?: string }
  onChange: (patch: object) => void
}) {
  return (
    <>
      <Field label="Eyebrow">
        <TextInput
          value={s.eyebrow ?? ""}
          onChange={(v) => onChange({ eyebrow: v })}
        />
      </Field>
      <Field label="Heading">
        <TextInput
          value={s.heading ?? ""}
          onChange={(v) => onChange({ heading: v })}
        />
      </Field>
      <Field label="Italic suffix">
        <TextInput
          value={s.italic ?? ""}
          onChange={(v) => onChange({ italic: v })}
        />
      </Field>
    </>
  )
}

function ProseEditor({
  s,
  onChange,
}: {
  s: ProseSection
  onChange: (s: ProseSection) => void
}) {
  const body = Array.isArray(s.body) ? s.body.join("\n\n") : s.body
  return (
    <>
      <BaseHeadingFields s={s} onChange={(p) => onChange({ ...s, ...p })} />
      <Field label="Body (blank line = new paragraph)">
        <TextArea
          value={body}
          onChange={(v) =>
            onChange({ ...s, body: v.includes("\n\n") ? v.split("\n\n") : v })
          }
          rows={6}
        />
      </Field>
    </>
  )
}

function SplitEditor({
  s,
  onChange,
}: {
  s: SplitSection
  onChange: (s: SplitSection) => void
}) {
  const body = Array.isArray(s.body) ? s.body.join("\n\n") : s.body
  const meta = s.meta ?? []
  return (
    <>
      <BaseHeadingFields s={s} onChange={(p) => onChange({ ...s, ...p })} />
      <Field label="Body">
        <TextArea
          value={body}
          onChange={(v) =>
            onChange({ ...s, body: v.includes("\n\n") ? v.split("\n\n") : v })
          }
          rows={5}
        />
      </Field>
      <div className={labelCls + " mb-2"}>Meta rows</div>
      {meta.map((m, i) => (
        <div key={i} className="flex gap-2 mb-[6px] items-center">
          <input
            className={inputCls + " flex-1"}
            value={m.l}
            onChange={(e) => {
              const nm = [...meta]
              nm[i] = { ...m, l: e.target.value }
              onChange({ ...s, meta: nm })
            }}
            placeholder="Label"
          />
          <input
            className={inputCls + " flex-[2]"}
            value={m.v}
            onChange={(e) => {
              const nm = [...meta]
              nm[i] = { ...m, v: e.target.value }
              onChange({ ...s, meta: nm })
            }}
            placeholder="Value"
          />
          <button
            onClick={() => {
              const nm = meta.filter((_, j) => j !== i)
              onChange({ ...s, meta: nm })
            }}
            className={iconBtnCls}
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange({ ...s, meta: [...meta, { l: "", v: "" }] })}
        className={addRowBtnCls}
      >
        + Add row
      </button>
    </>
  )
}

function CalloutEditor({
  s,
  onChange,
}: {
  s: CalloutSection
  onChange: (s: CalloutSection) => void
}) {
  return (
    <>
      <Field label="Label">
        <TextInput
          value={s.label ?? "NOTE"}
          onChange={(v) => onChange({ ...s, label: v })}
        />
      </Field>
      <Field label="Heading">
        <TextInput
          value={s.heading ?? ""}
          onChange={(v) => onChange({ ...s, heading: v })}
        />
      </Field>
      <Field label="Italic suffix">
        <TextInput
          value={s.italic ?? ""}
          onChange={(v) => onChange({ ...s, italic: v })}
        />
      </Field>
      <Field label="Body">
        <TextArea
          value={s.body}
          onChange={(v) => onChange({ ...s, body: v })}
          rows={4}
        />
      </Field>
    </>
  )
}

function CodeEditor({
  s,
  onChange,
}: {
  s: CodeSection
  onChange: (s: CodeSection) => void
}) {
  return (
    <>
      <BaseHeadingFields s={s} onChange={(p) => onChange({ ...s, ...p })} />
      <Field label="Body text (optional)">
        <TextArea
          value={s.body ?? ""}
          onChange={(v) => onChange({ ...s, body: v || undefined })}
          rows={3}
        />
      </Field>
      <Field label="Language">
        <TextInput
          value={s.language}
          onChange={(v) => onChange({ ...s, language: v })}
          placeholder="typescript"
        />
      </Field>
      <Field label="Code">
        <TextArea
          value={s.code}
          onChange={(v) => onChange({ ...s, code: v })}
          rows={8}
          mono
        />
      </Field>
      <Field label="Caption (optional)">
        <TextInput
          value={s.caption ?? ""}
          onChange={(v) => onChange({ ...s, caption: v || undefined })}
        />
      </Field>
    </>
  )
}

function GalleryEditor({
  s,
  onChange,
}: {
  s: GallerySection
  onChange: (s: GallerySection) => void
}) {
  return (
    <>
      <BaseHeadingFields s={s} onChange={(p) => onChange({ ...s, ...p })} />
      <Field label="Body (optional)">
        <TextArea
          value={s.body ?? ""}
          onChange={(v) => onChange({ ...s, body: v || undefined })}
          rows={3}
        />
      </Field>
      {s.images.map((img, i) => (
        <div key={i} className="relative">
          <CoverEditor
            value={img}
            label={`Image ${i + 1}`}
            onChange={(v) => {
              const ni = [...s.images]
              ni[i] = v
              onChange({ ...s, images: ni })
            }}
          />
          {s.images.length > 1 && (
            <button
              onClick={() =>
                onChange({ ...s, images: s.images.filter((_, j) => j !== i) })
              }
              className={iconBtnCls + " absolute top-3 right-3"}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() =>
          onChange({ ...s, images: [...s.images, defaultCover()] })
        }
        className={addRowBtnCls}
      >
        + Add image
      </button>
    </>
  )
}

function WideImageEditor({
  s,
  onChange,
}: {
  s: WideImageSection
  onChange: (s: WideImageSection) => void
}) {
  return (
    <>
      <BaseHeadingFields s={s} onChange={(p) => onChange({ ...s, ...p })} />
      <Field label="Body (optional)">
        <TextArea
          value={s.body ?? ""}
          onChange={(v) => onChange({ ...s, body: v || undefined })}
          rows={3}
        />
      </Field>
      <CoverEditor
        value={s.image}
        onChange={(v) => onChange({ ...s, image: v })}
      />
    </>
  )
}

function AsideImageEditor({
  s,
  onChange,
}: {
  s: AsideImageSection
  onChange: (s: AsideImageSection) => void
}) {
  const body = Array.isArray(s.body) ? s.body.join("\n\n") : s.body
  return (
    <>
      <BaseHeadingFields s={s} onChange={(p) => onChange({ ...s, ...p })} />
      <Field label="Body">
        <TextArea
          value={body}
          onChange={(v) =>
            onChange({ ...s, body: v.includes("\n\n") ? v.split("\n\n") : v })
          }
          rows={5}
        />
      </Field>
      <Field label="Image side">
        <select
          className={selectCls}
          value={s.imageSide ?? "right"}
          onChange={(e) =>
            onChange({ ...s, imageSide: e.target.value as "left" | "right" })
          }
        >
          <option value="right">Right</option>
          <option value="left">Left</option>
        </select>
      </Field>
      <CoverEditor
        value={s.image}
        onChange={(v) => onChange({ ...s, image: v })}
      />
    </>
  )
}

function QuoteEditor({
  s,
  onChange,
}: {
  s: QuoteSection
  onChange: (s: QuoteSection) => void
}) {
  return (
    <>
      <Field label="Quote text">
        <TextArea
          value={s.body}
          onChange={(v) => onChange({ ...s, body: v })}
          rows={4}
        />
      </Field>
      <Field label="Attribution">
        <TextInput value={s.who} onChange={(v) => onChange({ ...s, who: v })} />
      </Field>
    </>
  )
}

function StatsEditor({
  s,
  onChange,
}: {
  s: StatsSection
  onChange: (s: StatsSection) => void
}) {
  return (
    <>
      <BaseHeadingFields s={s} onChange={(p) => onChange({ ...s, ...p })} />
      <Field label="Body (optional)">
        <TextArea
          value={s.body ?? ""}
          onChange={(v) => onChange({ ...s, body: v || undefined })}
          rows={3}
        />
      </Field>
      <div className={labelCls + " mb-2"}>Stats</div>
      {s.stats.map((st, i) => (
        <div key={i} className="flex gap-2 mb-[6px] items-center">
          <input
            className={inputCls + " flex-1"}
            value={st.value}
            onChange={(e) => {
              const ns = [...s.stats]
              ns[i] = { ...st, value: e.target.value }
              onChange({ ...s, stats: ns })
            }}
            placeholder="Value"
          />
          <input
            className={inputCls + " flex-[2]"}
            value={st.label}
            onChange={(e) => {
              const ns = [...s.stats]
              ns[i] = { ...st, label: e.target.value }
              onChange({ ...s, stats: ns })
            }}
            placeholder="Label"
          />
          <label className="flex items-center gap-1 text-[12px] text-[var(--fg3)] whitespace-nowrap">
            <input
              type="checkbox"
              checked={st.emph ?? false}
              onChange={(e) => {
                const ns = [...s.stats]
                ns[i] = { ...st, emph: e.target.checked }
                onChange({ ...s, stats: ns })
              }}
            />{" "}
            emph
          </label>
          {s.stats.length > 1 && (
            <button
              onClick={() =>
                onChange({ ...s, stats: s.stats.filter((_, j) => j !== i) })
              }
              className={iconBtnCls}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() =>
          onChange({ ...s, stats: [...s.stats, { value: "", label: "" }] })
        }
        className={addRowBtnCls}
      >
        + Add stat
      </button>
    </>
  )
}

function SectionEditor({
  s,
  onChange,
}: {
  s: ProjectSection
  onChange: (s: ProjectSection) => void
}) {
  switch (s.kind) {
    case "prose":
      return (
        <ProseEditor s={s} onChange={onChange as (s: ProseSection) => void} />
      )
    case "split":
      return (
        <SplitEditor s={s} onChange={onChange as (s: SplitSection) => void} />
      )
    case "callout":
      return (
        <CalloutEditor
          s={s}
          onChange={onChange as (s: CalloutSection) => void}
        />
      )
    case "code":
      return (
        <CodeEditor s={s} onChange={onChange as (s: CodeSection) => void} />
      )
    case "gallery":
      return (
        <GalleryEditor
          s={s}
          onChange={onChange as (s: GallerySection) => void}
        />
      )
    case "wide-image":
      return (
        <WideImageEditor
          s={s}
          onChange={onChange as (s: WideImageSection) => void}
        />
      )
    case "aside-image":
      return (
        <AsideImageEditor
          s={s}
          onChange={onChange as (s: AsideImageSection) => void}
        />
      )
    case "quote":
      return (
        <QuoteEditor s={s} onChange={onChange as (s: QuoteSection) => void} />
      )
    case "stats":
      return (
        <StatsEditor s={s} onChange={onChange as (s: StatsSection) => void} />
      )
  }
}

/* ────────────────────────────────────────────────────────── */
/*  Hero editor                                               */
/* ────────────────────────────────────────────────────────── */

type HeroData = NonNullable<Project["hero"]>

function HeroEditor({
  value,
  onChange,
}: {
  value: HeroData
  onChange: (v: HeroData) => void
}) {
  const metrics = value.metrics ?? []
  return (
    <div>
      <Field label="Eyebrow">
        <TextInput
          value={value.eyebrow}
          onChange={(v) => onChange({ ...value, eyebrow: v })}
        />
      </Field>
      <Field label="Headline (use *italic* and **bold**)">
        <TextInput
          value={value.headline}
          onChange={(v) => onChange({ ...value, headline: v })}
        />
      </Field>
      <Field label="Summary">
        <TextArea
          value={value.summary}
          onChange={(v) => onChange({ ...value, summary: v })}
          rows={3}
        />
      </Field>
      <Field label="Cover (CSS gradient)">
        <TextInput
          value={value.cover}
          onChange={(v) => onChange({ ...value, cover: v })}
        />
        <div
          className="mt-[6px] h-10 rounded-[6px]"
          style={{ background: value.cover }}
        />
      </Field>
      <div className={labelCls + " mb-2 mt-1"}>Metrics</div>
      {metrics.map((m, i) => (
        <div key={i} className="flex gap-2 mb-[6px] items-center">
          <input
            className={inputCls + " flex-1"}
            value={m.v}
            onChange={(e) => {
              const nm = [...metrics]
              nm[i] = { ...m, v: e.target.value }
              onChange({ ...value, metrics: nm })
            }}
            placeholder="Value"
          />
          <input
            className={inputCls + " flex-[2]"}
            value={m.l}
            onChange={(e) => {
              const nm = [...metrics]
              nm[i] = { ...m, l: e.target.value }
              onChange({ ...value, metrics: nm })
            }}
            placeholder="Label"
          />
          <label className="flex items-center gap-1 text-[12px] text-[var(--fg3)] whitespace-nowrap">
            <input
              type="checkbox"
              checked={m.emph ?? false}
              onChange={(e) => {
                const nm = [...metrics]
                nm[i] = { ...m, emph: e.target.checked }
                onChange({ ...value, metrics: nm })
              }}
            />{" "}
            emph
          </label>
          {metrics.length > 1 && (
            <button
              onClick={() =>
                onChange({
                  ...value,
                  metrics: metrics.filter((_, j) => j !== i),
                })
              }
              className={iconBtnCls}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() =>
          onChange({ ...value, metrics: [...metrics, { v: "", l: "" }] })
        }
        className={addRowBtnCls}
      >
        + Add metric
      </button>
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  Related picker                                            */
/* ────────────────────────────────────────────────────────── */

type ProjectStub = {
  slug: string
  name: string
  italic: string
  monogram: string
  cover: string
}

function RelatedPicker({
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
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-[6px] mb-[10px]">
          {selected.map((p) => (
            <div
              key={p.slug}
              className="inline-flex items-center gap-[6px] px-2 py-1 border border-[var(--cobalt-border-hi)] rounded-[6px] bg-[rgba(2,59,230,0.12)]"
            >
              <div
                className="w-5 h-5 rounded-[4px] shrink-0 flex items-center justify-center font-display italic text-[10px] text-white"
                style={{ background: p.cover }}
              >
                {p.monogram}
              </div>
              <span className="font-sans text-[12px] text-[var(--fg1)]">
                {p.name}
              </span>
              <button
                onClick={() => remove(p.slug)}
                className="bg-transparent border-none cursor-pointer text-[var(--fg3)] p-0 leading-none text-[14px]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <input
        className={inputCls + " mb-[6px]"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects to add…"
      />

      {/* Results list */}
      {query.trim() && (
        <div className="border border-[var(--cobalt-border)] rounded-[6px] overflow-hidden max-h-[200px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-[10px] font-sans text-[12px] text-[var(--fg3)]">
              No matches
            </div>
          ) : (
            filtered.map((p) => (
              <button
                key={p.slug}
                onClick={() => add(p.slug)}
                className="flex items-center gap-[10px] w-full px-3 py-2 bg-[var(--ink-900)] border-none border-b border-b-[var(--cobalt-border-lo)] cursor-pointer text-[var(--fg1)] text-left"
              >
                <div
                  className="w-7 h-7 rounded-[6px] shrink-0 flex items-center justify-center font-display italic text-[11px] text-white"
                  style={{ background: p.cover }}
                >
                  {p.monogram}
                </div>
                <div>
                  <div className="font-sans text-[13px] text-[var(--fg1)]">
                    {p.name}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--fg3)] tracking-[.08em]">
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

/* ────────────────────────────────────────────────────────── */
/*  Shared button class strings                               */
/* ────────────────────────────────────────────────────────── */

const iconBtnCls =
  "inline-flex items-center justify-center w-7 h-7 border border-[var(--cobalt-border)] rounded-[6px] bg-transparent text-[var(--fg3)] cursor-pointer text-[16px] shrink-0"

const addRowBtnCls =
  "inline-flex items-center gap-[6px] px-3 py-[6px] border border-dashed border-[var(--cobalt-border)] rounded-[6px] bg-transparent text-[var(--cobalt-300)] cursor-pointer font-mono text-[11px] tracking-[0.08em] mb-2"

/* ────────────────────────────────────────────────────────── */
/*  Accordion panel                                          */
/* ────────────────────────────────────────────────────────── */

function Panel({
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
    <div className="border border-[var(--cobalt-border)] rounded-[10px] mb-[10px] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-[14px] py-3 bg-[var(--ink-900)] border-none cursor-pointer text-[var(--fg1)] font-sans text-[13px] font-medium"
      >
        <span className="flex items-center gap-2">
          {title}
          {badge && (
            <span className="font-mono text-[10px] tracking-[.1em] text-[var(--cobalt-300)] uppercase">
              {badge}
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-[var(--fg3)]" />
        ) : (
          <ChevronDown size={14} className="text-[var(--fg3)]" />
        )}
      </button>
      {open && (
        <div className="px-[14px] pt-[14px] pb-2 border-t border-t-[var(--cobalt-border-lo)]">
          {children}
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  Section card in the sections list                         */
/* ────────────────────────────────────────────────────────── */

function SectionCard({
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
    <div className="border border-[var(--cobalt-border)] rounded-[10px] mb-2 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-[6px] px-3 py-[10px] bg-[var(--ink-900)]">
        <span className="text-[var(--fg-mute)] flex items-center">
          <GripVertical size={14} />
        </span>
        <span className="font-mono text-[10px] tracking-[.1em] uppercase text-[var(--fg3)] min-w-[18px] text-center">
          {index + 1}
        </span>
        {/* Kind selector */}
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
        {/* Move up/down */}
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
        {/* Edit toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={
            iconBtnCls +
            (open ? " text-[var(--cobalt-300)]" : " text-[var(--fg3)]")
          }
        >
          {open ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        {/* Delete */}
        <button
          onClick={() => onRemove(index)}
          className={iconBtnCls + " text-[var(--danger,#FF5470)]"}
        >
          <Trash2 size={13} />
        </button>
      </div>
      {/* Fields */}
      {open && (
        <div className="px-[14px] pt-[14px] pb-2 border-t border-t-[var(--cobalt-border-lo)]">
          <SectionEditor s={s} onChange={(ns) => onChange(index, ns)} />
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  Main designer component                                   */
/* ────────────────────────────────────────────────────────── */

type ViewportSize = "desktop" | "tablet" | "mobile"

const VIEWPORT: Record<
  ViewportSize,
  { width: string; label: string; icon: React.ReactNode }
> = {
  desktop: { width: "100%", label: "Desktop", icon: <Monitor size={14} /> },
  tablet: { width: "768px", label: "Tablet", icon: <Tablet size={14} /> },
  mobile: { width: "390px", label: "Mobile", icon: <Smartphone size={14} /> },
}

export function ProjectDesigner({
  initialData,
  allProjects,
}: {
  initialData: PrismaProject
  allProjects: ProjectStub[]
}) {
  /* ── Form state ── */
  const [slug] = useState(initialData.slug)
  const [order, setOrder] = useState(String(initialData.order))
  const [name, setName] = useState(initialData.name)
  const [italic, setItalic] = useState(initialData.italic)
  const [desc, setDesc] = useState(initialData.desc)
  const [cover, setCover] = useState(initialData.cover)
  const [monogram, setMonogram] = useState(initialData.monogram)
  const [year, setYear] = useState(initialData.year)
  const [duration, setDuration] = useState(initialData.duration)
  const [status, setStatus] = useState<"LIVE" | "RESCUED" | "STEALTH">(
    initialData.status as "LIVE" | "RESCUED" | "STEALTH"
  )
  const [stack, setStack] = useState(initialData.stack.join(", "))
  const [role, setRole] = useState(initialData.role ?? "")
  const [client, setClient] = useState(initialData.client ?? "")
  const [url, setUrl] = useState(initialData.url ?? "")
  const [hero, setHero] = useState<NonNullable<Project["hero"]>>(
    initialData.hero
      ? (initialData.hero as unknown as NonNullable<Project["hero"]>)
      : {
          eyebrow: "",
          headline: "",
          summary: "",
          metrics: [{ v: "", l: "" }],
          cover: "",
        }
  )
  const [sections, setSections] = useState<ProjectSection[]>(
    initialData.sections
      ? (initialData.sections as unknown as ProjectSection[])
      : []
  )
  const [relatedSlugs, setRelatedSlugs] = useState<string[]>(
    initialData.relatedSlugs
  )

  /* ── Preview state ── */
  const [viewport, setViewport] = useState<ViewportSize>("desktop")
  const [saveError, setSaveError] = useState("")
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Build project object from state ── */
  const buildProject = useCallback(
    (): Project => ({
      slug,
      name,
      italic,
      desc,
      cover,
      monogram,
      year,
      duration,
      status,
      stack: stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      role: role || undefined,
      client: client || undefined,
      url: url || undefined,
      hero,
      sections: sections.length ? sections : undefined,
      related: undefined,
    }),
    [
      slug,
      name,
      italic,
      desc,
      cover,
      monogram,
      year,
      duration,
      status,
      stack,
      role,
      client,
      url,
      hero,
      sections,
    ]
  )

  /* ── Refresh preview (debounced) ── */
  const refreshPreview = useCallback(() => {
    if (previewTimer.current) clearTimeout(previewTimer.current)
    previewTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/preview-project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildProject()),
        })
        if (!res.ok) return
        const html = await res.text()
        const iframe = iframeRef.current
        if (!iframe) return
        const doc = iframe.contentDocument ?? iframe.contentWindow?.document
        if (!doc) return
        doc.open()
        doc.write(html)
        doc.close()
      } catch {
        /* ignore preview errors */
      }
    }, 600)
  }, [buildProject])

  /* Re-render preview whenever any state changes */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refreshPreview()
  }, [
    name,
    italic,
    desc,
    cover,
    monogram,
    year,
    duration,
    status,
    stack,
    role,
    client,
    url,
    hero,
    sections,
  ])

  /* Initial preview load */
  useEffect(() => {
    refreshPreview()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Save ── */
  async function handleSave() {
    setSaveError("")
    setSaved(false)

    const fd = new FormData()
    fd.set("order", order)
    fd.set("name", name)
    fd.set("italic", italic)
    fd.set("desc", desc)
    fd.set("cover", cover)
    fd.set("monogram", monogram)
    fd.set("year", year)
    fd.set("duration", duration)
    fd.set("status", status)
    fd.set("stack", stack)
    fd.set("role", role)
    fd.set("client", client)
    fd.set("url", url)
    fd.set("hero", JSON.stringify(hero))
    fd.set("sections", sections.length ? JSON.stringify(sections) : "")
    fd.set("relatedSlugs", relatedSlugs.join(", "))

    startTransition(async () => {
      const result = await updateProjectNoRedirect(slug, null, fd)
      if (result?.error) {
        setSaveError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  /* ── Sections helpers ── */
  function moveSection(from: number, to: number) {
    if (to < 0 || to >= sections.length) return
    const ns = [...sections]
    const [item] = ns.splice(from, 1)
    ns.splice(to, 0, item)
    setSections(ns)
  }
  function removeSection(i: number) {
    setSections((s) => s.filter((_, j) => j !== i))
  }
  function updateSection(i: number, s: ProjectSection) {
    setSections((ss) => {
      const ns = [...ss]
      ns[i] = s
      return ns
    })
  }
  function changeKind(i: number, kind: SectionKind) {
    setSections((ss) => {
      const ns = [...ss]
      ns[i] = defaultSection(kind)
      return ns
    })
  }
  function addSection(kind: SectionKind) {
    setSections((ss) => [...ss, defaultSection(kind)])
  }

  const [addKind, setAddKind] = useState<SectionKind>("prose")

  /* ────────────────────────────────────────────── */
  /*  Render                                        */
  /* ────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-screen bg-[var(--ink-950)] text-[var(--fg1)] font-sans">
      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 h-[52px] border-b border-[var(--cobalt-border)] bg-[var(--ink-900)] shrink-0">
        <a
          href="/admin/dashboard/projects"
          className="inline-flex items-center gap-[6px] text-[var(--fg3)] no-underline text-[13px]"
        >
          <ArrowLeft size={14} /> Projects
        </a>
        <span className="text-[var(--cobalt-border-hi)] text-[18px]">·</span>
        <span className="font-mono text-[12px] tracking-[.08em] text-[var(--fg2)]">
          {slug}
        </span>
        <span className="flex-1" />
        {/* Viewport switcher */}
        <div className="flex gap-1">
          {(Object.keys(VIEWPORT) as ViewportSize[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              title={VIEWPORT[v].label}
              className={
                "inline-flex items-center justify-center w-8 h-8 border border-[var(--cobalt-border)] rounded-[6px] cursor-pointer " +
                (viewport === v
                  ? "bg-[var(--cobalt-500)] text-white"
                  : "bg-transparent text-[var(--fg3)]")
              }
            >
              {VIEWPORT[v].icon}
            </button>
          ))}
        </div>
        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isPending}
          className={
            "inline-flex items-center gap-[6px] px-[14px] py-[7px] text-white border-none rounded-[6px] font-sans text-[13px] font-medium transition-[background] duration-200 " +
            (saved
              ? "bg-[var(--success,#2BD178)]"
              : "bg-[var(--cobalt-500)]") +
            (isPending ? " opacity-70 cursor-default" : " cursor-pointer")
          }
        >
          <Save size={14} />
          {isPending ? "Saving…" : saved ? "Saved!" : "Save"}
        </button>
      </div>

      {/* ── Error banner ── */}
      {saveError && (
        <div className="px-4 py-[10px] bg-[rgba(239,68,68,.12)] border-b border-[rgba(239,68,68,.3)] text-[#f87171] font-sans text-[13px]">
          {saveError}
        </div>
      )}

      {/* ── Main split ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: editor panel ── */}
        <div className="w-[380px] shrink-0 overflow-y-auto border-r border-[var(--cobalt-border)] px-[14px] py-4">
          {/* Core fields */}
          <Panel title="Core fields" defaultOpen>
            <Field label="Order">
              <input
                className={inputCls}
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </Field>
            <Field label="Name">
              <TextInput value={name} onChange={setName} />
            </Field>
            <Field label="Italic subtitle">
              <TextInput value={italic} onChange={setItalic} />
            </Field>
            <Field label="Description">
              <TextArea value={desc} onChange={setDesc} rows={3} />
            </Field>
            <Field label="Cover card (CSS gradient or URL)">
              <TextInput value={cover} onChange={setCover} />
              <div
                className="mt-[6px] h-10 rounded-lg"
                style={{ background: cover }}
              />
            </Field>
            <Field label="Monogram">
              <TextInput value={monogram} onChange={setMonogram} />
            </Field>
            <div className="flex gap-[10px]">
              <div className={rowCls + " flex-1"}>
                <label className={labelCls}>Year</label>
                <input
                  className={inputCls}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div className={rowCls + " flex-1"}>
                <label className={labelCls}>Duration</label>
                <input
                  className={inputCls}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
            <Field label="Status">
              <select
                className={selectCls}
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
              >
                <option value="LIVE">LIVE</option>
                <option value="RESCUED">RESCUED</option>
                <option value="STEALTH">STEALTH</option>
              </select>
            </Field>
            <Field label="Stack (comma-separated)">
              <TextInput
                value={stack}
                onChange={setStack}
                placeholder="Next.js, TypeScript, Prisma"
              />
            </Field>
          </Panel>

          {/* Detail fields */}
          <Panel title="Detail fields">
            <Field label="Role (optional)">
              <TextInput value={role} onChange={setRole} />
            </Field>
            <Field label="Client (optional)">
              <TextInput value={client} onChange={setClient} />
            </Field>
            <Field label="URL (optional)">
              <TextInput value={url} onChange={setUrl} />
            </Field>
          </Panel>

          {/* Hero */}
          <Panel title="Hero" badge="detail page">
            <HeroEditor value={hero} onChange={setHero} />
          </Panel>

          {/* Sections */}
          <Panel
            title={`Sections (${sections.length})`}
            badge="detail page"
            defaultOpen
          >
            {sections.map((s, i) => (
              <SectionCard
                key={i}
                s={s}
                index={i}
                total={sections.length}
                onMove={moveSection}
                onRemove={removeSection}
                onChange={updateSection}
                onKindChange={changeKind}
              />
            ))}
            {/* Add section */}
            <div className="flex gap-2 mt-1 items-center">
              <select
                className={selectCls + " flex-1"}
                value={addKind}
                onChange={(e) => setAddKind(e.target.value as SectionKind)}
              >
                {SECTION_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => addSection(addKind)}
                className="inline-flex items-center gap-[5px] px-3 py-2 bg-[var(--cobalt-500)] text-white border-none rounded-[6px] cursor-pointer font-sans text-[13px] whitespace-nowrap"
              >
                <Plus size={13} /> Add
              </button>
            </div>
          </Panel>

          {/* Related */}
          <Panel title={`Related (${relatedSlugs.length})`} badge="detail page">
            <RelatedPicker
              allProjects={allProjects}
              selfSlug={slug}
              value={relatedSlugs}
              onChange={setRelatedSlugs}
            />
          </Panel>
        </div>

        {/* ── RIGHT: preview ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0b10]">
          {/* Preview toolbar */}
          <div className="flex items-center gap-[10px] px-[14px] py-[6px] border-b border-[var(--cobalt-border)] bg-[var(--ink-900)] shrink-0">
            <span className="font-mono text-[11px] tracking-[.12em] uppercase text-[var(--fg3)]">
              Live preview
            </span>
            <span className="font-mono text-[11px] text-[var(--cobalt-300)]">
              — auto-updates
            </span>
            <span className="flex-1" />
            <a
              href={`/work/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[.1em] uppercase text-[var(--cobalt-300)] no-underline"
            >
              Open live ↗
            </a>
          </div>
          {/* Iframe wrapper */}
          <div
            className={
              "flex-1 overflow-auto flex justify-center " +
              (viewport === "desktop" ? "p-0" : "py-4")
            }
          >
            <div
              className={
                "h-full transition-[width] duration-300 ease-[var(--ease-out,ease)] relative " +
                (viewport !== "desktop"
                  ? "shadow-[0_0_0_1px_var(--cobalt-border),0_32px_64px_rgba(0,0,0,.6)] rounded-lg overflow-hidden"
                  : "")
              }
              style={{ width: VIEWPORT[viewport].width }}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-none block"
                title="Project preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
