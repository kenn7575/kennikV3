import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteValue } from "./actions"

export default async function ValuesPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const values = await prisma.valueReason.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="Values"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/values/new"
        addLabel="Add value"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Body</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {values.map((v) => (
            <tr key={v.id}>
              <td style={{ ...tdStyle, width: 60 }}>{v.order}</td>
              <td style={{ ...tdStyle, maxWidth: 200 }}>{v.t}</td>
              <td style={{ ...tdStyle, maxWidth: 340, color: "var(--fg2)" }}>
                {v.b.length > 80 ? v.b.slice(0, 80) + "…" : v.b}
              </td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/values/${v.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteValue.bind(null, v.id)} />
                </div>
              </td>
            </tr>
          ))}
          {values.length === 0 && (
            <tr>
              <td colSpan={4} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No values yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
