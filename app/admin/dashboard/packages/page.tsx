import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deletePackage } from "./actions"

export default async function PackagesPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const packages = await prisma.package.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="Packages"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/packages/new"
        addLabel="Add package"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Featured</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td style={{ ...tdStyle, width: 60 }}>{pkg.order}</td>
              <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 12 }}>{pkg.id}</td>
              <td style={tdStyle}>{pkg.name}</td>
              <td style={tdStyle}>{pkg.price}</td>
              <td style={{ ...tdStyle, width: 80 }}>
                {pkg.featured && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cobalt-400, var(--cobalt-500))", background: "rgba(2,59,230,0.1)", borderRadius: 4, padding: "2px 6px" }}>
                    Yes
                  </span>
                )}
              </td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/packages/${pkg.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deletePackage.bind(null, pkg.id)} />
                </div>
              </td>
            </tr>
          ))}
          {packages.length === 0 && (
            <tr>
              <td colSpan={6} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No packages yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
