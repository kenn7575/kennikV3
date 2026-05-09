"use server"

export type Service = {
  id: string
  title: string
  italic: string
  desc: string
  deliverables: string[]
  examples: string[]
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
      "Technical architecture & data schema",
      "Deployed production application",
      "CI/CD pipeline + error monitoring",
      "Handover docs & async walkthrough",
    ],
    examples: [
      "A platform where clients can log in and manage their account",
      "A tool that replaces a messy spreadsheet workflow",
      "A dashboard that pulls data from multiple sources",
      "An admin panel built around how your team actually works",
    ],
    icon: "spark",
    duration: "6–16 weeks",
  },
  {
    id: "idea",
    title: "From idea",
    italic: "to reality.",
    desc: "You have something in mind, and you want it built. That could be a new feature, a new service, or a whole new product. I take your idea, shape it into a plan, and build it in a way that makes it easy to maintain and iterate on.",
    deliverables: [
      "Scoped spec with timeline",
      "Working feature in production",
      "Tests covering critical paths",
      "Knowledge transfer session",
    ],
    examples: [
      "Add a payment flow to an existing app",
      "A page where customers can manage their subscription",
      "Connect your app to a CRM or invoicing tool",
      "Send users emails or texts when something happens",
    ],
    icon: "shield",
    duration: "4–16 weeks",
  },
  {
    id: "extension",
    title: "Extension",
    italic: "of something that already exists.",
    desc: "You have something that works, but it needs to be faster, more reliable, do more, or just better in some way. I dive into the codebase or system, and fulfill your requests.",
    deliverables: [
      "Performance profiling report",
      "Targeted refactors with rationale",
      "Before/after benchmarks",
      "Recommended maintenance roadmap",
    ],
    examples: [
      "The app is slow and you don't know why",
      "Users need to search, but there's no search",
      "One bug breaks everything — it needs untangling",
      "The codebase scares new developers away",
    ],
    icon: "gauge",
    duration: "2–6 weeks",
  },
  {
    id: "ai",
    title: "Automation",
    italic: "With AI.",
    desc: "Everywhere there are repetitive tasks, there is an opportunity for automation. I can build custom AI agents/workflows that integrate with your existing tools and workflows, to save you time and money.",
    deliverables: [
      "Evaluation harness with test cases",
      "Production-grade AI pipeline",
      "Token cost & latency dashboard",
      "Human-in-the-loop fallback paths",
    ],
    examples: [
      "Automatically pull data from incoming emails",
      "A chatbot that answers from your own docs",
      "Summarise and categorise documents as they come in",
      "Get images analyzed with custom labels and metadata extracted",
    ],
    icon: "ai",
    duration: "4–10 weeks",
  },
]

export async function getServices(): Promise<Service[]> {
  return SERVICES
}
