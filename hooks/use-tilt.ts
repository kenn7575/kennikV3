"use client"

import { useEffect, useRef } from "react"

const prefersReduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const isTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: none)").matches

export function useTilt(max = 6) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current || prefersReduce() || isTouch()) return
    const el = ref.current
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const px = (e.clientX - cx) / (r.width / 2)
      const py = (e.clientY - cy) / (r.height / 2)
      tx = -py * max
      ty = px * max
    }

    const onLeave = () => { tx = 0; ty = 0 }

    const tick = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      el.style.transform = `perspective(1200px) rotateX(${x.toFixed(2)}deg) rotateY(${y.toFixed(2)}deg)`
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [max])

  return ref
}
