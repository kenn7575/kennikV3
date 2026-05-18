import type { Metadata } from "next"
import { getProjects } from "@/lib/data/projects"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/sections/footer"
import { ProjectsPage } from "@/components/sections/projects-page"

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "A curated record of client work and side-projects by Kennik Kollemorten — full-stack developer based in Svendborg. Shipped, measured, honest.",
  alternates: { canonical: "https://kennik.dk/projects" },
  openGraph: {
    url: "https://kennik.dk/projects",
    title: "Selected Work — Kennik.dk",
    description:
      "Client work and side-projects by Kennik Kollemorten. Full-stack development from architecture to deployment.",
  },
}

export default async function Page() {
  const projects = await getProjects()
  return (
    <>
      <Header />
      <main>
        <ProjectsPage projects={projects} />
      </main>
      <Footer />
    </>
  )
}
