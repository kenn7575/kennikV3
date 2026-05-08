import { Sparkles, Shield, Gauge, Cpu, ArrowRight } from "lucide-react"
import { SectionHead } from "@/components/ui/section-head"
import { getServices, type Service } from "@/lib/data/services"

const ICON_MAP = {
  spark: Sparkles,
  shield: Shield,
  gauge: Gauge,
  ai: Cpu,
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = ICON_MAP[service.icon]
  return (
    <div
      className="relative flex flex-col gap-4 overflow-hidden transition-all duration-[240ms]"
      style={{
        border: "1px solid var(--cobalt-border)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0))",
        borderRadius: "24px 24px 24px 24px / 28px 28px 28px 28px",
        padding: "32px 30px 28px",
      }}
    >
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
          className="inline-flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            border: "1px solid var(--cobalt-border-hi)",
            background: "rgba(2,59,230,0.08)",
            color: "var(--cobalt-300)",
          }}
        >
          <Icon size={20} />
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
        className="mt-auto flex flex-wrap gap-1.5"
        style={{ borderTop: "1px dashed var(--cobalt-border)", paddingTop: 18 }}
      >
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
          style={{ color: "var(--fg2)" }}
        >
          Discuss <ArrowRight size={14} />
        </span>
      </div>
    </div>
  )
}

export async function Services() {
  const services = await getServices()

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
          description="I keep the menu small on purpose. If your project doesn't fit cleanly into one of these, let's talk anyway — sometimes it's two of them stitched together."
          row
        />
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
