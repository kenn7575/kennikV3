"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

type State = { error: string } | null

export async function createSlot(state: State, fd: FormData): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const label = (fd.get("label") as string).trim()
  const startDate = (fd.get("startDate") as string).trim()
  const endDate = (fd.get("endDate") as string).trim()
  const open = fd.get("open") === "true"
  if (!label || !startDate || !endDate) return { error: "Label, start date, and end date are required." }
  await prisma.availabilitySlot.create({ data: { order, label, startDate, endDate, open } })
  revalidateTag("availability", "max")
  redirect("/admin/dashboard/availability")
}

export async function updateSlot(
  id: number,
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const label = (fd.get("label") as string).trim()
  const startDate = (fd.get("startDate") as string).trim()
  const endDate = (fd.get("endDate") as string).trim()
  const open = fd.get("open") === "true"
  if (!label || !startDate || !endDate) return { error: "Label, start date, and end date are required." }
  await prisma.availabilitySlot.update({ where: { id }, data: { order, label, startDate, endDate, open } })
  revalidateTag("availability", "max")
  redirect("/admin/dashboard/availability")
}

export async function deleteSlot(id: number): Promise<void> {
  await requireAuth()
  await prisma.availabilitySlot.delete({ where: { id } })
  revalidateTag("availability", "max")
}
