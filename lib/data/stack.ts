"use server"

export type StackGroup = {
  group: string
  items: string[]
}

const STACK: StackGroup[] = [
  {
    group: "Languages",
    items: ["TypeScript", "Python", "Dart", "SQL", "C#", "Swift"],
  },
  {
    group: "Frameworks",
    items: ["Next.js", "Svelte", "Flutter", "React Native", "React"],
  },
  {
    group: "Data",
    items: ["Postgres", "MySQL", "Redis", "Firebase", "Supabase", "Neo4j"],
  },
  {
    group: "Infra",
    items: ["Vercel", "AWS", "Azure", "Firebase", "Docker"],
  },
  {
    group: "AI",
    items: ["Anthropic", "OpenAI", "Vercel AI SDK", "Ollama"],
  },
  {
    group: "DX",
    items: ["npm", "Vitest", "CI/CD", "GitHub Actions", "TailwindCSS"],
  },
]

const STACK_MARQUEE = [
  "Postgres",
  "TypeScript",
  "Python",
  "Dart",
  "Next.js",
  "Svelte",
  "Flutter",
  "React Native",
  "React",
  "Postgres",
  "MySQL",
  "Redis",
  "Firebase",
  "Supabase",
  "Neo4j",
  "Vercel",
  "AWS",
  "Azure",
  "Firebase",
  "Docker",
  "Anthropic",
  "OpenAI",
  "Vercel AI SDK",
  "Ollama",
  "npm",
  "Vitest",
  "CI/CD",
  "GitHub Actions",
  "TailwindCSS",
  "Remix",
]

export async function getStack(): Promise<StackGroup[]> {
  return STACK
}

export async function getStackMarquee(): Promise<string[]> {
  return STACK_MARQUEE
}
