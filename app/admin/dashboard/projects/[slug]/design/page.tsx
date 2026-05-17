import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { ProjectDesigner } from "./designer"

export default async function ProjectDesignPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  const { slug } = await params
  const proj = await prisma.project.findUnique({ where: { slug } })
  if (!proj) notFound()

  return <ProjectDesigner initialData={proj} />
}
