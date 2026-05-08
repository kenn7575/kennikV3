"use client"

import { useScramble } from "@/hooks/use-scramble"

type ScrambleProps = {
  value: string
  duration?: number
  className?: string
}

export function Scramble({ value, duration, className }: ScrambleProps) {
  const { out, ref } = useScramble(value, duration)
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {out}
    </span>
  )
}
