"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import {
  ChevronDown, ChevronUp, GripVertical, Plus, Trash2,
  Monitor, Tablet, Smartphone, Save, ArrowLeft, Eye, EyeOff,
} from "lucide-react"
import type { Prisma } from "@prisma/client"
import type {
  Project, ProjectSection, CoverImage,
  ProseSection, SplitSection, CalloutSection, CodeSection,
  GallerySection, WideImageSection, AsideImageSection, QuoteSection, StatsSection,
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

type SectionKind = typeof SECTION_KINDS[number]["value"]

/* ────────────────────────────────────────────────────────── */
/*  Defaults for new sections                                  */
/* ────────────────────────────────────────────────────────── */

function defaultSection(kind: SectionKind): ProjectSection {
  switch (kind) {
    case "prose":       return { kind, eyebrow: "", heading: "", italic: "", body: "" }
    case "split":       return { kind, eyebrow: "", heading: "", italic: "", body: "", meta: [] }
    case "callout":     return { kind, label: "NOTE", heading: "", body: "" }
    case "code":        return { kind, eyebrow: "", heading: "", language: "typescript", code: "", caption: "" }
    case "gallery":     return { kind, eyebrow: "", heading: "", images: [defaultCover()] }
    case "wide-image":  return { kind, eyebrow: "", heading: "", image: defaultCover() }
    case "aside-image": return { kind, eyebrow: "", heading: "", body: "", image: defaultCover() }
    case "quote":       return { kind, body: "", who: "" }
    case "stats":       return { kind, eyebrow: "", heading: "", stats: [{ value: "", label: "" }] }
  }
}

function defaultCover(): CoverImage {
  return { cover: "linear-gradient(135deg,#023BE6,#5A82FB)", mono: "Aa", label: "" }
}

/* ────────────────────────────────────────────────────────── */
/*  Shared field primitives                                   */
/* ────────────────────────────────────────────────────────── */

const S = {
  label: {
    display: "block" as const,
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "var(--fg3)",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    background: "var(--ink-900, #08090F)",
    border: "1px solid var(--cobalt-border)",
    borderRadius: 6,
    color: "var(--fg1)",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%",
    padding: "8px 10px",
    background: "var(--ink-900, #08090F)",
    border: "1px solid var(--cobalt-border)",
    borderRadius: 6,
    color: "var(--fg1)",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    outline: "none",
    resize: "vertical" as const,
    boxSizing: "border-box" as const,
  },
  row: { display: "flex", flexDirection: "column" as const, gap: 5, marginBottom: 14 },
  select: {
    width: "100%",
    padding: "8px 10px",
    background: "var(--ink-900, #08090F)",
    border: "1px solid var(--cobalt-border)",
    borderRadius: 6,
    color: "var(--fg1)",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box" as const,
  },
  monoInput: {
    width: "100%",
    padding: "8px 10px",
    background: "var(--ink-900, #08090F)",
    border: "1px solid var(--cobalt-border)",
    borderRadius: 6,
    color: "var(--fg1)",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box" as const,
  },
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={S.row}><label style={S.label}>{label}</label>{children}</div>
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input style={S.input} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? ""} />
}

function TextArea({ value, onChange, rows = 3, mono = false, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; mono?: boolean; placeholder?: string }) {
  return <textarea style={mono ? { ...S.textarea, fontFamily: "var(--font-mono)", fontSize: 12 } : S.textarea} value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder ?? ""} />
}

/* ────────────────────────────────────────────────────────── */
/*  CoverImage editor                                         */
/* ────────────────────────────────────────────────────────── */

function CoverEditor({ value, onChange, label = "Image" }: { value: CoverImage; onChange: (v: CoverImage) => void; label?: string }) {
  const set = (k: keyof CoverImage, v: string) => onChange({ ...value, [k]: v || undefined })
  return (
    <div style={{ border: "1px solid var(--cobalt-border-lo)", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
      <div style={{ ...S.label, marginBottom: 10 }}>{label}</div>
      <Field label="cover (CSS gradient or URL)">
        <TextInput value={value.cover} onChange={v => set("cover", v)} placeholder="linear-gradient(135deg,#023BE6,#5A82FB)" />
        <div style={{ marginTop: 6, height: 36, borderRadius: 6, background: value.cover }} />
      </Field>
      <Field label="Mono text"><TextInput value={value.mono} onChange={v => set("mono", v)} /></Field>
      <Field label="Label (optional)"><TextInput value={value.label ?? ""} onChange={v => set("label", v)} /></Field>
      <Field label="Aspect ratio (optional)"><TextInput value={value.aspect ?? ""} onChange={v => set("aspect", v)} placeholder="16/9" /></Field>
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  Section editors                                           */
/* ────────────────────────────────────────────────────────── */

function BaseHeadingFields({ s, onChange }: { s: { eyebrow?: string; heading?: string; italic?: string }; onChange: (patch: object) => void }) {
  return (
    <>
      <Field label="Eyebrow"><TextInput value={s.eyebrow ?? ""} onChange={v => onChange({ eyebrow: v })} /></Field>
      <Field label="Heading"><TextInput value={s.heading ?? ""} onChange={v => onChange({ heading: v })} /></Field>
      <Field label="Italic suffix"><TextInput value={s.italic ?? ""} onChange={v => onChange({ italic: v })} /></Field>
    </>
  )
}

function ProseEditor({ s, onChange }: { s: ProseSection; onChange: (s: ProseSection) => void }) {
  const body = Array.isArray(s.body) ? s.body.join("\n\n") : s.body
  return (
    <>
      <BaseHeadingFields s={s} onChange={p => onChange({ ...s, ...p })} />
      <Field label="Body (blank line = new paragraph)">
        <TextArea value={body} onChange={v => onChange({ ...s, body: v.includes("\n\n") ? v.split("\n\n") : v })} rows={6} />
      </Field>
    </>
  )
}

function SplitEditor({ s, onChange }: { s: SplitSection; onChange: (s: SplitSection) => void }) {
  const body = Array.isArray(s.body) ? s.body.join("\n\n") : s.body
  const meta = s.meta ?? []
  return (
    <>
      <BaseHeadingFields s={s} onChange={p => onChange({ ...s, ...p })} />
      <Field label="Body">
        <TextArea value={body} onChange={v => onChange({ ...s, body: v.includes("\n\n") ? v.split("\n\n") : v })} rows={5} />
      </Field>
      <div style={{ ...S.label, marginBottom: 8 }}>Meta rows</div>
      {meta.map((m, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
          <input style={{ ...S.input, flex: 1 }} value={m.l} onChange={e => { const nm = [...meta]; nm[i] = { ...m, l: e.target.value }; onChange({ ...s, meta: nm }) }} placeholder="Label" />
          <input style={{ ...S.input, flex: 2 }} value={m.v} onChange={e => { const nm = [...meta]; nm[i] = { ...m, v: e.target.value }; onChange({ ...s, meta: nm }) }} placeholder="Value" />
          <button onClick={() => { const nm = meta.filter((_, j) => j !== i); onChange({ ...s, meta: nm }) }} style={iconBtn}>×</button>
        </div>
      ))}
      <button onClick={() => onChange({ ...s, meta: [...meta, { l: "", v: "" }] })} style={addRowBtn}>+ Add row</button>
    </>
  )
}

function CalloutEditor({ s, onChange }: { s: CalloutSection; onChange: (s: CalloutSection) => void }) {
  return (
    <>
      <Field label="Label"><TextInput value={s.label ?? "NOTE"} onChange={v => onChange({ ...s, label: v })} /></Field>
      <Field label="Heading"><TextInput value={s.heading ?? ""} onChange={v => onChange({ ...s, heading: v })} /></Field>
      <Field label="Italic suffix"><TextInput value={s.italic ?? ""} onChange={v => onChange({ ...s, italic: v })} /></Field>
      <Field label="Body"><TextArea value={s.body} onChange={v => onChange({ ...s, body: v })} rows={4} /></Field>
    </>
  )
}

function CodeEditor({ s, onChange }: { s: CodeSection; onChange: (s: CodeSection) => void }) {
  return (
    <>
      <BaseHeadingFields s={s} onChange={p => onChange({ ...s, ...p })} />
      <Field label="Body text (optional)">
        <TextArea value={s.body ?? ""} onChange={v => onChange({ ...s, body: v || undefined })} rows={3} />
      </Field>
      <Field label="Language"><TextInput value={s.language} onChange={v => onChange({ ...s, language: v })} placeholder="typescript" /></Field>
      <Field label="Code">
        <TextArea value={s.code} onChange={v => onChange({ ...s, code: v })} rows={8} mono />
      </Field>
      <Field label="Caption (optional)"><TextInput value={s.caption ?? ""} onChange={v => onChange({ ...s, caption: v || undefined })} /></Field>
    </>
  )
}

function GalleryEditor({ s, onChange }: { s: GallerySection; onChange: (s: GallerySection) => void }) {
  return (
    <>
      <BaseHeadingFields s={s} onChange={p => onChange({ ...s, ...p })} />
      <Field label="Body (optional)">
        <TextArea value={s.body ?? ""} onChange={v => onChange({ ...s, body: v || undefined })} rows={3} />
      </Field>
      {s.images.map((img, i) => (
        <div key={i} style={{ position: "relative" }}>
          <CoverEditor value={img} label={`Image ${i + 1}`} onChange={v => { const ni = [...s.images]; ni[i] = v; onChange({ ...s, images: ni }) }} />
          {s.images.length > 1 && (
            <button onClick={() => onChange({ ...s, images: s.images.filter((_, j) => j !== i) })} style={{ ...iconBtn, position: "absolute", top: 12, right: 12 }}>×</button>
          )}
        </div>
      ))}
      <button onClick={() => onChange({ ...s, images: [...s.images, defaultCover()] })} style={addRowBtn}>+ Add image</button>
    </>
  )
}

function WideImageEditor({ s, onChange }: { s: WideImageSection; onChange: (s: WideImageSection) => void }) {
  return (
    <>
      <BaseHeadingFields s={s} onChange={p => onChange({ ...s, ...p })} />
      <Field label="Body (optional)">
        <TextArea value={s.body ?? ""} onChange={v => onChange({ ...s, body: v || undefined })} rows={3} />
      </Field>
      <CoverEditor value={s.image} onChange={v => onChange({ ...s, image: v })} />
    </>
  )
}

function AsideImageEditor({ s, onChange }: { s: AsideImageSection; onChange: (s: AsideImageSection) => void }) {
  const body = Array.isArray(s.body) ? s.body.join("\n\n") : s.body
  return (
    <>
      <BaseHeadingFields s={s} onChange={p => onChange({ ...s, ...p })} />
      <Field label="Body">
        <TextArea value={body} onChange={v => onChange({ ...s, body: v.includes("\n\n") ? v.split("\n\n") : v })} rows={5} />
      </Field>
      <Field label="Image side">
        <select style={S.select} value={s.imageSide ?? "right"} onChange={e => onChange({ ...s, imageSide: e.target.value as "left" | "right" })}>
          <option value="right">Right</option>
          <option value="left">Left</option>
        </select>
      </Field>
      <CoverEditor value={s.image} onChange={v => onChange({ ...s, image: v })} />
    </>
  )
}

function QuoteEditor({ s, onChange }: { s: QuoteSection; onChange: (s: QuoteSection) => void }) {
  return (
    <>
      <Field label="Quote text"><TextArea value={s.body} onChange={v => onChange({ ...s, body: v })} rows={4} /></Field>
      <Field label="Attribution"><TextInput value={s.who} onChange={v => onChange({ ...s, who: v })} /></Field>
    </>
  )
}

function StatsEditor({ s, onChange }: { s: StatsSection; onChange: (s: StatsSection) => void }) {
  return (
    <>
      <BaseHeadingFields s={s} onChange={p => onChange({ ...s, ...p })} />
      <Field label="Body (optional)">
        <TextArea value={s.body ?? ""} onChange={v => onChange({ ...s, body: v || undefined })} rows={3} />
      </Field>
      <div style={{ ...S.label, marginBottom: 8 }}>Stats</div>
      {s.stats.map((st, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
          <input style={{ ...S.input, flex: 1 }} value={st.value} onChange={e => { const ns = [...s.stats]; ns[i] = { ...st, value: e.target.value }; onChange({ ...s, stats: ns }) }} placeholder="Value" />
          <input style={{ ...S.input, flex: 2 }} value={st.label} onChange={e => { const ns = [...s.stats]; ns[i] = { ...st, label: e.target.value }; onChange({ ...s, stats: ns }) }} placeholder="Label" />
          <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--fg3)", whiteSpace: "nowrap" }}>
            <input type="checkbox" checked={st.emph ?? false} onChange={e => { const ns = [...s.stats]; ns[i] = { ...st, emph: e.target.checked }; onChange({ ...s, stats: ns }) }} /> emph
          </label>
          {s.stats.length > 1 && (
            <button onClick={() => onChange({ ...s, stats: s.stats.filter((_, j) => j !== i) })} style={iconBtn}>×</button>
          )}
        </div>
      ))}
      <button onClick={() => onChange({ ...s, stats: [...s.stats, { value: "", label: "" }] })} style={addRowBtn}>+ Add stat</button>
    </>
  )
}

function SectionEditor({ s, onChange }: { s: ProjectSection; onChange: (s: ProjectSection) => void }) {
  switch (s.kind) {
    case "prose":       return <ProseEditor s={s} onChange={onChange as (s: ProseSection) => void} />
    case "split":       return <SplitEditor s={s} onChange={onChange as (s: SplitSection) => void} />
    case "callout":     return <CalloutEditor s={s} onChange={onChange as (s: CalloutSection) => void} />
    case "code":        return <CodeEditor s={s} onChange={onChange as (s: CodeSection) => void} />
    case "gallery":     return <GalleryEditor s={s} onChange={onChange as (s: GallerySection) => void} />
    case "wide-image":  return <WideImageEditor s={s} onChange={onChange as (s: WideImageSection) => void} />
    case "aside-image": return <AsideImageEditor s={s} onChange={onChange as (s: AsideImageSection) => void} />
    case "quote":       return <QuoteEditor s={s} onChange={onChange as (s: QuoteSection) => void} />
    case "stats":       return <StatsEditor s={s} onChange={onChange as (s: StatsSection) => void} />
  }
}

/* ────────────────────────────────────────────────────────── */
/*  Hero editor                                               */
/* ────────────────────────────────────────────────────────── */

type HeroData = NonNullable<Project["hero"]>

function HeroEditor({ value, onChange }: { value: HeroData; onChange: (v: HeroData) => void }) {
  const metrics = value.metrics ?? []
  return (
    <div>
      <Field label="Eyebrow"><TextInput value={value.eyebrow} onChange={v => onChange({ ...value, eyebrow: v })} /></Field>
      <Field label="Headline (use *italic* and **bold**)">
        <TextInput value={value.headline} onChange={v => onChange({ ...value, headline: v })} />
      </Field>
      <Field label="Summary"><TextArea value={value.summary} onChange={v => onChange({ ...value, summary: v })} rows={3} /></Field>
      <Field label="Cover (CSS gradient)">
        <TextInput value={value.cover} onChange={v => onChange({ ...value, cover: v })} />
        <div style={{ marginTop: 6, height: 40, borderRadius: 6, background: value.cover }} />
      </Field>
      <div style={{ ...S.label, marginBottom: 8, marginTop: 4 }}>Metrics</div>
      {metrics.map((m, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
          <input style={{ ...S.input, flex: 1 }} value={m.v} onChange={e => { const nm = [...metrics]; nm[i] = { ...m, v: e.target.value }; onChange({ ...value, metrics: nm }) }} placeholder="Value" />
          <input style={{ ...S.input, flex: 2 }} value={m.l} onChange={e => { const nm = [...metrics]; nm[i] = { ...m, l: e.target.value }; onChange({ ...value, metrics: nm }) }} placeholder="Label" />
          <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--fg3)", whiteSpace: "nowrap" }}>
            <input type="checkbox" checked={m.emph ?? false} onChange={e => { const nm = [...metrics]; nm[i] = { ...m, emph: e.target.checked }; onChange({ ...value, metrics: nm }) }} /> emph
          </label>
          {metrics.length > 1 && <button onClick={() => onChange({ ...value, metrics: metrics.filter((_, j) => j !== i) })} style={iconBtn}>×</button>}
        </div>
      ))}
      <button onClick={() => onChange({ ...value, metrics: [...metrics, { v: "", l: "" }] })} style={addRowBtn}>+ Add metric</button>
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  Related editor                                            */
/* ────────────────────────────────────────────────────────── */

type RelatedData = NonNullable<Project["related"]>[number]

function RelatedEditor({ value, onChange }: { value: RelatedData[]; onChange: (v: RelatedData[]) => void }) {
  return (
    <div>
      {value.map((r, i) => (
        <div key={i} style={{ border: "1px solid var(--cobalt-border-lo)", borderRadius: 8, padding: "12px 14px", marginBottom: 10, position: "relative" }}>
          <div style={{ ...S.label, marginBottom: 10 }}>Related {i + 1}</div>
          <Field label="Slug"><TextInput value={r.slug} onChange={v => { const nr = [...value]; nr[i] = { ...r, slug: v }; onChange(nr) }} /></Field>
          <Field label="Name"><TextInput value={r.name} onChange={v => { const nr = [...value]; nr[i] = { ...r, name: v }; onChange(nr) }} /></Field>
          <Field label="Italic"><TextInput value={r.italic} onChange={v => { const nr = [...value]; nr[i] = { ...r, italic: v }; onChange(nr) }} /></Field>
          <Field label="Monogram"><TextInput value={r.monogram} onChange={v => { const nr = [...value]; nr[i] = { ...r, monogram: v }; onChange(nr) }} /></Field>
          <Field label="Cover (CSS gradient)">
            <TextInput value={r.cover} onChange={v => { const nr = [...value]; nr[i] = { ...r, cover: v }; onChange(nr) }} />
            <div style={{ marginTop: 6, height: 32, borderRadius: 6, background: r.cover }} />
          </Field>
          <button onClick={() => onChange(value.filter((_, j) => j !== i))} style={{ ...iconBtn, position: "absolute", top: 10, right: 10 }}>×</button>
        </div>
      ))}
      <button onClick={() => onChange([...value, { slug: "", name: "", italic: "", monogram: "", cover: "linear-gradient(135deg,#023BE6,#5A82FB)" }])} style={addRowBtn}>+ Add related</button>
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  Shared button styles                                      */
/* ────────────────────────────────────────────────────────── */

const iconBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 28, height: 28, border: "1px solid var(--cobalt-border)", borderRadius: 6,
  background: "transparent", color: "var(--fg3)", cursor: "pointer", fontSize: 16,
  flexShrink: 0,
}

const addRowBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "6px 12px", border: "1px dashed var(--cobalt-border)", borderRadius: 6,
  background: "transparent", color: "var(--cobalt-300)", cursor: "pointer",
  fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em",
  marginBottom: 8,
}

/* ────────────────────────────────────────────────────────── */
/*  Accordion panel                                          */
/* ────────────────────────────────────────────────────────── */

function Panel({ title, badge, defaultOpen = false, children }: { title: string; badge?: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ border: "1px solid var(--cobalt-border)", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "12px 14px", background: "var(--ink-900, #08090F)",
          border: "none", cursor: "pointer", color: "var(--fg1)",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {title}
          {badge && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "var(--cobalt-300)", textTransform: "uppercase" as const }}>{badge}</span>}
        </span>
        {open ? <ChevronUp size={14} style={{ color: "var(--fg3)" }} /> : <ChevronDown size={14} style={{ color: "var(--fg3)" }} />}
      </button>
      {open && <div style={{ padding: "14px 14px 8px", borderTop: "1px solid var(--cobalt-border-lo)" }}>{children}</div>}
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  Section card in the sections list                         */
/* ────────────────────────────────────────────────────────── */

function SectionCard({
  s, index, total,
  onMove, onRemove, onChange, onKindChange,
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
  const kindLabel = SECTION_KINDS.find(k => k.value === s.kind)?.label ?? s.kind

  return (
    <div style={{ border: "1px solid var(--cobalt-border)", borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", background: "var(--ink-900, #08090F)" }}>
        <span style={{ color: "var(--fg-mute)", display: "flex", alignItems: "center" }}><GripVertical size={14} /></span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "var(--fg3)", minWidth: 18, textAlign: "center" as const }}>{index + 1}</span>
        {/* Kind selector */}
        <select
          value={s.kind}
          onChange={e => onKindChange(index, e.target.value as SectionKind)}
          style={{ ...S.select, flex: 1, fontSize: 12 }}
        >
          {SECTION_KINDS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
        </select>
        {/* Move up/down */}
        <button onClick={() => onMove(index, index - 1)} disabled={index === 0} style={{ ...iconBtn, opacity: index === 0 ? 0.3 : 1 }}><ChevronUp size={13} /></button>
        <button onClick={() => onMove(index, index + 1)} disabled={index === total - 1} style={{ ...iconBtn, opacity: index === total - 1 ? 0.3 : 1 }}><ChevronDown size={13} /></button>
        {/* Edit toggle */}
        <button onClick={() => setOpen(o => !o)} style={{ ...iconBtn, color: open ? "var(--cobalt-300)" : "var(--fg3)" }}>
          {open ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        {/* Delete */}
        <button onClick={() => onRemove(index)} style={{ ...iconBtn, color: "var(--danger, #FF5470)" }}><Trash2 size={13} /></button>
      </div>
      {/* Fields */}
      {open && (
        <div style={{ padding: "14px 14px 8px", borderTop: "1px solid var(--cobalt-border-lo)" }}>
          <SectionEditor s={s} onChange={ns => onChange(index, ns)} />
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
/*  Main designer component                                   */
/* ────────────────────────────────────────────────────────── */

type ViewportSize = "desktop" | "tablet" | "mobile"

const VIEWPORT: Record<ViewportSize, { width: string; label: string; icon: React.ReactNode }> = {
  desktop: { width: "100%", label: "Desktop", icon: <Monitor size={14} /> },
  tablet:  { width: "768px", label: "Tablet",  icon: <Tablet size={14} /> },
  mobile:  { width: "390px", label: "Mobile",  icon: <Smartphone size={14} /> },
}

export function ProjectDesigner({ initialData }: { initialData: PrismaProject }) {
  /* ── Form state ── */
  const [slug]        = useState(initialData.slug)
  const [order,       setOrder]       = useState(String(initialData.order))
  const [name,        setName]        = useState(initialData.name)
  const [italic,      setItalic]      = useState(initialData.italic)
  const [desc,        setDesc]        = useState(initialData.desc)
  const [cover,       setCover]       = useState(initialData.cover)
  const [monogram,    setMonogram]    = useState(initialData.monogram)
  const [year,        setYear]        = useState(initialData.year)
  const [duration,    setDuration]    = useState(initialData.duration)
  const [status,      setStatus]      = useState<"LIVE"|"RESCUED"|"STEALTH">(initialData.status as "LIVE"|"RESCUED"|"STEALTH")
  const [stack,       setStack]       = useState(initialData.stack.join(", "))
  const [role,        setRole]        = useState(initialData.role ?? "")
  const [client,      setClient]      = useState(initialData.client ?? "")
  const [url,         setUrl]         = useState(initialData.url ?? "")
  const [hero,        setHero]        = useState<NonNullable<Project["hero"]>>(
    initialData.hero
      ? (initialData.hero as unknown as NonNullable<Project["hero"]>)
      : { eyebrow: "", headline: "", summary: "", metrics: [{ v: "", l: "" }], cover: "" }
  )
  const [sections,    setSections]    = useState<ProjectSection[]>(
    initialData.sections ? (initialData.sections as unknown as ProjectSection[]) : []
  )
  const [related,     setRelated]     = useState<NonNullable<Project["related"]>>(
    initialData.related ? (initialData.related as unknown as NonNullable<Project["related"]>) : []
  )

  /* ── Preview state ── */
  const [viewport,    setViewport]    = useState<ViewportSize>("desktop")
  const [saveError,   setSaveError]   = useState("")
  const [saved,       setSaved]       = useState(false)
  const [isPending,   startTransition] = useTransition()
  const iframeRef                     = useRef<HTMLIFrameElement>(null)
  const previewTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Build project object from state ── */
  const buildProject = useCallback((): Project => ({
    slug,
    name, italic, desc, cover, monogram, year, duration, status,
    stack: stack.split(",").map(s => s.trim()).filter(Boolean),
    role: role || undefined,
    client: client || undefined,
    url: url || undefined,
    hero,
    sections: sections.length ? sections : undefined,
    related: related.length ? related : undefined,
  }), [slug, name, italic, desc, cover, monogram, year, duration, status, stack, role, client, url, hero, sections, related])

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
        doc.open(); doc.write(html); doc.close()
      } catch { /* ignore preview errors */ }
    }, 600)
  }, [buildProject])

  /* Re-render preview whenever any state changes */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refreshPreview() }, [name, italic, desc, cover, monogram, year, duration, status, stack, role, client, url, hero, sections, related])

  /* Initial preview load */
  useEffect(() => { refreshPreview() }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    fd.set("related", related.length ? JSON.stringify(related) : "")

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
  function removeSection(i: number) { setSections(s => s.filter((_, j) => j !== i)) }
  function updateSection(i: number, s: ProjectSection) { setSections(ss => { const ns = [...ss]; ns[i] = s; return ns }) }
  function changeKind(i: number, kind: SectionKind) { setSections(ss => { const ns = [...ss]; ns[i] = defaultSection(kind); return ns }) }
  function addSection(kind: SectionKind) { setSections(ss => [...ss, defaultSection(kind)]) }

  const [addKind, setAddKind] = useState<SectionKind>("prose")

  /* ────────────────────────────────────────────── */
  /*  Render                                        */
  /* ────────────────────────────────────────────── */
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--ink-950, #050609)", color: "var(--fg1)", fontFamily: "var(--font-sans)" }}>
      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "0 16px",
        height: 52, borderBottom: "1px solid var(--cobalt-border)",
        background: "var(--ink-900, #08090F)", flexShrink: 0,
      }}>
        <a href="/admin/dashboard/projects" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg3)", textDecoration: "none", fontSize: 13 }}>
          <ArrowLeft size={14} /> Projects
        </a>
        <span style={{ color: "var(--cobalt-border-hi)", fontSize: 18 }}>·</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".08em", color: "var(--fg2)" }}>{slug}</span>
        <span style={{ flex: 1 }} />
        {/* Viewport switcher */}
        <div style={{ display: "flex", gap: 4 }}>
          {(Object.keys(VIEWPORT) as ViewportSize[]).map(v => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              title={VIEWPORT[v].label}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 32, height: 32, border: "1px solid var(--cobalt-border)", borderRadius: 6,
                background: viewport === v ? "var(--cobalt-500)" : "transparent",
                color: viewport === v ? "#fff" : "var(--fg3)", cursor: "pointer",
              }}
            >{VIEWPORT[v].icon}</button>
          ))}
        </div>
        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isPending}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
            background: saved ? "var(--success, #2BD178)" : "var(--cobalt-500)",
            color: "#fff", border: "none", borderRadius: 6, cursor: isPending ? "default" : "pointer",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
            opacity: isPending ? 0.7 : 1, transition: "background 0.2s",
          }}
        >
          <Save size={14} />
          {isPending ? "Saving…" : saved ? "Saved!" : "Save"}
        </button>
      </div>

      {/* ── Error banner ── */}
      {saveError && (
        <div style={{ padding: "10px 16px", background: "rgba(239,68,68,.12)", borderBottom: "1px solid rgba(239,68,68,.3)", color: "#f87171", fontFamily: "var(--font-sans)", fontSize: 13 }}>
          {saveError}
        </div>
      )}

      {/* ── Main split ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── LEFT: editor panel ── */}
        <div style={{ width: 380, flexShrink: 0, overflowY: "auto", borderRight: "1px solid var(--cobalt-border)", padding: "16px 14px" }}>

          {/* Core fields */}
          <Panel title="Core fields" defaultOpen>
            <Field label="Order">
              <input style={S.input} type="number" value={order} onChange={e => setOrder(e.target.value)} />
            </Field>
            <Field label="Name"><TextInput value={name} onChange={setName} /></Field>
            <Field label="Italic subtitle"><TextInput value={italic} onChange={setItalic} /></Field>
            <Field label="Description">
              <TextArea value={desc} onChange={setDesc} rows={3} />
            </Field>
            <Field label="Cover card (CSS gradient or URL)">
              <TextInput value={cover} onChange={setCover} />
              <div style={{ marginTop: 6, height: 40, borderRadius: 8, background: cover }} />
            </Field>
            <Field label="Monogram"><TextInput value={monogram} onChange={setMonogram} /></Field>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, ...S.row }}>
                <label style={S.label}>Year</label>
                <input style={S.input} value={year} onChange={e => setYear(e.target.value)} />
              </div>
              <div style={{ flex: 1, ...S.row }}>
                <label style={S.label}>Duration</label>
                <input style={S.input} value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
            </div>
            <Field label="Status">
              <select style={S.select} value={status} onChange={e => setStatus(e.target.value as typeof status)}>
                <option value="LIVE">LIVE</option>
                <option value="RESCUED">RESCUED</option>
                <option value="STEALTH">STEALTH</option>
              </select>
            </Field>
            <Field label="Stack (comma-separated)">
              <TextInput value={stack} onChange={setStack} placeholder="Next.js, TypeScript, Prisma" />
            </Field>
          </Panel>

          {/* Detail fields */}
          <Panel title="Detail fields">
            <Field label="Role (optional)"><TextInput value={role} onChange={setRole} /></Field>
            <Field label="Client (optional)"><TextInput value={client} onChange={setClient} /></Field>
            <Field label="URL (optional)"><TextInput value={url} onChange={setUrl} /></Field>
          </Panel>

          {/* Hero */}
          <Panel title="Hero" badge="detail page">
            <HeroEditor value={hero} onChange={setHero} />
          </Panel>

          {/* Sections */}
          <Panel title={`Sections (${sections.length})`} badge="detail page" defaultOpen>
            {sections.map((s, i) => (
              <SectionCard
                key={i}
                s={s} index={i} total={sections.length}
                onMove={moveSection}
                onRemove={removeSection}
                onChange={updateSection}
                onKindChange={changeKind}
              />
            ))}
            {/* Add section */}
            <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
              <select style={{ ...S.select, flex: 1 }} value={addKind} onChange={e => setAddKind(e.target.value as SectionKind)}>
                {SECTION_KINDS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
              <button
                onClick={() => addSection(addKind)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 12px",
                  background: "var(--cobalt-500)", color: "#fff", border: "none", borderRadius: 6,
                  cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, whiteSpace: "nowrap" as const,
                }}
              >
                <Plus size={13} /> Add
              </button>
            </div>
          </Panel>

          {/* Related */}
          <Panel title={`Related (${related.length})`} badge="detail page">
            <RelatedEditor value={related} onChange={setRelated} />
          </Panel>

        </div>

        {/* ── RIGHT: preview ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#0a0b10" }}>
          {/* Preview toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 14px", borderBottom: "1px solid var(--cobalt-border)", background: "var(--ink-900, #08090F)", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "var(--fg3)" }}>Live preview</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--cobalt-300)" }}>— auto-updates</span>
            <span style={{ flex: 1 }} />
            <a
              href={`/work/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "var(--cobalt-300)", textDecoration: "none" }}
            >
              Open live ↗
            </a>
          </div>
          {/* Iframe wrapper */}
          <div style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", padding: viewport === "desktop" ? 0 : "16px 0" }}>
            <div style={{
              width: VIEWPORT[viewport].width,
              height: "100%",
              transition: "width 0.3s var(--ease-out, ease)",
              position: "relative",
              boxShadow: viewport !== "desktop" ? "0 0 0 1px var(--cobalt-border), 0 32px 64px rgba(0,0,0,.6)" : "none",
              borderRadius: viewport !== "desktop" ? 8 : 0,
              overflow: viewport !== "desktop" ? "hidden" : "visible",
            }}>
              <iframe
                ref={iframeRef}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                title="Project preview"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
