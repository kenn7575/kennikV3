import { SectionHead } from "@/components/ui/section-head"
import { Marquee } from "@/components/ui/marquee"
import { getStack, getStackMarquee } from "@/lib/data/stack"

export async function Stack() {
  const [groups, marqueeItems] = await Promise.all([
    getStack(),
    getStackMarquee(),
  ])

  return (
    <section id="stack" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="TECH STACK — TOOLS I REACH FOR"
          title={
            <>
              I pick battle tested tech,{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                that just works.
              </em>
            </>
          }
          description="The stack I lean on. These are the tools I've used time and time again. If your project needs something else, I can learn it — but these are my go-tos."
          row
        />

        <div className="grid gap-4.5 grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div
              key={g.group}
              className="transition-colors duration-240 hover:border-[--cobalt-border-hi]"
              style={{
                border: "1px solid var(--cobalt-border)",
                borderRadius: "20px 20px 20px 20px / 24px 24px 24px 24px",
                padding: "24px 22px 20px",
                background: "rgba(255,255,255,0.012)",
              }}
            >
              <div
                className="mb-3.5 flex items-center gap-2.5"
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
                  className="h-px flex-1"
                  style={{ background: "var(--cobalt-border)" }}
                />
              </div>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 16,
                      color: "var(--fg1)",
                    }}
                  >
                    <span
                      className="shrink-0"
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
