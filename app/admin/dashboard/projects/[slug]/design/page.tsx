import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { ProjectDesigner } from "./designer"

export default async function ProjectDesignPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { slug } = await params
  const [proj, allRows] = await Promise.all([
    prisma.project.findUnique({ where: { slug } }),
    prisma.project.findMany({
      select: { slug: true, name: true, italic: true, monogram: true, cover: true },
      orderBy: { order: "asc" },
    }),
  ])
  if (!proj) notFound()

  return <ProjectDesigner initialData={proj} allProjects={allRows} />
}
