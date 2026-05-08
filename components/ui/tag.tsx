import { cn } from "@/lib/utils"

type TagProps = {
  children: React.ReactNode
  dot?: boolean
  strong?: boolean
  className?: string
}

export function Tag({ children, dot = false, strong = false, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em]",
        "border rounded-full px-2.5 py-1",
        strong
          ? "text-[--fg1] border-[--cobalt-border-hi]"
          : "text-[--fg3] border-[--cobalt-border]",
        className
      )}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-[--success]"
          style={{ boxShadow: "0 0 8px var(--success)", animation: "pulse 2.4s var(--ease-out) infinite" }}
        />
      )}
      {children}
    </span>
  )
}
