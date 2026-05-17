import { Header } from "@/components/sections/header"
import { Hero } from "@/components/sections/hero"
import { Services } from "@/components/sections/services"
import { Problems } from "@/components/sections/problems"
import { Work } from "@/components/sections/work"
import { Process } from "@/components/sections/process"
import { Stack } from "@/components/sections/stack"
import { Why } from "@/components/sections/why"
import { Availability } from "@/components/sections/availability"
import { About } from "@/components/sections/about"
import { Testimonials } from "@/components/sections/testimonials"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"

import { getProjects } from "@/lib/data/projects"
import { getPackages } from "@/lib/data/packages"
import { getFaqs } from "@/lib/data/faq"
import { getProjectStats } from "@/lib/data/stats"
import { prisma } from "@/lib/prisma"

export default async function Page() {
  const [projects, packages, faqs, stats, slots] = await Promise.all([
    getProjects(),
    getPackages(),
    getFaqs(),
    getProjectStats(),
    prisma.availabilitySlot.findMany({ orderBy: { order: "asc" } }),
  ])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Problems />
        <Work projects={projects} stats={stats} />
        <Process />
        <Stack />
        <Why />
        <Availability slots={slots} />
        <About />
        <Testimonials />
        <Pricing packages={packages} />
        <FAQ items={faqs} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
