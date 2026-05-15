import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteService } from "./actions"

export default async function ServicesPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const services = await prisma.service.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="Services"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/services/new"
        addLabel="Add service"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Icon</th>
            <th style={thStyle}>Duration</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc) => (
            <tr key={svc.id}>
              <td style={{ ...tdStyle, width: 60 }}>{svc.order}</td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 12 }}>{svc.id}</td>
              <td style={tdStyle}>{svc.title}</td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 12 }}>{svc.icon}</td>
              <td style={tdStyle}>{svc.duration}</td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/services/${svc.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteService.bind(null, svc.id)} />
                </div>
              </td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr>
              <td colSpan={6} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No services yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
