import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { createProject } from "../actions"

export default async function NewProjectPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Project" backHref="/admin/dashboard/projects" />
      <AdminForm action={createProject} cancelHref="/admin/dashboard/projects">
        <div style={formRowStyle}>
          <label style={labelStyle}>Slug</label>
          <input name="slug" type="text" style={fieldStyle} placeholder="e.g. halftrack" required />
          <span style={hintStyle}>Unique URL slug, no spaces. Used as the primary key.</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Name</label>
          <input name="name" type="text" style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Italic subtitle</label>
          <input name="italic" type="text" style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Description</label>
          <textarea name="desc" rows={3} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Cover</label>
          <input name="cover" type="text" style={fieldStyle} placeholder="CSS gradient or image URL" />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Monogram</label>
          <input name="monogram" type="text" style={fieldStyle} placeholder="e.g. HT" />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Year</label>
          <input name="year" type="text" style={fieldStyle} placeholder="e.g. 2025" />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Duration</label>
          <input name="duration" type="text" style={fieldStyle} placeholder="e.g. 10 weeks" />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Status</label>
          <select name="status" style={fieldStyle} defaultValue="LIVE">
            <option value="LIVE">LIVE</option>
            <option value="RESCUED">RESCUED</option>
            <option value="STEALTH">STEALTH</option>
          </select>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Stack</label>
          <textarea name="stack" rows={2} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} placeholder="Next.js, TypeScript, Postgres" />
          <span style={hintStyle}>Comma-separated</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Role (optional)</label>
          <input name="role" type="text" style={fieldStyle} placeholder="e.g. Full-stack developer" />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Client (optional)</label>
          <input name="client" type="text" style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>URL (optional)</label>
          <input name="url" type="text" style={fieldStyle} placeholder="https://…" />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Hero (JSON, optional)</label>
          <textarea name="hero" rows={8} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 12 }} />
          <span style={hintStyle}>{"{ eyebrow, headline, summary, metrics: [{v, l}], cover }"}</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Sections (JSON, optional)</label>
          <textarea name="sections" rows={12} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 12 }} />
          <span style={hintStyle}>Array of section objects with a "kind" discriminator</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Related (JSON, optional)</label>
          <textarea name="related" rows={6} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 12 }} />
          <span style={hintStyle}>{"[{ slug, name, italic, monogram, cover }]"}</span>
        </div>
      </AdminForm>
    </div>
  )
}
