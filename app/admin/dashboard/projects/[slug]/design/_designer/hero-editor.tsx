"use client"

import type { Project } from "@/lib/data/projects"
import { inputCls, labelCls, addRowBtnCls, iconBtnCls } from "./primitives"
import { Field, TextInput, TextArea, CoverEditor } from "./fields"

export type HeroData = NonNullable<Project["hero"]>

export function HeroEditor({
  value,
  onChange,
  slug,
  imageUrl,
  onImageUploaded,
}: {
  value: HeroData
  onChange: (v: HeroData) => void
  slug?: string
  imageUrl?: string
  onImageUploaded?: (url: string) => void
}) {
  const metrics = value.metrics ?? []
  return (
    <div>
      <Field label="Eyebrow">
        <TextInput value={value.eyebrow} onChange={(v) => onChange({ ...value, eyebrow: v })} />
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
      <CoverEditor
        label="Cover"
        slug={slug}
        value={{ cover: value.cover, mono: "" }}
        onChange={(ci) => onChange({ ...value, cover: ci.cover })}
        imageUrl={imageUrl}
        onImageUploaded={onImageUploaded}
      />
      <div className={labelCls + " mt-1 mb-2"}>Metrics</div>
      {metrics.map((m, i) => (
        <div key={i} className="mb-1.5 flex items-center gap-2">
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
            className={inputCls + " flex-2"}
            value={m.l}
            onChange={(e) => {
              const nm = [...metrics]
              nm[i] = { ...m, l: e.target.value }
              onChange({ ...value, metrics: nm })
            }}
            placeholder="Label"
          />
          <label className="flex items-center gap-1 text-[12px] whitespace-nowrap text-(--fg3)">
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
                onChange({ ...value, metrics: metrics.filter((_, j) => j !== i) })
              }
              className={iconBtnCls}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => onChange({ ...value, metrics: [...metrics, { v: "", l: "" }] })}
        className={addRowBtnCls}
      >
        + Add metric
      </button>
    </div>
  )
}
