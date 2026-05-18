import type { Metadata } from "next"
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

export const metadata: Metadata = {
  title:
    "Kenni Kollemorten — kennik - Freelance Full-Stack Developer, Svendborg",
  description:
    "Svendborg-based freelance full-stack developer specialising in Next.js, TypeScript, and React. I build fast, scalable web products end-to-end — from architecture to deployment. Available for new projects.",
  alternates: { canonical: "https://kennik.dk" },
  openGraph: {
    url: "https://kennik.dk",
    title: "Kennik Kollemorten — Freelance Full-Stack Developer, Svendborg",
    description:
      "Svendborg-based freelance full-stack developer. Fast, scalable web products end-to-end — architecture, design, and deployment.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://kennik.dk/#person",
      name: "Kennik Kollemorten",
      url: "https://kennik.dk",
      jobTitle: "Freelance Full-Stack Developer",
      description:
        "Svendborg-based freelance full-stack developer specialising in Next.js, TypeScript, and React.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Svendborg",
        addressCountry: "DK",
      },
      knowsAbout: ["Next.js", "TypeScript", "React", "Node.js", "PostgreSQL"],
    },
    {
      "@type": "WebSite",
      "@id": "https://kennik.dk/#website",
      url: "https://kennik.dk",
      name: "Kennik.dk",
      description:
        "Portfolio of Kennik Kollemorten — freelance full-stack developer based in Svendborg.",
      publisher: { "@id": "https://kennik.dk/#person" },
    },
  ],
}

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
