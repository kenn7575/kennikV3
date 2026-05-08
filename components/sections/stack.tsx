import { SectionHead } from "@/components/ui/section-head"
import { Marquee } from "@/components/ui/marquee"
import { getStack, getStackMarquee } from "@/lib/data/stack"

export async function Stack() {
  const [groups, marqueeItems] = await Promise.all([getStack(), getStackMarquee()])

  return (
    <section id="stack" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="TECH STACK — TOOLS I REACH FOR"
          title={
            <>
              I pick boring tech,{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>and use it well.</em>
            </>
          }
          description="The stack I lean on. None of it's an accident — every one of these has earned its place through a project that would have failed without it."
          row
        />

        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}
        >
          {groups.map((g) => (
            <div
              key={g.group}
              className="transition-colors duration-[240ms] hover:border-[--cobalt-border-hi]"
              style={{
                border: "1px solid var(--cobalt-border)",
                borderRadius: "20px 20px 20px 20px / 24px 24px 24px 24px",
                padding: "24px 22px 20px",
                background: "rgba(255,255,255,0.012)",
              }}
            >
              <div
                className="flex items-center gap-2.5 mb-3.5"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--fg3)",
                }}
              >
                {g.group}
                <span
                  className="flex-1 h-px"
                  style={{ background: "var(--cobalt-border)" }}
                />
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5"
                    style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--fg1)" }}
                  >
                    <span
                      className="flex-shrink-0"
                      style={{
                        width: 5,
                        height: 5,
                        background: "var(--cobalt-500)",
                        borderRadius: 999,
                        boxShadow: "0 0 8px var(--cobalt-500)",
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Marquee items={marqueeItems} />
    </section>
  )
}
