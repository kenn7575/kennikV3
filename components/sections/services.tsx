"use client"

import { useRef, useEffect, useState } from "react"
import { Sparkles, Shield, Gauge, Cpu, ArrowRight } from "lucide-react"
import { SectionHead } from "@/components/ui/section-head"
import { getServices, type Service } from "@/lib/data/services"
import { useTilt } from "@/hooks/use-tilt"

const ICON_MAP = {
  spark: Sparkles,
  shield: Shield,
  gauge: Gauge,
  ai: Cpu,
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = ICON_MAP[service.icon]
  const tiltCallback = useTilt(5)
  const [hovered, setHovered] = useState(false)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = revealRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("svc-in")
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={(node: HTMLDivElement | null) => {
        tiltCallback(node)
        revealRef.current = node
      }}
      className="svc-card relative flex flex-col gap-4 overflow-hidden"
      style={
        {
          border: "1px solid var(--cobalt-border)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0))",
          borderRadius: "24px 24px 24px 24px / 28px 28px 28px 28px",
          padding: "32px 30px 28px",
          "--stagger": `${index * 90}ms`,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* hover border shimmer overlay */}
      <span
        aria-hidden
        className="svc-shimmer pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          opacity: hovered ? 1 : 0,
          transition: "opacity 320ms var(--ease-out)",
        }}
      />

      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "var(--fg3)",
            textTransform: "uppercase",
          }}
        >
          SERVICE / {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className="svc-icon inline-flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            border: "1px solid var(--cobalt-border-hi)",
            background: hovered ? "rgba(2,59,230,0.18)" : "rgba(2,59,230,0.08)",
            color: hovered ? "var(--cobalt-200)" : "var(--cobalt-300)",
            boxShadow: hovered ? "var(--glow-cobalt-soft)" : "none",
            transition:
              "background 280ms var(--ease-out), color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
          }}
        >
          <Icon
            size={20}
            style={{
              transform: hovered ? "scale(1.12)" : "scale(1)",
              transition: "transform 280ms var(--ease-spring)",
            }}
          />
        </span>
      </div>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.6rem, 2.4vw, 2rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          fontWeight: 400,
          color: "var(--fg1)",
          margin: "6px 0 0",
        }}
      >
        {service.title}{" "}
        <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
          — {service.italic}
        </em>
      </h3>

      <p
        style={{
          color: "var(--fg2)",
          fontSize: 15,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {service.desc}
      </p>

      <div
        className="flex flex-col gap-1.5"
        style={{ borderTop: "1px dashed var(--cobalt-border)", paddingTop: 18 }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--fg3)",
            marginBottom: 4,
          }}
        >
          Examples
        </span>
        {service.examples.map((e, ei) => (
          <span
            key={e}
            className="inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--fg2)",
              lineHeight: 1.4,
              opacity: hovered ? 1 : 0.85,
              transform: hovered ? "translateX(0)" : "translateX(-2px)",
              transition: `opacity 200ms var(--ease-out) ${ei * 30}ms, transform 200ms var(--ease-out) ${ei * 30}ms`,
            }}
          >
            <span
              style={{
                width: 3,
                height: 3,
                background: hovered ? "var(--cobalt-300)" : "var(--fg3)",
                borderRadius: 999,
                flexShrink: 0,
                transition: "background 200ms var(--ease-out)",
              }}
            />
            {e}
          </span>
        ))}
      </div>

      <div
        className="mt-auto flex flex-wrap gap-1.5"
        style={{ borderTop: "1px dashed var(--cobalt-border)", paddingTop: 18 }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--fg3)",
            width: "100%",
            marginBottom: 4,
          }}
        >
          Deliverables
        </span>
        {service.deliverables.map((d) => (
          <span
            key={d}
            className="inline-flex items-center gap-1.5"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              color: "var(--fg2)",
              letterSpacing: "0.02em",
            }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                background: "var(--cobalt-500)",
                borderRadius: 999,
                flexShrink: 0,
              }}
            />
            {d}
          </span>
        ))}
      </div>

      <div
        className="flex items-center justify-between"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--fg3)",
        }}
      >
        <span>TYPICAL · {service.duration}</span>
        <span
          className="inline-flex items-center gap-1.5"
          style={{
            color: hovered ? "var(--cobalt-300)" : "var(--fg2)",
            transition: "color 200ms var(--ease-out)",
          }}
        >
          Discuss{" "}
          <ArrowRight
            size={14}
            style={{
              transform: hovered ? "translateX(3px)" : "translateX(0)",
              transition: "transform 240ms var(--ease-spring)",
            }}
          />
        </span>
      </div>
    </div>
  )
}

export function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    getServices().then(setServices)
  }, [])

  return (
    <section id="services" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="SERVICES — HOW I CAN HELP"
          title={
            <>
              You have the ideas{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                I have the skills.
              </em>
            </>
          }
          description="As a datatechnician, I do many things, but mostly they all fall under these categories. If you have a project in mind that doesn’t fit here, let’s talk anyway."
          row
        />
        <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
