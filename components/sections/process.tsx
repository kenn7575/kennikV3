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
          description="This is how we will work together. It’s a simple, process that keeps things moving forward while leaving room for iteration and feedback."
          row
        />

        <div style={{ borderTop: "1px solid var(--cobalt-border)" }}>
          {steps.map((step) => (
            <div
              key={step.index}
              className="group relative transition-colors hover:bg-white/[0.012]"
              style={{
                padding: "36px 8px 32px",
                borderBottom: "1px solid var(--cobalt-border-lo)",
              }}
            >
              {/* Accent line on hover */}
              <div
                className="absolute top-0 left-0 h-full w-px opacity-0 transition-opacity duration-240 group-hover:opacity-50"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, var(--cobalt-500), transparent)",
                }}
              />

              {/* Step label — always full width on mobile */}
              <span
                className="mb-3 block lg:hidden"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  color: "var(--cobalt-300)",
                }}
              >
                STEP {step.index}
              </span>

              {/* On lg+: 3-col row. On mobile: title + body stacked */}
              <div
                className="grid gap-4 lg:gap-8"
                style={{
                  gridTemplateColumns: "1fr",
                  alignItems: "baseline",
                }}
              >
                <div
                  className="hidden lg:grid lg:gap-8"
                  style={{
                    gridTemplateColumns: "120px 1fr 2fr",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      letterSpacing: "0.18em",
                      color: "var(--cobalt-300)",
                    }}
                  >
                    STEP {step.index}
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

                {/* Mobile layout */}
                <div className="lg:hidden">
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.8rem, 7vw, 2.4rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.025em",
                      color: "var(--fg1)",
                      fontWeight: 400,
                      margin: "0 0 10px",
                    }}
                  >
                    {step.t}{" "}
                    <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                      — {step.italic}
                    </em>
                  </h3>

                  <p
                    style={{
                      fontSize: 15.5,
                      lineHeight: 1.6,
                      color: "var(--fg2)",
                      margin: 0,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
