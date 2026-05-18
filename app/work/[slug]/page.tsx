import type { Metadata } from "next"
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
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}

  const canonical = `https://kennik.dk/work/${slug}`
  const ogImage = project.coverImage
    ? {
        url: project.coverImage,
        width: 1200,
        height: 630,
        alt: `${project.name} — project by Kennik Kollemorten`,
      }
    : {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: `${project.name} — project by Kennik Kollemorten`,
      }

  return {
    title: project.name,
    description: project.desc,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: project.name,
      description: project.desc,
      images: [ogImage],
      authors: ["Kennik Kollemorten"],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.desc,
      images: [ogImage.url],
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project || !project.hero) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `https://kennik.dk/work/${slug}`,
    name: project.name,
    description: project.desc,
    url: `https://kennik.dk/work/${slug}`,
    creator: {
      "@type": "Person",
      "@id": "https://kennik.dk/#person",
      name: "Kennik Kollemorten",
    },
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(project.url ? { sameAs: project.url } : {}),
    ...(project.stack?.length
      ? { keywords: project.stack.join(", ") }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailPage project={project} />
    </>
  )
}
