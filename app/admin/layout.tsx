export const runtime = "nodejs"

export const metadata = { title: "Admin — Kennik.dk" }

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg1)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </div>
  )
}
