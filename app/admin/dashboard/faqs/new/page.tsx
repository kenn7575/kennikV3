import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { createFaq } from "../actions"

export default async function NewFaqPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New FAQ" backHref="/admin/dashboard/faqs" />
      <AdminForm action={createFaq} cancelHref="/admin/dashboard/faqs">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Question</label>
          <textarea name="q" rows={3} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Answer</label>
          <textarea name="a" rows={5} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
      </AdminForm>
    </div>
  )
}
