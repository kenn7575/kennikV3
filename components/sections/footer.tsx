export function Footer() {
  const links = [
    { label: "SERVICES", href: "/#services" },
    { label: "PROJECTS", href: "/projects" },
    { label: "PROCESS", href: "/#process" },
    { label: "PRICING", href: "/#pricing" },
    { label: "ABOUT", href: "/#about" },
    { label: "CONTACT", href: "/#contact" },
  ]

  return (
    <footer
      style={{
        borderTop: "1px solid var(--cobalt-border)",
        padding: "clamp(48px, 8vw, 96px) 0 clamp(28px, 4vw, 48px)",
      }}
    >
      <div className="shell">
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(4rem, 14vw, 12rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            marginBottom: 56,
            background:
              "linear-gradient(180deg, var(--fg1) 0%, var(--ink-500) 95%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textWrap: "balance",
          }}
        >
          Kennik
          <span style={{ WebkitTextFillColor: "var(--cobalt-500)" }}>.dk</span>
        </div>

        <div
          className="flex flex-wrap items-baseline justify-between gap-8"
          style={{
            fontSize: 13,
            color: "var(--fg3)",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          <div>© 2026 — built solo, hosted on Vercel</div>
          <div className="flex flex-wrap gap-12">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  color: "var(--fg2)",
                  transition: "color var(--d-fast) var(--ease-out)",
                }}
                className="hover:text-[--fg1]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
