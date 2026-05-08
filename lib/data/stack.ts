"use server"

export type StackGroup = {
  group: string
  items: string[]
}

const STACK: StackGroup[] = [
  { group: "Languages",   items: ["TypeScript", "Rust", "Python", "Go", "SQL"] },
  { group: "Frameworks",  items: ["Next.js", "Remix", "Astro", "Hono", "FastAPI", "Rails"] },
  { group: "Data",        items: ["Postgres", "ClickHouse", "Redis", "pgvector", "DuckDB"] },
  { group: "Infra",       items: ["Fly.io", "Cloudflare", "AWS", "Vercel", "Docker", "Terraform"] },
  { group: "AI",          items: ["Anthropic", "OpenAI", "Modal", "LangGraph", "Eval-harness"] },
  { group: "DX",          items: ["pnpm", "Turborepo", "Vitest", "Playwright", "GH Actions"] },
]

const STACK_MARQUEE = [
  "Postgres", "TypeScript", "Rust", "Next.js", "ClickHouse",
  "Anthropic", "Cloudflare", "Fly.io", "pgvector", "Remix",
]

export async function getStack(): Promise<StackGroup[]> {
  return STACK
}

export async function getStackMarquee(): Promise<string[]> {
  return STACK_MARQUEE
}
