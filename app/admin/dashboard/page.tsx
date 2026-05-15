import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { LogoutButton } from "./_components/logout-button"

const sections = [
  { label: "FAQs", id: "faqs", description: "Frequently asked questions" },
  { label: "Packages", id: "packages", description: "Pricing packages" },
  { label: "Testimonials", id: "testimonials", description: "Client testimonials" },
  { label: "Services", id: "services", description: "Service offerings" },
  { label: "Projects", id: "projects", description: "Portfolio projects" },
  { label: "Process", id: "process", description: "5-step work process" },
  { label: "Stack", id: "stack", description: "Tech stack groups & marquee" },
  { label: "Values", id: "values", description: "Why-choose-me reasons" },
  { label: "Problems", id: "problems", description: "Problem/solution pairs" },
  { label: "Stats", id: "stats", description: "Project statistics" },
]

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 48,
          paddingBottom: 24,
          borderBottom: "1px solid var(--cobalt-border)",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--cobalt-400, var(--cobalt-500))",
              marginBottom: 4,
            }}
          >
            Kennik.dk Admin
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 400,
              margin: 0,
            }}
          >
            Welcome, {session.user.name}
          </h1>
        </div>
        <LogoutButton />
      </header>

      <section>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--fg3)",
            marginBottom: 20,
          }}
        >
          Content sections
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {sections.map((s) => (
            <div
              key={s.id}
              style={{
                padding: "20px 24px",
                borderRadius: 16,
                border: "1px solid var(--cobalt-border)",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--fg1)",
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  color: "var(--fg3)",
                }}
              >
                {s.description}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
