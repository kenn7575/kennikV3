import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteProcessStep } from "./actions"

export default async function ProcessPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const steps = await prisma.processStep.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="Process"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/process/new"
        addLabel="Add step"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Label</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Italic</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => (
            <tr key={step.id}>
              <td style={{ ...tdStyle, width: 60 }}>{step.order}</td>
              <td style={{ ...tdStyle, width: 80 }}>{step.n}</td>
              <td style={{ ...tdStyle, width: 180 }}>{step.t}</td>
              <td style={{ ...tdStyle, color: "var(--fg2)" }}>{step.italic}</td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/process/${step.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteProcessStep.bind(null, step.id)} />
                </div>
              </td>
            </tr>
          ))}
          {steps.length === 0 && (
            <tr>
              <td colSpan={5} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No steps yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
