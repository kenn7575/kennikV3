import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <a
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight text-[--fg1] no-underline",
        className
      )}
    >
      <img src="/logo.svg" className="h-9" alt="" />
      <span>
        Kennik
        <span style={{ color: "var(--fg2)" }}>.dk</span>
      </span>
    </a>
  )
}
