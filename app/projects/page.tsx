import { getProjects } from "@/lib/data/projects"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/sections/footer"
import { ProjectsPage } from "@/components/sections/projects-page"

export const metadata = {
  title: "Selected work — Kennik.dk",
  description:
    "A complete record of client work and side-projects. Shipped, measured, honest.",
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
