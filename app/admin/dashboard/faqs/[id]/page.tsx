import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { updateFaq } from "../actions"

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const faq = await prisma.faq.findUnique({ where: { id: parseInt(id) } })
  if (!faq) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit FAQ" backHref="/admin/dashboard/faqs" />
      <AdminForm action={updateFaq.bind(null, faq.id)} cancelHref="/admin/dashboard/faqs">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={faq.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Question</label>
          <textarea name="q" rows={3} defaultValue={faq.q} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Answer</label>
          <textarea name="a" rows={5} defaultValue={faq.a} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
      </AdminForm>
    </div>
  )
}
