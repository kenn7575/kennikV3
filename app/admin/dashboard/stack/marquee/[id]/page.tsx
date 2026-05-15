import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../../_components/page-header"
import { AdminForm } from "../../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { updateMarqueeItem } from "../../actions"

export default async function EditMarqueeItemPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const item = await prisma.stackMarqueeItem.findUnique({ where: { id: parseInt(id) } })
  if (!item) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Marquee Item" backHref="/admin/dashboard/stack" />
      <AdminForm action={updateMarqueeItem.bind(null, item.id)} cancelHref="/admin/dashboard/stack">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={item.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Name</label>
          <input name="name" type="text" defaultValue={item.name} style={fieldStyle} required />
        </div>
      </AdminForm>
    </div>
  )
}
