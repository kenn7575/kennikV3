"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export type Testimonial = {
  quote: string
  who: string
  co: string
  initials: string
}

export const getTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } })
    return rows.map((row) => ({ quote: row.quote, who: row.who, co: row.co, initials: row.initials }))
  },
  ["testimonials"],
  { revalidate: 3600, tags: ["testimonials"] },
)
