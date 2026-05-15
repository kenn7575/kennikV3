import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { updateProblem } from "../actions"

export default async function EditProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const problem = await prisma.problem.findUnique({ where: { id: parseInt(id) } })
  if (!problem) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Problem" backHref="/admin/dashboard/problems" />
      <AdminForm action={updateProblem.bind(null, problem.id)} cancelHref="/admin/dashboard/problems">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={problem.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Problem</label>
          <textarea name="p" rows={3} defaultValue={problem.p} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Solution</label>
          <textarea name="s" rows={3} defaultValue={problem.s} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
      </AdminForm>
    </div>
  )
}
