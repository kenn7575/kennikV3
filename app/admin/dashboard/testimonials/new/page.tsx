import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { createTestimonial } from "../actions"

export default async function NewTestimonialPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Testimonial" backHref="/admin/dashboard/testimonials" />
      <AdminForm action={createTestimonial} cancelHref="/admin/dashboard/testimonials">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Quote</label>
          <textarea name="quote" rows={4} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Name</label>
          <input name="who" type="text" style={fieldStyle} placeholder="e.g. Sarah Jensen" required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Company</label>
          <input name="co" type="text" style={fieldStyle} placeholder="e.g. Mailroom" required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Initials</label>
          <input name="initials" type="text" style={fieldStyle} placeholder="e.g. SJ" maxLength={3} required />
        </div>
      </AdminForm>
    </div>
  )
}
