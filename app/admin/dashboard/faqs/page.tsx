import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteFaq } from "./actions"

export default async function FaqsPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="FAQs"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/faqs/new"
        addLabel="Add FAQ"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Question</th>
            <th style={thStyle}>Answer</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq) => (
            <tr key={faq.id}>
              <td style={{ ...tdStyle, width: 60 }}>{faq.order}</td>
              <td style={{ ...tdStyle, maxWidth: 280 }}>
                {faq.q.length > 60 ? faq.q.slice(0, 60) + "…" : faq.q}
              </td>
              <td style={{ ...tdStyle, maxWidth: 280, color: "var(--fg2)" }}>
                {faq.a.length > 80 ? faq.a.slice(0, 80) + "…" : faq.a}
              </td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/faqs/${faq.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteFaq.bind(null, faq.id)} />
                </div>
              </td>
            </tr>
          ))}
          {faqs.length === 0 && (
            <tr>
              <td colSpan={4} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No FAQs yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
