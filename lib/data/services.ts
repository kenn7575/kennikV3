"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

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

export const getServices = unstable_cache(
  async (): Promise<Service[]> => {
    const rows = await prisma.service.findMany({ orderBy: { order: "asc" } })
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      italic: row.italic,
      desc: row.desc,
      deliverables: row.deliverables,
      examples: row.examples,
      icon: row.icon as Service["icon"],
      duration: row.duration,
    }))
  },
  ["services"],
  { revalidate: 3600, tags: ["services"] },
)
