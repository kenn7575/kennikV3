"use client"

import { useEffect, useRef, useState } from "react"

const prefersReduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

export function useScramble(value: string, duration = 900) {
  const [out, setOut] = useState(value)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current || prefersReduce()) { setOut(value); return }
    const target = String(value)
    const chars = "0123456789".split("")
    let frame = 0
    const total = Math.max(8, Math.floor(duration / 60))
    let raf = 0

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      const tick = () => {
        frame += 1
        const progress = frame / total
        const scrambled = target.split("").map((ch, i) => {
          if (!/\d/.test(ch)) return ch
          if (i / target.length < progress) return ch
          return chars[Math.floor(Math.random() * chars.length)]
        }).join("")
        setOut(scrambled)
        if (frame < total) raf = requestAnimationFrame(tick)
        else setOut(target)
      }
      raf = requestAnimationFrame(tick)
    })

    obs.observe(ref.current)
    return () => { obs.disconnect(); cancelAnimationFrame(raf) }
  }, [value, duration])

  return { out, ref }
}
