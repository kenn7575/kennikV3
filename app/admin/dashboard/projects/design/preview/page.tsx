import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { ShowcaseIframe } from "./showcase-iframe"

export default async function SectionShowcasePage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 24px" }}>
      <header
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: "1px solid var(--cobalt-border)",
          gap: 24,
          flexWrap: "wrap",
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
            Section showcase
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 400,
              margin: 0,
            }}
          >
            Reference for all 9 project section types
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              color: "var(--fg3)",
              margin: "8px 0 0",
              maxWidth: "60ch",
            }}
          >
            One example of every section kind, labeled with its <code style={{ fontFamily: "var(--font-mono)", color: "var(--cobalt-300)" }}>kind</code> name. Use as a visual cheat-sheet when adding sections in the project designer.
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--fg2)",
            textDecoration: "none",
            padding: "10px 18px",
            border: "1px solid var(--cobalt-border)",
            borderRadius: 9999,
          }}
        >
          ← Dashboard
        </Link>
      </header>

      <ShowcaseIframe />
    </div>
  )
}
