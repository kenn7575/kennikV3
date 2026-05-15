import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { updateValue } from "../actions"

export default async function EditValuePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const value = await prisma.valueReason.findUnique({ where: { id: parseInt(id) } })
  if (!value) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Value" backHref="/admin/dashboard/values" />
      <AdminForm action={updateValue.bind(null, value.id)} cancelHref="/admin/dashboard/values">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={value.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Title</label>
          <input name="t" type="text" defaultValue={value.t} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Body</label>
          <textarea name="b" rows={4} defaultValue={value.b} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
      </AdminForm>
    </div>
  )
}
