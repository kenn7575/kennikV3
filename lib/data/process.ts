"use server"

export type ProcessStep = {
  n: string
  t: string
  italic: string
  body: string
}

const PROCESS: ProcessStep[] = [
  {
    n: "01",
    t: "Brief",
    italic: "20-minute call.",
    body: "Tell me what's broken or what's missing. I ask three uncomfortable questions. We decide if it's a fit. No pitch deck.",
  },
  {
    n: "02",
    t: "Scope",
    italic: "fixed in writing.",
    body: "I send a one-page brief: what I'll build, what I won't, what it costs, when it ships. You sign or you don't.",
  },
  {
    n: "03",
    t: "Build",
    italic: "weekly demos.",
    body: "I work in main. You see a deployed preview every Friday. If it's wrong, we know on day 7 — not day 56.",
  },
  {
    n: "04",
    t: "Ship",
    italic: "to production.",
    body: "Final check, observability dialed in, docs written. I'm on Slack for the first launch week. Then you own it.",
  },
  {
    n: "05",
    t: "After",
    italic: "a month of warranty.",
    body: "30 days of bug fixes on me. After that we either book another engagement or I get out of the way.",
  },
]

export async function getProcess(): Promise<ProcessStep[]> {
  return PROCESS
}
