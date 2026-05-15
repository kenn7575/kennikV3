import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { Button } from "@/components/ui/button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteStackGroup, deleteMarqueeItem } from "./actions"

export default async function StackPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const [groups, marquee] = await Promise.all([
    prisma.stackGroup.findMany({ orderBy: { order: "asc" } }),
    prisma.stackMarqueeItem.findMany({ orderBy: { order: "asc" } }),
  ])

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader title="Stack" backHref="/admin/dashboard" />

      {/* Stack Groups */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg3)", margin: 0 }}>
          Stack Groups
        </p>
        <Button asChild size="sm">
          <Link href="/admin/dashboard/stack/groups/new">Add group</Link>
        </Button>
      </div>
      <table style={{ ...tableStyle, marginBottom: 48 }}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Group</th>
            <th style={thStyle}>Items</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.id}>
              <td style={{ ...tdStyle, width: 60 }}>{g.order}</td>
              <td style={{ ...tdStyle, width: 160 }}>{g.group}</td>
              <td style={{ ...tdStyle, color: "var(--fg2)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                {g.items.join(", ").slice(0, 80)}{g.items.join(", ").length > 80 ? "…" : ""}
              </td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/stack/groups/${g.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteStackGroup.bind(null, g.id)} />
                </div>
              </td>
            </tr>
          ))}
          {groups.length === 0 && (
            <tr><td colSpan={4} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No groups yet.</td></tr>
          )}
        </tbody>
      </table>

      {/* Marquee Items */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg3)", margin: 0 }}>
          Marquee Items
        </p>
        <Button asChild size="sm">
          <Link href="/admin/dashboard/stack/marquee/new">Add item</Link>
        </Button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {marquee.map((m) => (
            <tr key={m.id}>
              <td style={{ ...tdStyle, width: 60 }}>{m.order}</td>
              <td style={tdStyle}>{m.name}</td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/stack/marquee/${m.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteMarqueeItem.bind(null, m.id)} />
                </div>
              </td>
            </tr>
          ))}
          {marquee.length === 0 && (
            <tr><td colSpan={3} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No marquee items yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
