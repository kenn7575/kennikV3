import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../../_components/page-header"
import { AdminForm } from "../../_components/admin-form"
import { labelStyle, fieldStyle, formRowStyle, hintStyle } from "@/app/admin/_styles"
import { updateSlot } from "../actions"

export default async function EditSlotPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const slot = await prisma.availabilitySlot.findUnique({ where: { id: parseInt(id) } })
  if (!slot) notFound()

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Edit Availability Slot" backHref="/admin/dashboard/availability" />
      <AdminForm action={updateSlot.bind(null, slot.id)} cancelHref="/admin/dashboard/availability">
        <div style={formRowStyle}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={slot.order} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Label</label>
          <input name="label" type="text" defaultValue={slot.label} style={fieldStyle} required />
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Start Date</label>
          <input name="startDate" type="text" defaultValue={slot.startDate} style={fieldStyle} required />
          <span style={hintStyle}>Human-readable period start (e.g. "Q3 2026" or "Aug 2026")</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>End Date</label>
          <input name="endDate" type="text" defaultValue={slot.endDate} style={fieldStyle} required />
          <span style={hintStyle}>Human-readable period end</span>
        </div>
        <div style={formRowStyle}>
          <label style={labelStyle}>Status</label>
          <select name="open" style={fieldStyle} defaultValue={slot.open ? "true" : "false"}>
            <option value="true">Open</option>
            <option value="false">Taken</option>
          </select>
        </div>
      </AdminForm>
    </div>
  )
}
