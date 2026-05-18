import { notFound } from "next/navigation"
import { getProject, getProjects } from "@/lib/data/projects"
import { ProjectDetailPage } from "@/components/sections/project-detail"

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return {
    title: `${project.name} — Kennik.dk`,
    description: project.desc,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  console.log("🚀 ~ ProjectPage ~ project:", project)
  if (!project || !project.hero) notFound()
  return <ProjectDetailPage project={project} />
}
