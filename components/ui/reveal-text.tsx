"use client"

import { useEffect, useState } from "react"

type RevealTextProps = {
  as?: "span" | "div" | "h1" | "h2" | "p"
  text: string
  stagger?: number
  start?: number
  className?: string
}

export function RevealText({ as: Tag = "span", text, stagger = 30, start = 0, className }: RevealTextProps) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShown(true), start)
    return () => clearTimeout(t)
  }, [start])

  const words = text.split(/(\s+)/)

  return (
    <Tag className={className}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>
        return (
          <span
            key={i}
            className={"reveal-word" + (shown ? " in" : "")}
            style={{ transitionDelay: `${i * stagger}ms` }}
          >
            {w}
          </span>
        )
      })}
    </Tag>
  )
}
