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
    name: "Inventory management system",
    italic: "Svendborgsund bryghus",
    desc: "A custom inventory management system for a Danish brewery. Replaced a messy Excel workflow with a tailored web app, improving efficiency and accuracy of inventory management, tax reporting, and overall operations.",
    cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
    monogram: "Ht",
    year: "2026",
    duration: "10 weeks",
    status: "LIVE",
    stack: ["Rust", "ClickHouse", "Next.js", "Fly.io"],
  },
  {
    slug: "mailroom",
    name: "Fashion store website",
    italic: "Hyperfashion.dk",
    desc: "Made a new website for a Danish fashion store. The old one was built on a clunky CMS that didn't let the client manage their content properly. The new one is built on Next.js and has a custom CMS that makes it easy for the client to manage their products, orders, and content. Other than that, it used super efficient caching strategies with revalidation logic to keep costs down while handling traffic spikes during sales.",
    cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
    monogram: "Mr",
    year: "2025",
    duration: "4 weeks",
    status: "LIVE",
    stack: ["Next.js", "Postgres", "Clerk", "Resend"],
  },
  {
    slug: "atlas",
    name: "Admin CMS",
    italic: "with dashboard and analytics.",
    desc: "A custom admin CMS for a school project. It has a dashboard with analytics and a custom CMS for managing content. The project was a part of a custom solution for an entire restaurant ordering system, but the admin CMS was a standalone piece that I built to make it easy for the client to manage their menu items and other content as well as see analytics about their orders and customers.",
    cover: "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
    monogram: "At",
    year: "2025",
    duration: "8 weeks",
    status: "LIVE",
    stack: ["Python", "pgvector", "Anthropic", "Modal"],
  },
  {
    slug: "courier",
    name: "Webshop",
    italic: "demo",
    desc: "I developed a demo webshop to develop my understanding of stripe's API and to have a reference implementation for future projects. It features a custom product page, shopping cart, and checkout flow, all built with Next.js and integrated with Stripe for payments. The project is live, but only in demo mode.",
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
