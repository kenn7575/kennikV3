import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { createStat } from "../actions"

export default async function NewStatPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Stat" backHref="/admin/dashboard/stats" />
      <AdminForm action={createStat} cancelHref="/admin/dashboard/stats">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Value</label>
          <input name="v" type="text" style={fieldStyle} placeholder="e.g. 42+" required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Label</label>
          <input name="label" type="text" style={fieldStyle} placeholder="e.g. Projects shipped" required />
        </div>
      </AdminForm>
    </div>
  )
}
