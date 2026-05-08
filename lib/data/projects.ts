"use server"

export type Project = {
  slug: string
  name: string
  italic: string
  desc: string
  cover: string
  monogram: string
  year: string
  duration: string
  status: "LIVE" | "RESCUED" | "STEALTH"
  stack: string[]
}

const PROJECTS: Project[] = [
  {
    slug: "halftrack",
    name: "Halftrack",
    italic: "edge-fast analytics.",
    desc: "Replaced a 1.4s dashboard with an 11ms one. Built the ingest + query layer, kept the React client.",
    cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
    monogram: "Ht",
    year: "2026",
    duration: "10 weeks",
    status: "LIVE",
    stack: ["Rust", "ClickHouse", "Next.js", "Fly.io"],
  },
  {
    slug: "mailroom",
    name: "Mailroom",
    italic: "an inbox for support teams.",
    desc: "From a Notion brief to a billed product in 6 weeks. Solo. Now used by 380+ small teams.",
    cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
    monogram: "Mr",
    year: "2025",
    duration: "6 weeks",
    status: "LIVE",
    stack: ["Next.js", "Postgres", "Clerk", "Resend"],
  },
  {
    slug: "atlas",
    name: "Atlas",
    italic: "an AI brief-writer.",
    desc: "RAG over a B2B sales corpus. Eval harness from day 1. Costs $0.04/brief at the median.",
    cover: "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
    monogram: "At",
    year: "2025",
    duration: "8 weeks",
    status: "LIVE",
    stack: ["Python", "pgvector", "Anthropic", "Modal"],
  },
  {
    slug: "courier",
    name: "Courier",
    italic: "a logistics rescue.",
    desc: "Inherited a Rails monolith with a 22-minute build and a missing tracking feature. Shipped in 3 weeks.",
    cover: "linear-gradient(135deg, #0030C2 0%, #050609 60%, #5DE2FF 100%)",
    monogram: "Cr",
    year: "2024",
    duration: "3 weeks",
    status: "RESCUED",
    stack: ["Rails", "Postgres", "Sidekiq", "Hotwire"],
  },
]

export async function getProjects(): Promise<Project[]> {
  return PROJECTS
}
