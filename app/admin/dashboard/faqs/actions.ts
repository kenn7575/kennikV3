"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

type State = { error: string } | null

export async function createFaq(state: State, fd: FormData): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const q = (fd.get("q") as string).trim()
  const a = (fd.get("a") as string).trim()
  if (!q || !a) return { error: "Question and answer are required." }
  await prisma.faq.create({ data: { order, q, a } })
  revalidateTag("faqs", "max")
  redirect("/admin/dashboard/faqs")
}

export async function updateFaq(
  id: number,
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const q = (fd.get("q") as string).trim()
  const a = (fd.get("a") as string).trim()
  if (!q || !a) return { error: "Question and answer are required." }
  await prisma.faq.update({ where: { id }, data: { order, q, a } })
  revalidateTag("faqs", "max")
  redirect("/admin/dashboard/faqs")
}

export async function deleteFaq(id: number): Promise<void> {
  await requireAuth()
  await prisma.faq.delete({ where: { id } })
  revalidateTag("faqs", "max")
}
