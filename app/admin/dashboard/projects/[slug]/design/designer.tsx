"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { Monitor, Tablet, Smartphone, Save, ArrowLeft, Plus } from "lucide-react"
import type { Project, ProjectSection } from "@/lib/data/projects"
import { updateProjectNoRedirect } from "../../actions"
import {
  PrismaProject,
  SECTION_KINDS,
  SectionKind,
  defaultSection,
  inputCls,
  selectCls,
  labelCls,
  rowCls,
} from "./_designer/primitives"
import { Field, TextInput, TextArea, CoverEditor } from "./_designer/fields"
import { Panel } from "./_designer/panel"
import { HeroEditor } from "./_designer/hero-editor"
import { SectionCard } from "./_designer/section-card"
import { RelatedPicker, ProjectStub } from "./_designer/related-picker"

/* ── Viewport config ─────────────────────────────────────────────────────── */

type ViewportSize = "desktop" | "tablet" | "mobile"

const VIEWPORT: Record<ViewportSize, { width: string; label: string; icon: React.ReactNode }> = {
  desktop: { width: "100%", label: "Desktop", icon: <Monitor size={14} /> },
  tablet: { width: "768px", label: "Tablet", icon: <Tablet size={14} /> },
  mobile: { width: "390px", label: "Mobile", icon: <Smartphone size={14} /> },
}

/* ── Main component ──────────────────────────────────────────────────────── */

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
  const [coverImage, setCoverImage] = useState(initialData.coverImage ?? "")
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
  const [heroImage, setHeroImage] = useState(initialData.heroImage ?? "")
  const [hero, setHero] = useState<NonNullable<Project["hero"]>>(
    initialData.hero
      ? (initialData.hero as unknown as NonNullable<Project["hero"]>)
      : { eyebrow: "", headline: "", summary: "", metrics: [{ v: "", l: "" }], cover: "" }
  )
  const [sections, setSections] = useState<ProjectSection[]>(
    initialData.sections ? (initialData.sections as unknown as ProjectSection[]) : []
  )
  const [relatedSlugs, setRelatedSlugs] = useState<string[]>(initialData.relatedSlugs)

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
      stack: stack.split(",").map((s) => s.trim()).filter(Boolean),
      role: role || undefined,
      client: client || undefined,
      url: url || undefined,
      coverImage: coverImage || undefined,
      heroImage: heroImage || undefined,
      hero,
      sections: sections.length ? sections : undefined,
      related: undefined,
    }),
    [slug, name, italic, desc, cover, coverImage, monogram, year, duration, status, stack, role, client, url, heroImage, hero, sections]
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refreshPreview()
  }, [name, italic, desc, cover, monogram, year, duration, status, stack, role, client, url, hero, sections])

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
    fd.set("coverImage", coverImage)
    fd.set("monogram", monogram)
    fd.set("year", year)
    fd.set("duration", duration)
    fd.set("status", status)
    fd.set("stack", stack)
    fd.set("role", role)
    fd.set("client", client)
    fd.set("url", url)
    fd.set("heroImage", heroImage)
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

  /* ── Section helpers ── */
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

  /* ── Render ── */
  return (
    <div className="flex h-screen flex-col bg-(--ink-950) font-sans text-(--fg1)">
      {/* Top bar */}
      <div className="flex h-13 shrink-0 items-center gap-3 border-b border-(--cobalt-border) bg-(--ink-900) px-4">
        <a
          href="/admin/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-[13px] text-(--fg3) no-underline"
        >
          <ArrowLeft size={14} /> Projects
        </a>
        <span className="text-[18px] text-(--cobalt-border-hi)">·</span>
        <span className="font-mono text-[12px] tracking-[.08em] text-(--fg2)">{slug}</span>
        <span className="flex-1" />
        <div className="flex gap-1">
          {(Object.keys(VIEWPORT) as ViewportSize[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              title={VIEWPORT[v].label}
              className={
                "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[6px] border border-(--cobalt-border) " +
                (viewport === v ? "bg-(--cobalt-500) text-white" : "bg-transparent text-(--fg3)")
              }
            >
              {VIEWPORT[v].icon}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className={
            "inline-flex items-center gap-1.5 rounded-[6px] border-none px-3.5 py-1.75 font-sans text-[13px] font-medium text-white transition-[background] duration-200 " +
            (saved ? "bg-(--success,#2BD178)" : "bg-(--cobalt-500)") +
            (isPending ? " cursor-default opacity-70" : " cursor-pointer")
          }
        >
          <Save size={14} />
          {isPending ? "Saving…" : saved ? "Saved!" : "Save"}
        </button>
      </div>

      {/* Error banner */}
      {saveError && (
        <div className="border-b border-[rgba(239,68,68,.3)] bg-[rgba(239,68,68,.12)] px-4 py-2.5 font-sans text-[13px] text-[#f87171]">
          {saveError}
        </div>
      )}

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: editor */}
        <div className="w-95 shrink-0 overflow-y-auto border-r border-(--cobalt-border) px-3.5 py-4">
          <Panel title="Core fields" defaultOpen>
            <Field label="Order">
              <input className={inputCls} type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
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
            <CoverEditor
              label="Cover card"
              slug={slug}
              value={{ cover, mono: monogram }}
              onChange={(ci) => {
                setCover(ci.cover)
                setMonogram(ci.mono)
              }}
              imageUrl={coverImage}
              onImageUploaded={setCoverImage}
            />
            <div className="flex gap-2.5">
              <div className={rowCls + " flex-1"}>
                <label className={labelCls}>Year</label>
                <input className={inputCls} value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
              <div className={rowCls + " flex-1"}>
                <label className={labelCls}>Duration</label>
                <input className={inputCls} value={duration} onChange={(e) => setDuration(e.target.value)} />
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
              <TextInput value={stack} onChange={setStack} placeholder="Next.js, TypeScript, Prisma" />
            </Field>
          </Panel>

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

          <Panel title="Hero" badge="detail page">
            <HeroEditor
              value={hero}
              onChange={setHero}
              slug={slug}
              imageUrl={heroImage}
              onImageUploaded={setHeroImage}
            />
          </Panel>

          <Panel title={`Sections (${sections.length})`} badge="detail page" defaultOpen>
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
                slug={slug}
              />
            ))}
            <div className="mt-1 flex items-center gap-2">
              <select
                className={selectCls + " flex-1"}
                value={addKind}
                onChange={(e) => setAddKind(e.target.value as SectionKind)}
              >
                {SECTION_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
              <button
                onClick={() => addSection(addKind)}
                className="inline-flex cursor-pointer items-center gap-1.25 rounded-[6px] border-none bg-(--cobalt-500) px-3 py-2 font-sans text-[13px] whitespace-nowrap text-white"
              >
                <Plus size={13} /> Add
              </button>
            </div>
          </Panel>

          <Panel title={`Related (${relatedSlugs.length})`} badge="detail page">
            <RelatedPicker
              allProjects={allProjects}
              selfSlug={slug}
              value={relatedSlugs}
              onChange={setRelatedSlugs}
            />
          </Panel>
        </div>

        {/* RIGHT: preview */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#0a0b10]">
          <div className="flex shrink-0 items-center gap-2.5 border-b border-(--cobalt-border) bg-(--ink-900) px-3.5 py-1.5">
            <span className="font-mono text-[11px] tracking-[.12em] text-(--fg3) uppercase">
              Live preview
            </span>
            <span className="font-mono text-[11px] text-(--cobalt-300)">— auto-updates</span>
            <span className="flex-1" />
            <a
              href={`/work/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-widest text-(--cobalt-300) uppercase no-underline"
            >
              Open live ↗
            </a>
          </div>
          <div
            className={
              "flex flex-1 justify-center overflow-auto " +
              (viewport === "desktop" ? "p-0" : "py-4")
            }
          >
            <div
              className={
                "relative h-full transition-[width] duration-300 ease-(--ease-out,ease) " +
                (viewport !== "desktop"
                  ? "overflow-hidden rounded-lg shadow-[0_0_0_1px_var(--cobalt-border),0_32px_64px_rgba(0,0,0,.6)]"
                  : "")
              }
              style={{ width: VIEWPORT[viewport].width }}
            >
              <iframe
                ref={iframeRef}
                className="block h-full w-full border-none"
                title="Project preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
