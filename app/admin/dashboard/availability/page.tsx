import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteSlot } from "./actions"

export default async function AvailabilityPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const slots = await prisma.availabilitySlot.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="Availability Slots"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/availability/new"
        addLabel="Add Slot"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Label</th>
            <th style={thStyle}>Period</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td style={{ ...tdStyle, width: 60 }}>{slot.order}</td>
              <td style={tdStyle}>{slot.label}</td>
              <td style={{ ...tdStyle, color: "var(--fg2)" }}>
                {slot.startDate} — {slot.endDate}
              </td>
              <td style={{ ...tdStyle, width: 80 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: slot.open ? "var(--cobalt-400, var(--cobalt-500))" : "var(--fg3)",
                  }}
                >
                  {slot.open ? "Open" : "Taken"}
                </span>
              </td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/availability/${slot.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteSlot.bind(null, slot.id)} />
                </div>
              </td>
            </tr>
          ))}
          {slots.length === 0 && (
            <tr>
              <td colSpan={5} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No slots yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
