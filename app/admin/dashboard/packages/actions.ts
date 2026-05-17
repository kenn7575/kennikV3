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

export async function createPackage(
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const id = (fd.get("id") as string).trim()
  const order = parseInt(fd.get("order") as string)
  const name = (fd.get("name") as string).trim()
  const italic = (fd.get("italic") as string).trim()
  const price = (fd.get("price") as string).trim()
  const duration = (fd.get("duration") as string).trim()
  const blurb = (fd.get("blurb") as string).trim()
  const includes = parseList(fd.get("includes") as string)
  const cta = (fd.get("cta") as string).trim()
  const featured = fd.get("featured") === "on"
  if (!id || !name || !price)
    return { error: "ID, name, and price are required." }
  try {
    await prisma.package.create({
      data: {
        id,
        order,
        name,
        italic,
        price,
        duration,
        blurb,
        includes,
        cta,
        featured,
      },
    })
  } catch {
    return { error: "A package with that ID already exists." }
  }
  revalidateTag("packages", "max")
  redirect("/admin/dashboard/packages")
}

export async function updatePackage(
  id: string,
  state: State,
  fd: FormData
): Promise<State> {
  await requireAuth()
  const order = parseInt(fd.get("order") as string)
  const name = (fd.get("name") as string).trim()
  const italic = (fd.get("italic") as string).trim()
  const price = (fd.get("price") as string).trim()
  const duration = (fd.get("duration") as string).trim()
  const blurb = (fd.get("blurb") as string).trim()
  const includes = parseList(fd.get("includes") as string)
  const cta = (fd.get("cta") as string).trim()
  const featured = fd.get("featured") === "on"
  if (!name || !price) return { error: "Name and price are required." }
  await prisma.package.update({
    where: { id },
    data: {
      order,
      name,
      italic,
      price,
      duration,
      blurb,
      includes,
      cta,
      featured,
    },
  })
  revalidateTag("packages", "max")
  redirect("/admin/dashboard/packages")
}

export async function deletePackage(id: string): Promise<void> {
  await requireAuth()
  await prisma.package.delete({ where: { id } })
  revalidateTag("packages", "max")
}
