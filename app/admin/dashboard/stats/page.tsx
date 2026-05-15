import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteStat } from "./actions"

export default async function StatsPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const stats = await prisma.projectStat.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="Stats"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/stats/new"
        addLabel="Add stat"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Value</th>
            <th style={thStyle}>Label</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.id}>
              <td style={{ ...tdStyle, width: 60 }}>{stat.order}</td>
              <td style={tdStyle}>{stat.v}</td>
              <td style={tdStyle}>{stat.label}</td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/stats/${stat.id}`}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      color: "var(--cobalt-400, var(--cobalt-500))",
                      textDecoration: "none",
                    }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteStat.bind(null, stat.id)} />
                </div>
              </td>
            </tr>
          ))}
          {stats.length === 0 && (
            <tr>
              <td colSpan={4} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>
                No stats yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
