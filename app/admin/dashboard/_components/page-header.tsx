import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  backHref: string
  addHref?: string
  addLabel?: string
}

export function PageHeader({ title, backHref, addHref, addLabel }: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
        paddingBottom: 20,
        borderBottom: "1px solid var(--cobalt-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link
          href={backHref}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid var(--cobalt-border)",
            color: "var(--fg2)",
            textDecoration: "none",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          ←
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 400,
            margin: 0,
            color: "var(--fg1)",
          }}
        >
          {title}
        </h1>
      </div>
      {addHref && (
        <Button asChild size="sm">
          <Link href={addHref}>{addLabel ?? "Add new"}</Link>
        </Button>
      )}
    </div>
  )
}
