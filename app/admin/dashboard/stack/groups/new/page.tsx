import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../../_components/page-header"
import { AdminForm } from "../../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { createStackGroup } from "../../actions"

export default async function NewStackGroupPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Stack Group" backHref="/admin/dashboard/stack" />
      <AdminForm action={createStackGroup} cancelHref="/admin/dashboard/stack">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Group name</label>
          <input name="group" type="text" style={fieldStyle} placeholder="e.g. Frameworks" required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Items</label>
          <textarea name="items" rows={4} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} placeholder="Next.js, React, Tailwind" required />
          <span style={hintStyle}>Comma-separated</span>
        </div>
      </AdminForm>
    </div>
  )
}
