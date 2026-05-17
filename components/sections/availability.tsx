"use client"

import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Slot = {
  id: number
  label: string
  startDate: string
  endDate: string
  open: boolean
}

export function Availability({ slots }: { slots: Slot[] }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" })
  }

  const openSlots = slots.filter((s) => s.open)
  const count = openSlots.length

  const periodLabel = openSlots.length > 0
    ? openSlots.map((s) => `${s.startDate} — ${s.endDate}`).join(", ")
    : null

  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: "clamp(40px, 6vw, 64px) 0",
        borderTop: "1px solid var(--cobalt-border)",
        borderBottom: "1px solid var(--cobalt-border)",
      }}
    >
      {/* Mesh background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(at 18% 50%, rgba(2,59,230,0.22), transparent 50%),
            radial-gradient(at 82% 50%, rgba(178,102,255,0.12), transparent 55%)
          `,
        }}
      />

      <div className="shell relative z-1">
        <div className="flex justify-between items-center gap-8 flex-wrap">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--fg1)",
              margin: 0,
              fontWeight: 400,
            }}
          >
            {count === 0 ? (
              <>
                No open slots right now.{" "}
                <em style={{ fontStyle: "italic", color: "var(--cobalt-300)" }}>
                  Get in touch
                </em>{" "}
                to join the waitlist.
              </>
            ) : (
              <>
                {count === 1 ? "One slot open" : `${count} slots open`}{" "}
                {periodLabel && (
                  <em style={{ fontStyle: "italic", color: "var(--cobalt-300)" }}>
                    {periodLabel}.
                  </em>
                )}{" "}
                One of them has your name on it.
              </>
            )}
          </p>

          <div className="flex items-center gap-5 flex-wrap">
            <div
              className="flex gap-7 flex-wrap"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--fg3)",
              }}
            >
              <span>
                <span style={{ color: "var(--fg1)", marginRight: 8 }}>8–12 wks</span>
                ENGAGEMENT
              </span>
              <span>
                <span style={{ color: "var(--fg1)", marginRight: 8 }}>&lt; 24h</span>
                REPLY
              </span>
              <span>
                <span style={{ color: "var(--fg1)" }}>EU + REMOTE</span>
              </span>
            </div>
            <Button
              onClick={() => scrollTo("contact")}
              className="rounded-full gap-2 bg-[--cobalt-500] hover:bg-[--cobalt-400] text-white border-0"
              style={{ padding: "13px 24px", fontSize: 14, boxShadow: "var(--glow-cobalt-soft)" }}
            >
              {count === 0 ? "Join waitlist" : "Claim a slot"}
              <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
