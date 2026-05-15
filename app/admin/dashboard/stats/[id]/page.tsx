import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { updateStat } from "../actions"

export default async function EditStatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const stat = await prisma.projectStat.findUnique({ where: { id: parseInt(id) } })
  if (!stat) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Stat" backHref="/admin/dashboard/stats" />
      <AdminForm action={updateStat.bind(null, stat.id)} cancelHref="/admin/dashboard/stats">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={stat.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Value</label>
          <input name="v" type="text" defaultValue={stat.v} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Label</label>
          <input name="label" type="text" defaultValue={stat.label} style={fieldStyle} required />
        </div>
      </AdminForm>
    </div>
  )
}
