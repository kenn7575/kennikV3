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
      <svg width="28" height="28" viewBox="0 0 64 64" fill="none" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#08090F" />
        <g stroke="#F4F5F8" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M22 18 L12 32 L22 46" />
          <path d="M42 18 L52 32 L42 46" />
        </g>
        <circle cx="32" cy="32" r="5" fill="#023BE6" />
      </svg>
      <span>
        Kennik
        <span style={{ color: "var(--cobalt-500)" }}>.dk</span>
      </span>
    </a>
  )
}
