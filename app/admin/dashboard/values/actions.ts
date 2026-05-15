"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

type State = { error: string } | null

export async function createValue(state: State, fd: FormData): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const t = (fd.get("t") as string).trim()
  const b = (fd.get("b") as string).trim()
  if (!t || !b) return { error: "Title and body are required." }
  await prisma.valueReason.create({ data: { order, t, b } })
  revalidateTag("values", "max")
  redirect("/admin/dashboard/values")
}

export async function updateValue(
  id: number,
  state: State,
  fd: FormData
): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const t = (fd.get("t") as string).trim()
  const b = (fd.get("b") as string).trim()
  if (!t || !b) return { error: "Title and body are required." }
  await prisma.valueReason.update({ where: { id }, data: { order, t, b } })
  revalidateTag("values", "max")
  redirect("/admin/dashboard/values")
}

export async function deleteValue(id: number): Promise<void> {
  await prisma.valueReason.delete({ where: { id } })
  revalidateTag("values", "max")
}
