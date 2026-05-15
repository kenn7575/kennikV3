"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export type ProcessStep = {
  n: string
  t: string
  italic: string
  body: string
}

export const getProcess = unstable_cache(
  async (): Promise<ProcessStep[]> => {
    const rows = await prisma.processStep.findMany({ orderBy: { order: "asc" } })
    return rows.map((row) => ({ n: row.n, t: row.t, italic: row.italic, body: row.body }))
  },
  ["process"],
  { revalidate: 3600, tags: ["process"] },
)
