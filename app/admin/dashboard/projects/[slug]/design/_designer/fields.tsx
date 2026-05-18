"use client"

import { useRef, useState } from "react"
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

/* ── ImageUpload ─────────────────────────────────────────────────────────── */

function ImageUpload({
  slug,
  onUploaded,
}: {
  slug: string
  onUploaded: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)

  async function upload(file: File) {
    setError("")
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("slug", slug)
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Upload failed.")
      onUploaded(data.url as string)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
    e.target.value = ""
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  return (
    <div className="mb-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={
          "flex cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-dashed px-3 py-2.5 text-[12px] transition-colors " +
          (dragging
            ? "border-(--cobalt-300) bg-(--cobalt-500)/10 text-(--cobalt-300)"
            : "border-(--cobalt-border) text-(--fg3) hover:border-(--cobalt-border-hi) hover:text-(--fg2)")
        }
      >
        {uploading ? (
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
            Uploading…
          </span>
        ) : (
          <span>{dragging ? "Drop to upload" : "Drop image or click to browse"}</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onFileChange}
          disabled={uploading}
        />
      </div>
      {error && (
        <p className="mt-1 text-[11px] text-[#f87171]">{error}</p>
      )}
    </div>
  )
}

/* ── CoverEditor ─────────────────────────────────────────────────────────── */

export function CoverEditor({
  value,
  onChange,
  imageUrl,
  onImageUploaded,
  label = "Image",
  slug,
}: {
  value: CoverImage
  onChange: (v: CoverImage) => void
  imageUrl?: string
  onImageUploaded?: (url: string) => void
  label?: string
  slug?: string
}) {
  const set = (k: keyof CoverImage, v: string) =>
    onChange({ ...value, [k]: v || undefined })
  const preview = imageUrl || (value.cover.startsWith("http") ? value.cover : "")
  return (
    <div className="mb-2.5 rounded-lg border border-[--cobalt-border-lo] px-3.5 py-3">
      <div className={labelCls + " mb-2.5"}>{label}</div>
      {slug && onImageUploaded && (
        <ImageUpload slug={slug} onUploaded={onImageUploaded} />
      )}
      {preview && (
        <div className="mb-2 h-20 overflow-hidden rounded-[6px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <Field label="Gradient fallback">
        <TextInput
          value={value.cover}
          onChange={(v) => set("cover", v)}
          placeholder="linear-gradient(135deg,#023BE6,#5A82FB)"
        />
        {!preview && (
          <div
            className="mt-1.5 h-9 rounded-[6px]"
            style={{ background: value.cover }}
          />
        )}
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
