"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export type StackGroup = {
  group: string
  items: string[]
}

export const getStack = unstable_cache(
  async (): Promise<StackGroup[]> => {
    const rows = await prisma.stackGroup.findMany({ orderBy: { order: "asc" } })
    return rows.map((row) => ({ group: row.group, items: row.items }))
  },
  ["stack"],
  { revalidate: 3600, tags: ["stack"] },
)

export const getStackMarquee = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.stackMarqueeItem.findMany({ orderBy: { order: "asc" } })
    return rows.map((row) => row.name)
  },
  ["stack-marquee"],
  { revalidate: 3600, tags: ["stack"] },
)
