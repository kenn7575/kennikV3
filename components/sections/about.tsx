import { SectionHead } from "@/components/ui/section-head"

export function About() {
  return (
    <section id="about" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="ABOUT — A LITTLE ABOUT ME"
          title={
            <>
              14 years, mostly <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>shipping.</em>
            </>
          }
        />

        <div className="grid gap-16 items-start" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Photo placeholder */}
          <div
            className="flex items-center justify-center"
            style={{
              aspectRatio: "4/5",
              borderRadius: "28px 28px 28px 28px / 32px 32px 32px 32px",
              border: "1px solid var(--cobalt-border)",
              overflow: "hidden",
              background: `
                radial-gradient(at 30% 20%, rgba(2,59,230,0.4), transparent 60%),
                linear-gradient(135deg, var(--ink-800), var(--ink-900))
              `,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                color: "var(--fg3)",
                textTransform: "uppercase",
                border: "1px dashed var(--cobalt-border-hi)",
                padding: "14px 22px",
                borderRadius: 999,
              }}
            >
              PORTRAIT — DROP IMAGE
            </span>
          </div>

          {/* Prose */}
          <div className="flex flex-col gap-4">
            <p style={{ fontSize: 21, lineHeight: 1.45, color: "var(--fg1)", margin: 0 }}>
              I started as a backend dev at a small Copenhagen agency in 2012 and
              learned, the hard way, that{" "}
              <em
                style={{
                  fontStyle: "italic",
                  fontFamily: "var(--font-display)",
                  color: "var(--cobalt-300)",
                  fontSize: "1.05em",
                }}
              >
                the database is the product.
              </em>
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--fg2)", margin: 0 }}>
              Since then I&apos;ve shipped — solo or as a tiny team — analytics
              dashboards, AI tooling, design systems, internal CRMs, and one
              very fast logistics app. I split my year between long client
              engagements (8 — 12 weeks) and short rescues (2 — 3 weeks).
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--fg2)", margin: 0 }}>
              I&apos;m best at the part where the codebase is in trouble: a slow
              query you can&apos;t catch, a feature that took 4 months and still
              doesn&apos;t work, a build pipeline nobody understands. If that&apos;s
              the part you&apos;d like to make somebody else&apos;s problem — drop a
              line.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--fg2)", margin: 0 }}>
              Outside work: bouldering, two cats, a long-suffering espresso
              machine.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
