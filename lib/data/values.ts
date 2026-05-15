"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export type valueReason = {
  t: string
  b: string
}

export const getValueReasons = unstable_cache(
  async (): Promise<valueReason[]> => {
    const rows = await prisma.valueReason.findMany({ orderBy: { order: "asc" } })
    return rows.map((row) => ({ t: row.t, b: row.b }))
  },
  ["values"],
  { revalidate: 3600, tags: ["values"] },
)
