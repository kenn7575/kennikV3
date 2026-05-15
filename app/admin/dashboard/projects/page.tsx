import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteProject } from "./actions"

const statusColors: Record<string, string> = {
  LIVE: "#4ade80",
  RESCUED: "#facc15",
  STEALTH: "#94a3b8",
}

export default async function ProjectsPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="Projects"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/projects/new"
        addLabel="Add project"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Slug</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Year</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj) => (
            <tr key={proj.slug}>
              <td style={{ ...tdStyle, width: 60 }}>{proj.order}</td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 12 }}>{proj.slug}</td>
              <td style={tdStyle}>{proj.name}</td>
              <td style={{ ...tdStyle, width: 80 }}>{proj.year}</td>
              <td style={{ ...tdStyle, width: 100 }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: statusColors[proj.status] ?? "var(--fg3)",
                }}>
                  {proj.status}
                </span>
              </td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/projects/${proj.slug}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteProject.bind(null, proj.slug)} />
                </div>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan={6} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No projects yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
