import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle } from "@/app/admin/_styles"
import { createProcessStep } from "../actions"

export default async function NewProcessStepPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Process Step" backHref="/admin/dashboard/process" />
      <AdminForm action={createProcessStep} cancelHref="/admin/dashboard/process">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Step label (n)</label>
          <input name="n" type="text" style={fieldStyle} placeholder="e.g. 01" required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Title</label>
          <input name="t" type="text" style={fieldStyle} placeholder="e.g. Brief" required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Italic subtitle</label>
          <input name="italic" type="text" style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Body</label>
          <textarea name="body" rows={5} style={{ ...fieldStyle, resize: "vertical" }} required />
        </div>
      </AdminForm>
    </div>
  )
}
