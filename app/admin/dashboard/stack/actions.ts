"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

type State = { error: string } | null

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

// Stack Groups

export async function createStackGroup(
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const group = (fd.get("group") as string).trim()
  const items = parseList(fd.get("items") as string)
  if (!group || items.length === 0)
    return { error: "Group name and at least one item are required." }
  await prisma.stackGroup.create({ data: { order, group, items } })
  revalidateTag("stack", "max")
  redirect("/admin/dashboard/stack")
}

export async function updateStackGroup(
  id: number,
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const group = (fd.get("group") as string).trim()
  const items = parseList(fd.get("items") as string)
  if (!group || items.length === 0)
    return { error: "Group name and at least one item are required." }
  await prisma.stackGroup.update({
    where: { id },
    data: { order, group, items },
  })
  revalidateTag("stack", "max")
  redirect("/admin/dashboard/stack")
}

export async function deleteStackGroup(id: number): Promise<void> {
  await requireAuth()
  await prisma.stackGroup.delete({ where: { id } })
  revalidateTag("stack", "max")
}

// Marquee Items

export async function createMarqueeItem(
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const name = (fd.get("name") as string).trim()
  if (!name) return { error: "Name is required." }
  await prisma.stackMarqueeItem.create({ data: { order, name } })
  revalidateTag("stack", "max")
  redirect("/admin/dashboard/stack")
}

export async function updateMarqueeItem(
  id: number,
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const name = (fd.get("name") as string).trim()
  if (!name) return { error: "Name is required." }
  await prisma.stackMarqueeItem.update({ where: { id }, data: { order, name } })
  revalidateTag("stack", "max")
  redirect("/admin/dashboard/stack")
}

export async function deleteMarqueeItem(id: number): Promise<void> {
  await requireAuth()
  await prisma.stackMarqueeItem.delete({ where: { id } })
  revalidateTag("stack", "max")
}
