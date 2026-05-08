"use server"

export type Package = {
  id: string
  name: string
  italic: string
  price: string
  duration: string
  blurb: string
  includes: string[]
  cta: string
  featured: boolean
}

const PACKAGES: Package[] = [
  {
    id: "rescue",
    name: "Rescue",
    italic: "a fire to put out.",
    price: "from €4.5k",
    duration: "1–2 weeks",
    blurb: "Something is on fire. I diagnose, fix, document. Best for: a regression, a missed deadline, a contractor who left.",
    includes: ["Audit + root-cause", "Hands-on fixes", "Runbook + handover", "Slack support · 1 week"],
    cta: "Start a rescue",
    featured: false,
  },
  {
    id: "build",
    name: "Build",
    italic: "the whole product.",
    price: "from €18k",
    duration: "6–12 weeks",
    blurb: "End-to-end. Architecture, code, infra, observability. You get a working product on Fly or Vercel and the keys.",
    includes: ["Discovery + scope", "Production build", "CI/CD + monitoring", "Friday demos", "30-day warranty", "Full docs + ADRs"],
    cta: "Plan a build",
    featured: true,
  },
  {
    id: "retainer",
    name: "Retainer",
    italic: "on speed-dial.",
    price: "€6k / month",
    duration: "rolling 90-day",
    blurb: "A senior pair of eyes for your team. Weekly review, on-call for incidents, hands-on for two days per month.",
    includes: ["Weekly architecture review", "PR review · unlimited", "2 hands-on days / month", "Incident on-call · business hrs"],
    cta: "Book a retainer",
    featured: false,
  },
]

export async function getPackages(): Promise<Package[]> {
  return PACKAGES
}
