import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { createService } from "../actions"

export default async function NewServicePage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Service" backHref="/admin/dashboard/services" />
      <AdminForm action={createService} cancelHref="/admin/dashboard/services">
        <div style={formRowStyle}>
          <label style={labelStyle}>ID</label>
          <input name="id" type="text" style={fieldStyle} placeholder="e.g. problem-solving" required />
          <span style={hintStyle}>Unique slug, no spaces</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Title</label>
          <input name="title" type="text" style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Italic subtitle</label>
          <input name="italic" type="text" style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Description</label>
          <textarea name="desc" rows={4} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Deliverables</label>
          <textarea name="deliverables" rows={3} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} placeholder="Full audit report, Prioritised fix list" />
          <span style={hintStyle}>Comma-separated</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Examples</label>
          <textarea name="examples" rows={3} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} placeholder="Legacy Rails app, Inherited Next.js codebase" />
          <span style={hintStyle}>Comma-separated</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Icon</label>
          <input name="icon" type="text" style={fieldStyle} placeholder="spark, shield, gauge, or ai" />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Duration</label>
          <input name="duration" type="text" style={fieldStyle} placeholder="e.g. 1–2 weeks" />
        </div>
      </AdminForm>
    </div>
  )
}
