"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

type State = { error: string } | null

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseJson(
  raw: string,
  field: string
): { ok: true; value: unknown } | { ok: false; error: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: true, value: undefined }
  try {
    return { ok: true, value: JSON.parse(trimmed) }
  } catch {
    return { ok: false, error: `Invalid JSON in ${field}.` }
  }
}

export async function createProject(
  state: State,
  fd: FormData
): Promise<State> {
  const slug = (fd.get("slug") as string).trim()
  const order = parseInt(fd.get("order") as string)
  const name = (fd.get("name") as string).trim()
  const italic = (fd.get("italic") as string).trim()
  const desc = (fd.get("desc") as string).trim()
  const cover = (fd.get("cover") as string).trim()
  const monogram = (fd.get("monogram") as string).trim()
  const year = (fd.get("year") as string).trim()
  const duration = (fd.get("duration") as string).trim()
  const status = (fd.get("status") as string).trim() as
    | "LIVE"
    | "RESCUED"
    | "STEALTH"
  const stack = parseList(fd.get("stack") as string)
  const role = (fd.get("role") as string).trim() || null
  const client = (fd.get("client") as string).trim() || null
  const url = (fd.get("url") as string).trim() || null

  if (!slug || !name || !desc)
    return { error: "Slug, name, and description are required." }
  if (!["LIVE", "RESCUED", "STEALTH"].includes(status))
    return { error: "Invalid status." }

  const heroResult = parseJson(fd.get("hero") as string, "hero")
  if (!heroResult.ok) return { error: heroResult.error }
  const sectionsResult = parseJson(fd.get("sections") as string, "sections")
  if (!sectionsResult.ok) return { error: sectionsResult.error }
  const relatedSlugs = parseList(fd.get("relatedSlugs") as string)

  try {
    await prisma.project.create({
      data: {
        slug,
        order,
        name,
        italic,
        desc,
        cover,
        monogram,
        year,
        duration,
        status,
        stack,
        role,
        client,
        url,
        hero: heroResult.value ?? undefined,
        sections: sectionsResult.value ?? undefined,
        relatedSlugs,
      },
    })
  } catch {
    return { error: "A project with that slug already exists." }
  }
  revalidateTag("projects", "max")
  redirect("/admin/dashboard/projects")
}

export async function updateProject(
  slug: string,
  state: State,
  fd: FormData
): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const name = (fd.get("name") as string).trim()
  const italic = (fd.get("italic") as string).trim()
  const desc = (fd.get("desc") as string).trim()
  const cover = (fd.get("cover") as string).trim()
  const monogram = (fd.get("monogram") as string).trim()
  const year = (fd.get("year") as string).trim()
  const duration = (fd.get("duration") as string).trim()
  const status = (fd.get("status") as string).trim() as
    | "LIVE"
    | "RESCUED"
    | "STEALTH"
  const stack = parseList(fd.get("stack") as string)
  const role = (fd.get("role") as string).trim() || null
  const client = (fd.get("client") as string).trim() || null
  const url = (fd.get("url") as string).trim() || null

  if (!name || !desc) return { error: "Name and description are required." }
  if (!["LIVE", "RESCUED", "STEALTH"].includes(status))
    return { error: "Invalid status." }

  const heroResult = parseJson(fd.get("hero") as string, "hero")
  if (!heroResult.ok) return { error: heroResult.error }
  const sectionsResult = parseJson(fd.get("sections") as string, "sections")
  if (!sectionsResult.ok) return { error: sectionsResult.error }
  const relatedSlugs = parseList(fd.get("relatedSlugs") as string)

  await prisma.project.update({
    where: { slug },
    data: {
      order,
      name,
      italic,
      desc,
      cover,
      monogram,
      year,
      duration,
      status,
      stack,
      role,
      client,
      url,
      hero: heroResult.value ?? undefined,
      sections: sectionsResult.value ?? undefined,
      relatedSlugs,
    },
  })
  revalidateTag("projects", "max")
  redirect("/admin/dashboard/projects")
}

export async function updateProjectNoRedirect(
  slug: string,
  state: State,
  fd: FormData
): Promise<State> {
  const order = parseInt(fd.get("order") as string)
  const name = (fd.get("name") as string).trim()
  const italic = (fd.get("italic") as string).trim()
  const desc = (fd.get("desc") as string).trim()
  const cover = (fd.get("cover") as string).trim()
  const monogram = (fd.get("monogram") as string).trim()
  const year = (fd.get("year") as string).trim()
  const duration = (fd.get("duration") as string).trim()
  const status = (fd.get("status") as string).trim() as "LIVE" | "RESCUED" | "STEALTH"
  const stack = parseList(fd.get("stack") as string)
  const role = (fd.get("role") as string).trim() || null
  const client = (fd.get("client") as string).trim() || null
  const url = (fd.get("url") as string).trim() || null

  if (!name || !desc) return { error: "Name and description are required." }
  if (!["LIVE", "RESCUED", "STEALTH"].includes(status))
    return { error: "Invalid status." }

  const heroResult = parseJson(fd.get("hero") as string, "hero")
  if (!heroResult.ok) return { error: heroResult.error }
  const sectionsResult = parseJson(fd.get("sections") as string, "sections")
  if (!sectionsResult.ok) return { error: sectionsResult.error }
  const relatedSlugs = parseList(fd.get("relatedSlugs") as string)

  await prisma.project.update({
    where: { slug },
    data: {
      order,
      name,
      italic,
      desc,
      cover,
      monogram,
      year,
      duration,
      status,
      stack,
      role,
      client,
      url,
      hero: heroResult.value ?? undefined,
      sections: sectionsResult.value ?? undefined,
      relatedSlugs,
    },
  })
  revalidateTag("projects", "max")
  return null
}

export async function deleteProject(slug: string): Promise<void> {
  await prisma.project.delete({ where: { slug } })
  revalidateTag("projects", "max")
}
