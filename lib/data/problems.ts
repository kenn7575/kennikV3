"use server"

export type Problem = {
  p: string
  s: string
}

const PROBLEMS: Problem[] = [
  { p: "We site don't get any visitors", s: "Let me fix your SEO." },
  { p: "I vibe coded a project, but is it secure?", s: "I can review your code and fix vulnerabilities." },
  { p: "My website needs a redesign", s: "I can create a modern, user-friendly design." },
  { p: "We need a mobile app", s: "I can build a cross-platform mobile app." },
  { p: "Our site is too slow", s: "I can improve your site's performance." },
  { p: "We have the world's messiest Excel sheets", s: "That could be a web app instead." },
  { p: "I need a quick demo for my side project", s: "I can build a functional prototype quickly." },
  {p: "We built it ourselves and now it's a mess", s: "I can clean up your codebase and make it maintainable."},
  {p:"We're paying too much for our infrastructure", s: "I can optimize your hosting and save you money."},
  {p:"We need to automate this repetitive internal process", s: "I can build a tool to automate it and save you time."},
  {p: "We got hacked, or we're worried we will be", s: "I can audit your security and fix vulnerabilities."},
  {p: "We have data but can't make sense of it", s: "I can build a dashboard to visualize your data and help you make informed decisions."},

]

export async function getProblems(): Promise<Problem[]> {
  return PROBLEMS
}
