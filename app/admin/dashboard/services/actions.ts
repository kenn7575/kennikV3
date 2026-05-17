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

export async function createService(
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const id = (fd.get("id") as string).trim()
  const order = parseInt(fd.get("order") as string)
  const title = (fd.get("title") as string).trim()
  const italic = (fd.get("italic") as string).trim()
  const desc = (fd.get("desc") as string).trim()
  const deliverables = parseList(fd.get("deliverables") as string)
  const examples = parseList(fd.get("examples") as string)
  const icon = (fd.get("icon") as string).trim()
  const duration = (fd.get("duration") as string).trim()
  if (!id || !title || !desc)
    return { error: "ID, title, and description are required." }
  try {
    await prisma.service.create({
      data: {
        id,
        order,
        title,
        italic,
        desc,
        deliverables,
        examples,
        icon,
        duration,
      },
    })
  } catch {
    return { error: "A service with that ID already exists." }
  }
  revalidateTag("services", "max")
  redirect("/admin/dashboard/services")
}

export async function updateService(
  id: string,
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const title = (fd.get("title") as string).trim()
  const italic = (fd.get("italic") as string).trim()
  const desc = (fd.get("desc") as string).trim()
  const deliverables = parseList(fd.get("deliverables") as string)
  const examples = parseList(fd.get("examples") as string)
  const icon = (fd.get("icon") as string).trim()
  const duration = (fd.get("duration") as string).trim()
  if (!title || !desc) return { error: "Title and description are required." }
  await prisma.service.update({
    where: { id },
    data: {
      order,
      title,
      italic,
      desc,
      deliverables,
      examples,
      icon,
      duration,
    },
  })
  revalidateTag("services", "max")
  redirect("/admin/dashboard/services")
}

export async function deleteService(id: string): Promise<void> {
  await requireAuth()
  await prisma.service.delete({ where: { id } })
  revalidateTag("services", "max")
}
