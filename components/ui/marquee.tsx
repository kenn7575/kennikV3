import { cn } from "@/lib/utils"

type MarqueeProps = {
  items: string[]
  className?: string
}

export function Marquee({ items, className }: MarqueeProps) {
  const content = (
    <div className="marquee-item">
      {items.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "56px" }}>
          <span style={{ color: "var(--fg1)" }}>{item}</span>
          {i < items.length - 1 && <span className="sep">·</span>}
        </span>
      ))}
      <span className="sep">*</span>
    </div>
  )

  return (
    <div className={cn("marquee", className)}>
      <div className="marquee-track">
        {content}
        <div aria-hidden="true">{content}</div>
      </div>
    </div>
  )
}
