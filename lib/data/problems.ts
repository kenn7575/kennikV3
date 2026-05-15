"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export type Problem = {
  p: string
  s: string
}

export const getProblems = unstable_cache(
  async (): Promise<Problem[]> => {
    const rows = await prisma.problem.findMany({ orderBy: { order: "asc" } })
    return rows.map((row) => ({ p: row.p, s: row.s }))
  },
  ["problems"],
  { revalidate: 3600, tags: ["problems"] },
)
