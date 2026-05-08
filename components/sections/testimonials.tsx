import { SectionHead } from "@/components/ui/section-head"
import { getTestimonials } from "@/lib/data/testimonials"

export async function Testimonials() {
  const testimonials = await getTestimonials()

  return (
    <section id="testimonials" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="TESTIMONIALS — FROM PEOPLE WHO PAID"
          title={
            <>
              Words from <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>past clients.</em>
            </>
          }
          description="Quoted with permission. Happy to put you in touch with any of them — references on request, no canned reels."
          row
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px]">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="relative flex flex-col gap-6 m-0 transition-colors duration-[240ms] hover:border-[--cobalt-border-hi]"
              style={{
                border: "1px solid var(--cobalt-border)",
                borderRadius: "24px 24px 24px 24px / 28px 28px 28px 28px",
                padding: "32px 30px",
                background: "linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0))",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 96,
                  lineHeight: 0.5,
                  color: "var(--cobalt-500)",
                  height: 36,
                  letterSpacing: "-0.05em",
                  display: "block",
                }}
              >
                &ldquo;
              </span>

              <blockquote
                className="m-0"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)",
                  lineHeight: 1.3,
                  letterSpacing: "-0.015em",
                  color: "var(--fg1)",
                  textWrap: "balance",
                }}
              >
                {t.quote}
              </blockquote>

              <figcaption className="flex items-center gap-3.5 mt-auto">
                <span
                  className="inline-flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: "var(--mesh-soft)",
                    border: "1px solid var(--cobalt-border-hi)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--fg1)",
                  }}
                >
                  {t.initials}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span style={{ color: "var(--fg1)", fontSize: 14 }}>{t.who}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      color: "var(--fg3)",
                      textTransform: "uppercase",
                    }}
                  >
                    {t.co}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
