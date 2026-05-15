"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export type FaqItem = {
  q: string
  a: string
}

export const getFaqs = unstable_cache(
  async (): Promise<FaqItem[]> => {
    const rows = await prisma.faq.findMany({ orderBy: { order: "asc" } })
    return rows.map((row) => ({ q: row.q, a: row.a }))
  },
  ["faqs"],
  { revalidate: 3600, tags: ["faqs"] },
)
