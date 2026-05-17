"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

type State = { error: string } | null

export async function createProcessStep(
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const n = (fd.get("n") as string).trim()
  const t = (fd.get("t") as string).trim()
  const italic = (fd.get("italic") as string).trim()
  const body = (fd.get("body") as string).trim()
  if (!n || !t || !italic || !body) return { error: "All fields are required." }
  await prisma.processStep.create({ data: { order, n, t, italic, body } })
  revalidateTag("process", "max")
  redirect("/admin/dashboard/process")
}

export async function updateProcessStep(
  id: number,
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const n = (fd.get("n") as string).trim()
  const t = (fd.get("t") as string).trim()
  const italic = (fd.get("italic") as string).trim()
  const body = (fd.get("body") as string).trim()
  if (!n || !t || !italic || !body) return { error: "All fields are required." }
  await prisma.processStep.update({
    where: { id },
    data: { order, n, t, italic, body },
  })
  revalidateTag("process", "max")
  redirect("/admin/dashboard/process")
}

export async function deleteProcessStep(id: number): Promise<void> {
  await requireAuth()
  await prisma.processStep.delete({ where: { id } })
  revalidateTag("process", "max")
}
