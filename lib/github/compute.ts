import type { RawRepo, RawContributions, LanguageStat } from "./types"

export function aggregateLanguages(repos: RawRepo[]): LanguageStat[] {
  const map = new Map<string, { bytes: number; color: string }>()

  for (const repo of repos) {
    for (const { size, node } of repo.languages.edges) {
      const entry = map.get(node.name)
      map.set(node.name, {
        bytes: (entry?.bytes ?? 0) + size,
        color: node.color ?? "#888888",
      })
    }
  }

  const total = [...map.values()].reduce((sum, l) => sum + l.bytes, 0)

  return [...map.entries()]
    .map(([name, { bytes, color }]) => ({
      name,
      color,
      bytes,
      percentage: total > 0 ? Math.round((bytes / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 10)
}

export function sumContributions(list: RawContributions[]): RawContributions {
  return list.reduce(
    (acc, c) => ({
      totalCommitContributions:
        acc.totalCommitContributions + c.totalCommitContributions,
      totalIssueContributions:
        acc.totalIssueContributions + c.totalIssueContributions,
      totalPullRequestContributions:
        acc.totalPullRequestContributions + c.totalPullRequestContributions,
      totalPullRequestReviewContributions:
        acc.totalPullRequestReviewContributions +
        c.totalPullRequestReviewContributions,
      totalRepositoryContributions:
        acc.totalRepositoryContributions + c.totalRepositoryContributions,
    }),
    {
      totalCommitContributions: 0,
      totalIssueContributions: 0,
      totalPullRequestContributions: 0,
      totalPullRequestReviewContributions: 0,
      totalRepositoryContributions: 0,
    }
  )
}

export function totalRepoCommits(repos: RawRepo[]): number {
  return repos.reduce(
    (sum, repo) => sum + (repo.defaultBranchRef?.target?.history?.totalCount ?? 0),
    0
  )
}

export function yearsActive(createdAt: string): number {
  return Math.max(1, new Date().getFullYear() - new Date(createdAt).getFullYear())
}

// Run N items at a time to avoid hammering the API
export async function chunked<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    results.push(...(await Promise.all(batch.map(fn))))
  }
  return results
}
