"use server"

export type FaqItem = {
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    q: "Are you available right now?",
    a: "Two slots open in Q3 2026 — Q1 2027. If your project is later than that, get on the list and I'll reply when a slot opens. If it's urgent, ask anyway — I sometimes have a week to spare between long engagements.",
  },
  {
    q: "Do you work alone or with a team?",
    a: "Alone, by default. For builds longer than 10 weeks I'll bring in one trusted designer or one frontend specialist if the scope needs it — always announced up front, never subcontracted invisibly.",
  },
  {
    q: "What's the fastest you can start?",
    a: "If the brief is clear, I can start the same week. If we need to scope first, count on a week of back-and-forth. I never start without a one-page signed brief.",
  },
  {
    q: "Do you do design?",
    a: "I design competently, not artfully. For greenfield products I usually bring in a designer for the first two weeks. For dashboards and internal tools I'm fine on my own.",
  },
  {
    q: "Will you sign an NDA?",
    a: "Yes. I have a one-page mutual NDA I can send. I won't sign 14-page corporate ones without striking a few clauses — happy to walk through which.",
  },
  {
    q: "Where are you based?",
    a: "Copenhagen, Denmark. I work GMT+1 hours, overlap 4 hours with US East, full overlap with EU. I travel to a client kickoff once per engagement when it makes sense.",
  },
  {
    q: "What if you underestimate?",
    a: "Fixed-scope means I eat the overrun. The flip side: I'm conservative on the brief. If we hit a real change in scope, we re-paper it together — but bugs in my plan are on me.",
  },
  {
    q: "Do you take equity?",
    a: "Not as full payment. I'll take up to 25% of a fee as equity in a post-revenue company I believe in, but the rest is cash. If you're pre-revenue, cash only.",
  },
]

export async function getFaqs(): Promise<FaqItem[]> {
  return FAQS
}
