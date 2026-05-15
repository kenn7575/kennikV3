import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { createValue } from "../actions"

export default async function NewValuePage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Value" backHref="/admin/dashboard/values" />
      <AdminForm action={createValue} cancelHref="/admin/dashboard/values">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Title</label>
          <input name="t" type="text" style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Body</label>
          <textarea name="b" rows={4} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
      </AdminForm>
    </div>
  )
}
