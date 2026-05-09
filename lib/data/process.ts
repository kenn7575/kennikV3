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
    t: "Meeting",
    italic: "We talk it out.",
    body: "I ask a lot of questions. We figure out what to build, how to measure success, and what the timeline looks like. I send a proposal within 48 hours.",
  },
  {
    n: "03",
    t: "Initiate project",
    italic: "in writing.",
    body: "I send a scoped proposal with deliverables, timeline, and cost. We sign it. I invoice 50% upfront, 50% on delivery.",
  },
  {
    n: "04",
    t: "Build",
    italic: "Weekly updates.",
    body: "I start working on the project. I send progress reports and visuals every week, and potentially ask for feedback or decisions as I go.",
  },
  {
    n: "05",
    t: "Ship",
    italic: "to production.",
    body: "Final check, delivery and deployment. I make sure everything is working in production, and I provide documentation and a walkthrough to make sure you can maintain it after I'm gone.",
  },
  {
    n: "06",
    t: "After",
    italic: "a month of warranty.",
    body: "30 days of bug fixes on me. Maintenance and support after the warranty period can be arranged for a monthly retainer if needed, but most clients don't.",
  },
]

export async function getProcess(): Promise<ProcessStep[]> {
  return PROCESS
}
