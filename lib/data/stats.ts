"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export type ProjectStat = {
  v: string
  label: string
}

export const getProjectStats = unstable_cache(
  async (): Promise<ProjectStat[]> => {
    const rows = await prisma.projectStat.findMany({ orderBy: { order: "asc" } })
    return rows.map((row) => ({ v: row.v, label: row.label }))
  },
  ["project-stats"],
  { revalidate: 3600, tags: ["project-stats"] },
)
