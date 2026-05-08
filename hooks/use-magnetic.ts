"use client"

import { useEffect, useRef } from "react"

const prefersReduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const isTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: none)").matches

export function useMagnetic(strength = 0.35, radius = 100) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current || prefersReduce() || isTouch()) return
    const el = ref.current
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < radius + Math.max(r.width, r.height) / 2) {
        tx = dx * strength
        ty = dy * strength
      } else {
        tx = 0; ty = 0
      }
    }

    const onLeave = () => { tx = 0; ty = 0 }

    const tick = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength, radius])

  return ref
}
