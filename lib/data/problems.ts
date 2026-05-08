"use server"

export type Problem = {
  p: string
  s: string
}

const PROBLEMS: Problem[] = [
  { p: "the checkout takes 3.4s", s: "I get it under 800ms." },
  { p: "the dashboard query times out", s: "I rewrite the schema, add the index." },
  { p: "the build pipeline is 22 minutes", s: "I get it under 4." },
  { p: "the codebase has no tests", s: "I add the ones that matter, not all of them." },
  { p: "a contractor left mid-sprint", s: "I pick up the branch and ship it." },
  { p: "the AI feature works in demos only", s: "I write the evals and the off-ramp." },
  { p: "the migration plan is a Notion doc", s: "I write the runbook and run it." },
  { p: "the founder is the only senior dev", s: "I'm the second pair of eyes for 8 weeks." },
]

export async function getProblems(): Promise<Problem[]> {
  return PROBLEMS
}
