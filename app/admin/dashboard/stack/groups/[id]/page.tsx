import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../../_components/page-header"
import { AdminForm } from "../../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { updateStackGroup } from "../../actions"

export default async function EditStackGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const group = await prisma.stackGroup.findUnique({ where: { id: parseInt(id) } })
  if (!group) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Stack Group" backHref="/admin/dashboard/stack" />
      <AdminForm action={updateStackGroup.bind(null, group.id)} cancelHref="/admin/dashboard/stack">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={group.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Group name</label>
          <input name="group" type="text" defaultValue={group.group} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Items</label>
          <textarea name="items" rows={4} defaultValue={group.items.join(", ")} style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 13 }} required />
          <span style={hintStyle}>Comma-separated</span>
        </div>
      </AdminForm>
    </div>
  )
}
