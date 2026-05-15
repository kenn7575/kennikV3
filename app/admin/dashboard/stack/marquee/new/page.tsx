import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../../_components/page-header"
import { AdminForm } from "../../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { createMarqueeItem } from "../../actions"

export default async function NewMarqueeItemPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Marquee Item" backHref="/admin/dashboard/stack" />
      <AdminForm action={createMarqueeItem} cancelHref="/admin/dashboard/stack">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Name</label>
          <input name="name" type="text" style={fieldStyle} placeholder="e.g. TypeScript" required />
        </div>
      </AdminForm>
    </div>
  )
}
