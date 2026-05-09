import { ArrowRight } from "lucide-react"
import { SectionHead } from "@/components/ui/section-head"
import { getProblems } from "@/lib/data/problems"

export async function Problems() {
  const problems = await getProblems()

  return (
    <section id="problems" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="PROBLEMS I SOLVE — A SHORTLIST"
          title={
            <>
              If something here{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>sounds interesting</em>
              , we should talk.
            </>
          }
          description="Most projects start with one of these sentences. None of them need a kickoff workshop — most need a 20-minute call and a repo invitation."
          row
        />

        <div
          style={{
            borderTop: "1px solid var(--cobalt-border)",
            borderBottom: "1px solid var(--cobalt-border)",
            marginTop: 24,
          }}
        >
          {problems.map((row, i) => (
            <div
              key={i}
              className="grid items-center gap-7 hover:bg-[rgba(2,59,230,0.04)] transition-colors duration-[240ms] cursor-default"
              style={{
                gridTemplateColumns: "56px 1fr 24px 1fr",
                padding: "22px clamp(8px, 2vw, 24px)",
                borderTop: i === 0 ? "none" : "1px solid var(--cobalt-border-lo)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--fg3)",
                  letterSpacing: "0.1em",
                }}
              >
                {String(i + 1).padStart(2, "0")} /
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                  color: "var(--fg2)",
                  lineHeight: 1.35,
                }}
              >
                &ldquo;{row.p}&rdquo;
              </span>
              <span className="inline-flex items-center justify-center" style={{ color: "var(--cobalt-300)" }}>
                <ArrowRight size={18} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(1.1rem, 1.8vw, 1.55rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  color: "var(--fg1)",
                }}
              >
                {row.s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
