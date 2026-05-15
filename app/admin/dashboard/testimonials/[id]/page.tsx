import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { updateTestimonial } from "../actions"

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const t = await prisma.testimonial.findUnique({ where: { id: parseInt(id) } })
  if (!t) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Testimonial" backHref="/admin/dashboard/testimonials" />
      <AdminForm action={updateTestimonial.bind(null, t.id)} cancelHref="/admin/dashboard/testimonials">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={t.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Quote</label>
          <textarea name="quote" rows={4} defaultValue={t.quote} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Name</label>
          <input name="who" type="text" defaultValue={t.who} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Company</label>
          <input name="co" type="text" defaultValue={t.co} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Initials</label>
          <input name="initials" type="text" defaultValue={t.initials} style={fieldStyle} maxLength={3} required />
        </div>
      </AdminForm>
    </div>
  )
}
