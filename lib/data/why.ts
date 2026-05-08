"use server"

export type WhyReason = {
  t: string
  b: string
}

const WHY: WhyReason[] = [
  {
    t: "One person, one bill.",
    b: "No agency markup, no PMs translating, no Slack of 14 stakeholders. You email me. I email back.",
  },
  {
    t: "Senior, no junior layers.",
    b: "I don't subcontract. The hands writing the migrations are the hands that designed the schema.",
  },
  {
    t: "Fixed scope, fixed price.",
    b: "We agree on the brief before we start. If I underestimate, that's my problem, not yours.",
  },
  {
    t: "Friday demos.",
    b: "You see deployed progress every week. If we're off-course, we know it before it costs you a month.",
  },
  {
    t: "Boring tech, sharp execution.",
    b: "I pick Postgres over the new thing 9 times out of 10. The other time, I have a numbers-backed reason.",
  },
  {
    t: "I write the docs.",
    b: "When I leave, your team can keep going. Runbook, ADRs, threat model, the lot. No tribal knowledge.",
  },
]

export async function getWhyReasons(): Promise<WhyReason[]> {
  return WHY
}
