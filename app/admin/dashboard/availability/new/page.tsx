import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { createSlot } from "../actions"

export default async function NewSlotPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="New Availability Slot" backHref="/admin/dashboard/availability" />
      <AdminForm action={createSlot} cancelHref="/admin/dashboard/availability">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Label</label>
          <input name="label" type="text" placeholder="e.g. Slot 1" style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Start Date</label>
          <input name="startDate" type="text" placeholder="e.g. Q3 2026" style={fieldStyle} required />
          <span style={hintStyle}>Human-readable period start (e.g. "Q3 2026" or "Aug 2026")</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>End Date</label>
          <input name="endDate" type="text" placeholder="e.g. Q1 2027" style={fieldStyle} required />
          <span style={hintStyle}>Human-readable period end</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Status</label>
          <select name="open" style={fieldStyle} defaultValue="true">
            <option value="true">Open</option>
            <option value="false">Taken</option>
          </select>
        </div>
      </AdminForm>
    </div>
  )
}
