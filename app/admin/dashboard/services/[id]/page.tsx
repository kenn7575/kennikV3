import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { updateService } from "../actions"

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const svc = await prisma.service.findUnique({ where: { id } })
  if (!svc) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Service" backHref="/admin/dashboard/services" />
      <AdminForm action={updateService.bind(null, svc.id)} cancelHref="/admin/dashboard/services">
        <div style={formRowStyle}>
          <label style={labelStyle}>ID</label>
          <input name="id-display" type="text" value={svc.id} disabled style={{ ...fieldStyle, opacity: 0.5 }} />
          <span style={hintStyle}>ID cannot be changed after creation</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={svc.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Title</label>
          <input name="title" type="text" defaultValue={svc.title} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Italic subtitle</label>
          <input name="italic" type="text" defaultValue={svc.italic} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Description</label>
          <textarea name="desc" rows={4} defaultValue={svc.desc} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Deliverables</label>
          <textarea name="deliverables" rows={3} defaultValue={svc.deliverables.join(", ")} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} />
          <span style={hintStyle}>Comma-separated</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Examples</label>
          <textarea name="examples" rows={3} defaultValue={svc.examples.join(", ")} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} />
          <span style={hintStyle}>Comma-separated</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Icon</label>
          <input name="icon" type="text" defaultValue={svc.icon} style={fieldStyle} />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Duration</label>
          <input name="duration" type="text" defaultValue={svc.duration} style={fieldStyle} />
        </div>
      </AdminForm>
    </div>
  )
}
