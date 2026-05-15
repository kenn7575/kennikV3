"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

type State = { error: string } | null

export async function createStat(state: State, fd: FormData): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const v = (fd.get("v") as string).trim()
  const label = (fd.get("label") as string).trim()
  if (!v || !label) return { error: "Value and label are required." }
  await prisma.projectStat.create({ data: { order, v, label } })
  revalidateTag("project-stats", "max")
  redirect("/admin/dashboard/stats")
}

export async function updateStat(
  id: number,
  state: State,
  fd: FormData
): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const v = (fd.get("v") as string).trim()
  const label = (fd.get("label") as string).trim()
  if (!v || !label) return { error: "Value and label are required." }
  await prisma.projectStat.update({ where: { id }, data: { order, v, label } })
  revalidateTag("project-stats", "max")
  redirect("/admin/dashboard/stats")
}

export async function deleteStat(id: number): Promise<void> {
  await prisma.projectStat.delete({ where: { id } })
  revalidateTag("project-stats", "max")
}
