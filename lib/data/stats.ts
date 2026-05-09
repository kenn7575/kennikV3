"use server"

export type ProjectStat = {
  v: string
  label: string
}

const STATS: ProjectStat[] = [
  { v: "42+", label: "SHIPPED PROJECTS · CAREER" },
  { v: "€2.4M", label: "CLIENT ARR INFLUENCED · 2025" },
  { v: "96%", label: "REPEAT-CLIENT RATE · 5 YR" },
  { v: "0", label: "P0 INCIDENTS · LAST 18 MOS" },
]

export async function getProjectStats(): Promise<ProjectStat[]> {
  return STATS
}
