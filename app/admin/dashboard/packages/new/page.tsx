import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { createPackage } from "../actions"

export default async function NewPackagePage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Package" backHref="/admin/dashboard/packages" />
      <AdminForm action={createPackage} cancelHref="/admin/dashboard/packages">
        <div style={formRowStyle}>
          <label style={labelStyle}>ID</label>
          <input name="id" type="text" style={fieldStyle} placeholder="e.g. rescue" required />
          <span style={hintStyle}>Unique slug, no spaces</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Name</label>
          <input name="name" type="text" style={fieldStyle} placeholder="e.g. Rescue" required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Italic subtitle</label>
          <input name="italic" type="text" style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Price</label>
          <input name="price" type="text" style={fieldStyle} placeholder="e.g. €4,500" required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Duration</label>
          <input name="duration" type="text" style={fieldStyle} placeholder="e.g. 1–2 weeks" />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Blurb</label>
          <textarea name="blurb" rows={3} style={{ ...fieldStyle, resize: "vertical" }} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Includes</label>
          <textarea name="includes" rows={4} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} placeholder="Code audit, Performance fixes, Bug fixes" />
          <span style={hintStyle}>Comma-separated</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>CTA text</label>
          <input name="cta" type="text" style={fieldStyle} placeholder="e.g. Book a rescue" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <input name="featured" type="checkbox" id="featured" style={{ width: 16, height: 16, accentColor: "var(--cobalt-500)" }} />
          <label htmlFor="featured" style={{ ...labelStyle, margin: 0 }}>Featured</label>
        </div>
      </AdminForm>
    </div>
  )
}
