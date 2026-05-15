"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

type State = { error: string } | null

export async function createProblem(
  state: State,
  fd: FormData
): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const p = (fd.get("p") as string).trim()
  const s = (fd.get("s") as string).trim()
  if (!p || !s) return { error: "Problem and solution are required." }
  await prisma.problem.create({ data: { order, p, s } })
  revalidateTag("problems", "max")
  redirect("/admin/dashboard/problems")
}

export async function updateProblem(
  id: number,
  state: State,
  fd: FormData
): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const p = (fd.get("p") as string).trim()
  const s = (fd.get("s") as string).trim()
  if (!p || !s) return { error: "Problem and solution are required." }
  await prisma.problem.update({ where: { id }, data: { order, p, s } })
  revalidateTag("problems", "max")
  redirect("/admin/dashboard/problems")
}

export async function deleteProblem(id: number): Promise<void> {
  await prisma.problem.delete({ where: { id } })
  revalidateTag("problems", "max")
}
