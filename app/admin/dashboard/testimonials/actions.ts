"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

type State = { error: string } | null

export async function createTestimonial(
  state: State,
  fd: FormData
): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const quote = (fd.get("quote") as string).trim()
  const who = (fd.get("who") as string).trim()
  const co = (fd.get("co") as string).trim()
  const initials = (fd.get("initials") as string).trim()
  if (!quote || !who || !co || !initials)
    return { error: "All fields are required." }
  await prisma.testimonial.create({ data: { order, quote, who, co, initials } })
  revalidateTag("testimonials", "max")
  redirect("/admin/dashboard/testimonials")
}

export async function updateTestimonial(
  id: number,
  state: State,
  fd: FormData
): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const quote = (fd.get("quote") as string).trim()
  const who = (fd.get("who") as string).trim()
  const co = (fd.get("co") as string).trim()
  const initials = (fd.get("initials") as string).trim()
  if (!quote || !who || !co || !initials)
    return { error: "All fields are required." }
  await prisma.testimonial.update({
    where: { id },
    data: { order, quote, who, co, initials },
  })
  revalidateTag("testimonials", "max")
  redirect("/admin/dashboard/testimonials")
}

export async function deleteTestimonial(id: number): Promise<void> {
  await prisma.testimonial.delete({ where: { id } })
  revalidateTag("testimonials", "max")
}
