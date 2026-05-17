import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { updateProject } from "../actions"

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { slug } = await params
  const proj = await prisma.project.findUnique({ where: { slug } })
  if (!proj) notFound()

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Project" backHref="/admin/dashboard/projects" />
      <AdminForm action={updateProject.bind(null, proj.slug)} cancelHref="/admin/dashboard/projects">
        <div style={formRowStyle}>
          <label style={labelStyle}>Slug</label>
          <input name="slug-display" type="text" value={proj.slug} disabled style={{ ...fieldStyle, opacity: 0.5 }} />
          <span style={hintStyle}>Slug cannot be changed after creation</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={proj.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Name</label>
          <input name="name" type="text" defaultValue={proj.name} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Italic subtitle</label>
          <input name="italic" type="text" defaultValue={proj.italic} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Description</label>
          <textarea name="desc" rows={3} defaultValue={proj.desc} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Cover</label>
          <input name="cover" type="text" defaultValue={proj.cover} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Monogram</label>
          <input name="monogram" type="text" defaultValue={proj.monogram} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Year</label>
          <input name="year" type="text" defaultValue={proj.year} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Duration</label>
          <input name="duration" type="text" defaultValue={proj.duration} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Status</label>
          <select name="status" style={fieldStyle} defaultValue={proj.status}>
            <option value="LIVE">LIVE</option>
            <option value="RESCUED">RESCUED</option>
            <option value="STEALTH">STEALTH</option>
          </select>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Stack</label>
          <textarea name="stack" rows={2} defaultValue={proj.stack.join(", ")} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} />
          <span style={hintStyle}>Comma-separated</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Role (optional)</label>
          <input name="role" type="text" defaultValue={proj.role ?? ""} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Client (optional)</label>
          <input name="client" type="text" defaultValue={proj.client ?? ""} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>URL (optional)</label>
          <input name="url" type="text" defaultValue={proj.url ?? ""} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Hero (JSON, optional)</label>
          <textarea
            name="hero"
            rows={8}
            defaultValue={proj.hero ? JSON.stringify(proj.hero, null, 2) : ""}
            style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 12 }}
          />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Sections (JSON, optional)</label>
          <textarea
            name="sections"
            rows={12}
            defaultValue={proj.sections ? JSON.stringify(proj.sections, null, 2) : ""}
            style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 12 }}
          />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Related projects (optional)</label>
          <input
            name="relatedSlugs"
            type="text"
            defaultValue={proj.relatedSlugs.join(", ")}
            style={{ ...fieldStyle, fontFamily: "var(--font-mono)", fontSize: 13 }}
          />
          <span style={hintStyle}>Comma-separated slugs, e.g. halftrack, cobalt-ui</span>
        </div>
      </AdminForm>
    </div>
  )
}
