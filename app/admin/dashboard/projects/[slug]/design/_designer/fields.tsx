"use client"

import type { CoverImage } from "@/lib/data/projects"
import {
  inputCls,
  textareaCls,
  monoInputCls,
  labelCls,
  rowCls,
} from "./primitives"

/* ── Field wrapper ───────────────────────────────────────────────────────── */

export function Field({
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

/* ── TextInput ───────────────────────────────────────────────────────────── */

export function TextInput({
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

/* ── TextArea ────────────────────────────────────────────────────────────── */

export function TextArea({
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

/* ── CoverEditor ─────────────────────────────────────────────────────────── */

export function CoverEditor({
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
    <div className="mb-2.5 rounded-lg border border-[--cobalt-border-lo] px-3.5 py-3">
      <div className={labelCls + " mb-2.5"}>{label}</div>
      <Field label="cover (CSS gradient or URL)">
        <TextInput
          value={value.cover}
          onChange={(v) => set("cover", v)}
          placeholder="linear-gradient(135deg,#023BE6,#5A82FB)"
        />
        <div
          className="mt-1.5 h-9 rounded-[6px]"
          style={{ background: value.cover }}
        />
      </Field>
      <Field label="Mono text">
        <TextInput value={value.mono} onChange={(v) => set("mono", v)} />
      </Field>
      <Field label="Label (optional)">
        <TextInput value={value.label ?? ""} onChange={(v) => set("label", v)} />
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

/* ── BaseHeadingFields ───────────────────────────────────────────────────── */

export function BaseHeadingFields({
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
