import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "../_components/page-header"
import { DeleteButton } from "../_components/delete-button"
import { tableStyle, thStyle, tdStyle } from "@/app/admin/_styles"
import { deleteTestimonial } from "./actions"

export default async function TestimonialsPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } })

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <PageHeader
        title="Testimonials"
        backHref="/admin/dashboard"
        addHref="/admin/dashboard/testimonials/new"
        addLabel="Add testimonial"
      />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Who</th>
            <th style={thStyle}>Company</th>
            <th style={thStyle}>Quote</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <tr key={t.id}>
              <td style={{ ...tdStyle, width: 60 }}>{t.order}</td>
              <td style={{ ...tdStyle, width: 140 }}>{t.who}</td>
              <td style={{ ...tdStyle, width: 140 }}>{t.co}</td>
              <td style={{ ...tdStyle, color: "var(--fg2)" }}>
                {t.quote.length > 80 ? t.quote.slice(0, 80) + "…" : t.quote}
              </td>
              <td style={{ ...tdStyle, width: 100 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/dashboard/testimonials/${t.id}`}
                    style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--cobalt-400, var(--cobalt-500))", textDecoration: "none" }}
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteTestimonial.bind(null, t.id)} />
                </div>
              </td>
            </tr>
          ))}
          {testimonials.length === 0 && (
            <tr>
              <td colSpan={5} style={{ ...tdStyle, color: "var(--fg3)", textAlign: "center" }}>No testimonials yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
