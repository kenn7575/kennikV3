import { SectionHead } from "@/components/ui/section-head"
import { getWhyReasons } from "@/lib/data/why"

export async function Why() {
  const reasons = await getWhyReasons()

  return (
    <section id="why" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="WHY WORK WITH ME — THE HONEST PITCH"
          title={
            <>
              What you get when{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                you don&apos;t get an agency.
              </em>
            </>
          }
          description="Six things that are unusually true of working with one independent senior — and unusually rare in agency-shaped engagements."
          row
        />

        <div
          className="grid overflow-hidden"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "var(--cobalt-border)",
            border: "1px solid var(--cobalt-border)",
            borderRadius: 24,
          }}
        >
          {reasons.map((w, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 transition-colors duration-[240ms] hover:bg-[--ink-900]"
              style={{
                background: "var(--ink-950)",
                padding: "36px 30px 32px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--cobalt-300)",
                  letterSpacing: "0.16em",
                }}
              >
                REASON / {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 2.2vw, 2rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: "var(--fg1)",
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {w.t}
              </h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--fg2)" }}>
                {w.b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
