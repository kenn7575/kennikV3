"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export type Package = {
  id: string
  name: string
  italic: string
  price: string
  duration: string
  blurb: string
  includes: string[]
  cta: string
  featured: boolean
}

export const getPackages = unstable_cache(
  async (): Promise<Package[]> => prisma.package.findMany({ orderBy: { order: "asc" } }),
  ["packages"],
  { revalidate: 3600, tags: ["packages"] },
)
