"use server"

import { prisma } from "@/lib/prisma"

export async function checkNeedsSetup(): Promise<boolean> {
  const count = await prisma.user.count()
  return count === 0
}
