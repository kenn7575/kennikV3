import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteProblem } from "./actions"

export default async function ProblemsPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const problems = await prisma.problem.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="Problems"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/problems/new"
        addLabel="Add problem"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Problem</th>
            <th style={thStyle}>Solution</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {problems.map((prob) => (
            <tr key={prob.id}>
              <td style={{ ...tdStyle, width: 60 }}>{prob.order}</td>
              <td style={{ ...tdStyle, maxWidth: 260 }}>
                {prob.p.length > 60 ? prob.p.slice(0, 60) + "…" : prob.p}
              </td>
              <td style={{ ...tdStyle, maxWidth: 260, color: "var(--fg2)" }}>
                {prob.s.length > 60 ? prob.s.slice(0, 60) + "…" : prob.s}
              </td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/problems/${prob.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteProblem.bind(null, prob.id)} />
                </div>
              </td>
            </tr>
          ))}
          {problems.length === 0 && (
            <tr>
              <td colSpan={4} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No problems yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
