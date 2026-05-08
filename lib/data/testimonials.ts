"use server"

export type Testimonial = {
  quote: string
  who: string
  co: string
  initials: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Shipped in 6 weeks what our team had been grinding on for 6 months. Diagnosed the data layer in the first call.",
    who: "Cofounder",
    co: "Mailroom",
    initials: "AM",
  },
  {
    quote: "Took our checkout from 3.4s to 740ms in two weeks. Wrote a 14-page handover. We've not had to think about it since.",
    who: "Head of Eng",
    co: "Field & Co.",
    initials: "JR",
  },
  {
    quote: "Rare to find someone who codes well and writes well. The post-mortem he sent us is in our onboarding doc now.",
    who: "CTO",
    co: "Halftrack",
    initials: "EB",
  },
  {
    quote: "I've worked with 11 contractors. He's the only one whose code I haven't had to rewrite.",
    who: "Founder",
    co: "Atlas (stealth)",
    initials: "SK",
  },
]

export async function getTestimonials(): Promise<Testimonial[]> {
  return TESTIMONIALS
}
