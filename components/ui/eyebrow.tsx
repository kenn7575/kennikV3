import { cn } from "@/lib/utils"

type EyebrowProps = {
  children: React.ReactNode
  className?: string
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-[--fg3]",
        "before:content-[''] before:w-8 before:h-px before:bg-[--fg3]",
        className
      )}
    >
      {children}
    </span>
  )
}
