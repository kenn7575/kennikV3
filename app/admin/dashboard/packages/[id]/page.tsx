import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { updatePackage } from "../actions"

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const pkg = await prisma.package.findUnique({ where: { id } })
  if (!pkg) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Package" backHref="/admin/dashboard/packages" />
      <AdminForm action={updatePackage.bind(null, pkg.id)} cancelHref="/admin/dashboard/packages">
        <div style={formRowStyle}>
          <label style={labelStyle}>ID</label>
          <input
            name="id-display"
            type="text"
            value={pkg.id}
            disabled
            style={{ ...fieldStyle, opacity: 0.5 }}
          />
          <span style={hintStyle}>ID cannot be changed after creation</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={pkg.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Name</label>
          <input name="name" type="text" defaultValue={pkg.name} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Italic subtitle</label>
          <input name="italic" type="text" defaultValue={pkg.italic} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Price</label>
          <input name="price" type="text" defaultValue={pkg.price} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Duration</label>
          <input name="duration" type="text" defaultValue={pkg.duration} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Blurb</label>
          <textarea name="blurb" rows={3} defaultValue={pkg.blurb} style={{ ...fieldStyle, resize: "vertical" }} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Includes</label>
          <textarea name="includes" rows={4} defaultValue={pkg.includes.join(", ")} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} />
          <span style={hintStyle}>Comma-separated</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>CTA text</label>
          <input name="cta" type="text" defaultValue={pkg.cta} style={fieldStyle} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <input name="featured" type="checkbox" id="featured" defaultChecked={pkg.featured} style={{ width: 16, height: 16, accentColor: "var(--cobalt-500)" }} />
          <label htmlFor="featured" style={{ ...labelStyle, margin: 0 }}>Featured</label>
        </div>
      </AdminForm>
    </div>
  )
}
