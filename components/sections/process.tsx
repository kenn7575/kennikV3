import { SectionHead } from "@/components/ui/section-head"
import { getProcess } from "@/lib/data/process"

export async function Process() {
  const steps = await getProcess()

  return (
    <section id="process" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="PROCESS — FROM BRIEF TO SHIP"
          title={
            <>
              How do we{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                do it?
              </em>
            </>
          }
          description="Same shape, every engagement. The fixed scope and weekly demos are non-negotiable — they're how I keep the work honest."
          row
        />

        <div style={{ borderTop: "1px solid var(--cobalt-border)" }}>
          {steps.map((step) => (
            <div
              key={step.n}
              className="group relative grid gap-8 transition-colors hover:bg-white/[0.012]"
              style={{
                gridTemplateColumns: "120px 1fr 2fr",
                padding: "36px 8px 32px",
                borderBottom: "1px solid var(--cobalt-border-lo)",
                alignItems: "baseline",
              }}
            >
              {/* Accent line on hover */}
              <div
                className="absolute top-0 left-0 h-full w-px opacity-0 transition-opacity duration-[240ms] group-hover:opacity-50"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, var(--cobalt-500), transparent)",
                }}
              />

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  color: "var(--cobalt-300)",
                }}
              >
                STEP {step.n}
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                  color: "var(--fg1)",
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {step.t}{" "}
                <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                  — {step.italic}
                </em>
              </h3>

              <p
                style={{
                  fontSize: 16.5,
                  lineHeight: 1.6,
                  color: "var(--fg2)",
                  maxWidth: "56ch",
                  margin: 0,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
