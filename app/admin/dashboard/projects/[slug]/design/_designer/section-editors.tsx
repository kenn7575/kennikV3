"use client"

import type {
  ProjectSection,
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
import { inputCls, labelCls, selectCls, addRowBtnCls, iconBtnCls } from "./primitives"
import { defaultCover } from "./primitives"
import { Field, TextInput, TextArea, CoverEditor, BaseHeadingFields } from "./fields"

/* ── Prose ───────────────────────────────────────────────────────────────── */

export function ProseEditor({
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

/* ── Split ───────────────────────────────────────────────────────────────── */

export function SplitEditor({
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
        <div key={i} className="mb-1.5 flex items-center gap-2">
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
            className={inputCls + " flex-2"}
            value={m.v}
            onChange={(e) => {
              const nm = [...meta]
              nm[i] = { ...m, v: e.target.value }
              onChange({ ...s, meta: nm })
            }}
            placeholder="Value"
          />
          <button
            onClick={() => onChange({ ...s, meta: meta.filter((_, j) => j !== i) })}
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

/* ── Callout ─────────────────────────────────────────────────────────────── */

export function CalloutEditor({
  s,
  onChange,
}: {
  s: CalloutSection
  onChange: (s: CalloutSection) => void
}) {
  return (
    <>
      <Field label="Label">
        <TextInput value={s.label ?? "NOTE"} onChange={(v) => onChange({ ...s, label: v })} />
      </Field>
      <Field label="Heading">
        <TextInput value={s.heading ?? ""} onChange={(v) => onChange({ ...s, heading: v })} />
      </Field>
      <Field label="Italic suffix">
        <TextInput value={s.italic ?? ""} onChange={(v) => onChange({ ...s, italic: v })} />
      </Field>
      <Field label="Body">
        <TextArea value={s.body} onChange={(v) => onChange({ ...s, body: v })} rows={4} />
      </Field>
    </>
  )
}

/* ── Code ────────────────────────────────────────────────────────────────── */

export function CodeEditor({
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
        <TextArea value={s.code} onChange={(v) => onChange({ ...s, code: v })} rows={8} mono />
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

/* ── Gallery ─────────────────────────────────────────────────────────────── */

export function GalleryEditor({
  s,
  onChange,
  slug,
}: {
  s: GallerySection
  onChange: (s: GallerySection) => void
  slug?: string
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
            slug={slug}
            onChange={(v) => {
              const ni = [...s.images]
              ni[i] = v
              onChange({ ...s, images: ni })
            }}
            onImageUploaded={(url) => {
              const ni = [...s.images]
              ni[i] = { ...ni[i], cover: url }
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
        onClick={() => onChange({ ...s, images: [...s.images, defaultCover()] })}
        className={addRowBtnCls}
      >
        + Add image
      </button>
    </>
  )
}

/* ── Wide image ──────────────────────────────────────────────────────────── */

export function WideImageEditor({
  s,
  onChange,
  slug,
}: {
  s: WideImageSection
  onChange: (s: WideImageSection) => void
  slug?: string
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
        slug={slug}
        onChange={(v) => onChange({ ...s, image: v })}
        onImageUploaded={(url) => onChange({ ...s, image: { ...s.image, cover: url } })}
      />
    </>
  )
}

/* ── Aside image ─────────────────────────────────────────────────────────── */

export function AsideImageEditor({
  s,
  onChange,
  slug,
}: {
  s: AsideImageSection
  onChange: (s: AsideImageSection) => void
  slug?: string
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
        slug={slug}
        onChange={(v) => onChange({ ...s, image: v })}
        onImageUploaded={(url) => onChange({ ...s, image: { ...s.image, cover: url } })}
      />
    </>
  )
}

/* ── Quote ───────────────────────────────────────────────────────────────── */

export function QuoteEditor({
  s,
  onChange,
}: {
  s: QuoteSection
  onChange: (s: QuoteSection) => void
}) {
  return (
    <>
      <Field label="Quote text">
        <TextArea value={s.body} onChange={(v) => onChange({ ...s, body: v })} rows={4} />
      </Field>
      <Field label="Attribution">
        <TextInput value={s.who} onChange={(v) => onChange({ ...s, who: v })} />
      </Field>
    </>
  )
}

/* ── Stats ───────────────────────────────────────────────────────────────── */

export function StatsEditor({
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
        <div key={i} className="mb-1.5 flex items-center gap-2">
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
            className={inputCls + " flex-2"}
            value={st.label}
            onChange={(e) => {
              const ns = [...s.stats]
              ns[i] = { ...st, label: e.target.value }
              onChange({ ...s, stats: ns })
            }}
            placeholder="Label"
          />
          <label className="flex items-center gap-1 text-[12px] whitespace-nowrap text-(--fg3)">
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
        onClick={() => onChange({ ...s, stats: [...s.stats, { value: "", label: "" }] })}
        className={addRowBtnCls}
      >
        + Add stat
      </button>
    </>
  )
}

/* ── Dispatcher ──────────────────────────────────────────────────────────── */

export function SectionEditor({
  s,
  onChange,
  slug,
}: {
  s: ProjectSection
  onChange: (s: ProjectSection) => void
  slug?: string
}) {
  switch (s.kind) {
    case "prose":
      return <ProseEditor s={s} onChange={onChange as (s: ProseSection) => void} />
    case "split":
      return <SplitEditor s={s} onChange={onChange as (s: SplitSection) => void} />
    case "callout":
      return <CalloutEditor s={s} onChange={onChange as (s: CalloutSection) => void} />
    case "code":
      return <CodeEditor s={s} onChange={onChange as (s: CodeSection) => void} />
    case "gallery":
      return <GalleryEditor s={s} slug={slug} onChange={onChange as (s: GallerySection) => void} />
    case "wide-image":
      return <WideImageEditor s={s} slug={slug} onChange={onChange as (s: WideImageSection) => void} />
    case "aside-image":
      return <AsideImageEditor s={s} slug={slug} onChange={onChange as (s: AsideImageSection) => void} />
    case "quote":
      return <QuoteEditor s={s} onChange={onChange as (s: QuoteSection) => void} />
    case "stats":
      return <StatsEditor s={s} onChange={onChange as (s: StatsSection) => void} />
  }
}
