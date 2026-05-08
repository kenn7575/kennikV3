"use server"

export type Service = {
  id: string
  title: string
  italic: string
  desc: string
  deliverables: string[]
  icon: "spark" | "shield" | "gauge" | "ai"
  duration: string
}

const SERVICES: Service[] = [
  {
    id: "problem",
    title: "Problem solving",
    italic: "with code.",
    desc: "You have a problem, and you also don't have a solution. We work together to find a solution, and I build it. From idea to production, with a focus on maintainability and performance.",
    deliverables: [
      "Architecture + schema",
      "Production app",
      "CI/CD + observability",
      "Handover docs",
    ],
    icon: "spark",
    duration: "6–12 weeks",
  },
  {
    id: "idea",
    title: "From idea",
    italic: "to reality.",
    desc: "You have something in mind, and you want it built. That could be a new feature, a new service, or a whole new product. I take your idea, shape it into a plan, and build it in a way that makes it easy to maintain and iterate on.",
    deliverables: [
      "Audit + diagnosis",
      "Plan with deadlines",
      "Hands-on fixes",
      "Knowledge transfer",
    ],
    icon: "shield",
    duration: "1–4 weeks",
  },
  {
    id: "extension",
    title: "Extension",
    italic: "of something that already exists.",
    desc: "You have something that works, but it needs to be faster, more reliable, do more, or just better in some way. I dive into the codebase or system, and forfill your requests.",
    deliverables: [
      "Profiling report",
      "Concrete refactors",
      "Before/after numbers",
      "Long-term budget",
    ],
    icon: "gauge",
    duration: "2–6 weeks",
  },
  {
    id: "ai",
    title: "AI integration",
    italic: "without the demo-ware.",
    desc: "RAG, agents, LLM features that work past the first call. Cost-aware, eval-driven, with off-ramps when the model breaks.",
    deliverables: [
      "Eval harness",
      "Production pipeline",
      "Cost dashboards",
      "Fallback paths",
    ],
    icon: "ai",
    duration: "4–10 weeks",
  },
]

export async function getServices(): Promise<Service[]> {
  return SERVICES
}
