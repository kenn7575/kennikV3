"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { SectionHead } from "@/components/ui/section-head"
import type { FaqItem } from "@/lib/data/faq"

function FAQItem({
  item,
  open,
  onToggle,
}: {
  item: FaqItem
  open: boolean
  onToggle: () => void
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--cobalt-border-lo)",
      }}
    >
      <button
        className="flex justify-between items-center gap-6 w-full text-left transition-colors duration-[240ms] hover:text-[--cobalt-300]"
        style={{
          background: "transparent",
          color: "var(--fg1)",
          border: 0,
          padding: "26px clamp(8px, 2vw, 16px)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          fontWeight: 400,
          cursor: "pointer",
        }}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <span
          className="inline-flex items-center justify-center flex-shrink-0 transition-all duration-[240ms]"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            border: `1px solid ${open ? "var(--cobalt-500)" : "var(--cobalt-border)"}`,
            background: open ? "var(--cobalt-500)" : "transparent",
            color: open ? "white" : "var(--fg2)",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          <Plus size={16} />
        </span>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows var(--d-slow) var(--ease-emph)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              fontSize: 16.5,
              lineHeight: 1.65,
              color: "var(--fg2)",
              maxWidth: "70ch",
              margin: 0,
              padding: "0 clamp(8px, 2vw, 16px) 28px",
              textWrap: "pretty",
            }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

type FAQProps = {
  items: FaqItem[]
}

export function FAQ({ items }: FAQProps) {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section id="faq" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="FAQ — THE COMMON QUESTIONS"
          title={
            <>
              Things <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>people ask first.</em>
            </>
          }
          description="If your question isn't here, email it — I update this list when the same thing comes up three times. Yours might be next."
          row
        />

        <div
          style={{
            borderTop: "1px solid var(--cobalt-border)",
            borderBottom: "1px solid var(--cobalt-border)",
            marginTop: 24,
          }}
        >
          {items.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
