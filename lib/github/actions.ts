"use server"

// Required env var: GITHUB_TOKEN with `repo` scope (private) or `public_repo` (public only)

import { unstable_cache } from "next/cache"
import { graphql, rest } from "./client"
import { PROFILE_AND_REPOS, CONTRIBUTIONS_BY_YEAR } from "./queries"
import {
  aggregateLanguages,
  sumContributions,
  totalRepoCommits,
  yearsActive,
  chunked,
} from "./compute"
import type {
  RawProfilePage,
  RawYearContributions,
  RawRepo,
  RawContributorStat,
  GitHubStats,
  GitHubLineStats,
} from "./types"

// Paginates through all repo pages after the first
async function fetchAllRepos(
  firstNodes: RawRepo[],
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
): Promise<RawRepo[]> {
  const repos = [...firstNodes]
  let hasNext = pageInfo.hasNextPage
  let cursor = pageInfo.endCursor

  while (hasNext && cursor) {
    const page = await graphql<RawProfilePage>(PROFILE_AND_REPOS, { after: cursor })
    repos.push(...page.viewer.repositories.nodes)
    hasNext = page.viewer.repositories.pageInfo.hasNextPage
    cursor = page.viewer.repositories.pageInfo.endCursor
  }

  return repos
}

// Queries contributions year-by-year from account creation to today for lifetime totals
async function fetchLifetimeContributions(createdAt: string) {
  const startYear = new Date(createdAt).getFullYear()
  const now = new Date()
  const currentYear = now.getFullYear()

  const yearRanges = Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
    const year = startYear + i
    const yearEnd = new Date(year, 11, 31, 23, 59, 59)
    return {
      from: new Date(year, 0, 1).toISOString(),
      to: (yearEnd > now ? now : yearEnd).toISOString(),
    }
  })

  const results = await Promise.all(
    yearRanges.map(({ from, to }) =>
      graphql<RawYearContributions>(CONTRIBUTIONS_BY_YEAR, { from, to }).then(
        (d) => d.viewer.contributionsCollection
      )
    )
  )

  return results
}

async function _getGitHubStats(): Promise<GitHubStats> {
  const first = await graphql<RawProfilePage>(PROFILE_AND_REPOS, {})
  const { viewer } = first
  const { login, name, avatarUrl, createdAt, followers, following } = viewer
  const { nodes, pageInfo, totalCount } = viewer.repositories

  const [allRepos, yearlyContributions] = await Promise.all([
    fetchAllRepos(nodes, pageInfo),
    fetchLifetimeContributions(createdAt),
  ])

  const contributions = sumContributions(yearlyContributions)
  const ownRepos = allRepos.filter((r) => !r.isFork)
  const forkRepos = allRepos.filter((r) => r.isFork)

  return {
    profile: {
      login,
      name: name ?? login,
      avatarUrl,
      createdAt,
      yearsActive: yearsActive(createdAt),
      followers: followers.totalCount,
      following: following.totalCount,
    },
    repos: {
      total: totalCount,
      public: allRepos.filter((r) => !r.isPrivate).length,
      private: allRepos.filter((r) => r.isPrivate).length,
      forks: forkRepos.length,
      original: ownRepos.length,
      totalStars: ownRepos.reduce((s, r) => s + r.stargazerCount, 0),
      totalForks: ownRepos.reduce((s, r) => s + r.forkCount, 0),
      totalWatchers: ownRepos.reduce((s, r) => s + r.watchers.totalCount, 0),
      totalDiskUsageMB: Math.round(
        ownRepos.reduce((s, r) => s + (r.diskUsage ?? 0), 0) / 1024
      ),
    },
    contributions: {
      totalCommits: contributions.totalCommitContributions,
      totalPRs: contributions.totalPullRequestContributions,
      totalIssues: contributions.totalIssueContributions,
      totalReviews: contributions.totalPullRequestReviewContributions,
      totalReposCreated: contributions.totalRepositoryContributions,
    },
    code: {
      totalRepoCommits: totalRepoCommits(ownRepos),
      topLanguages: aggregateLanguages(ownRepos),
    },
    fetchedAt: new Date().toISOString(),
  }
}

export const getGitHubStats = unstable_cache(_getGitHubStats, ["github-stats"], {
  revalidate: 86400,
  tags: ["github"],
})

// --- Line-level stats via REST stats API (expensive: 1 call per repo) ---
// Capped at 200 repos, 5 concurrent requests. GitHub returns 202 on first call
// while computing — retries once after 3s. Results cached for 24h.

async function fetchRepoLineStats(
  owner: string,
  repo: string,
  login: string
): Promise<{ additions: number; deletions: number } | null> {
  const path = `/repos/${owner}/${repo}/stats/contributors`
  let data = await rest<RawContributorStat[]>(path, 86400)

  if (data === null) {
    await new Promise((r) => setTimeout(r, 3000))
    data = await rest<RawContributorStat[]>(path, 86400)
  }

  if (!data) return null

  const mine = data.find((c) => c.author?.login === login)
  if (!mine) return null

  return {
    additions: mine.weeks.reduce((s, w) => s + w.a, 0),
    deletions: mine.weeks.reduce((s, w) => s + w.d, 0),
  }
}

async function _getGitHubLineStats(): Promise<GitHubLineStats> {
  const first = await graphql<RawProfilePage>(PROFILE_AND_REPOS, {})
  const { login } = first.viewer
  const { nodes, pageInfo } = first.viewer.repositories
  const allRepos = await fetchAllRepos(nodes, pageInfo)
  const ownRepos = allRepos.filter((r) => !r.isFork).slice(0, 200)

  const results = await chunked(ownRepos, 5, (repo) =>
    fetchRepoLineStats(login, repo.name, login)
  )

  let totalAdditions = 0
  let totalDeletions = 0
  let reposSampled = 0

  for (const result of results) {
    if (result) {
      totalAdditions += result.additions
      totalDeletions += result.deletions
      reposSampled++
    }
  }

  return {
    totalAdditions,
    totalDeletions,
    netLines: totalAdditions - totalDeletions,
    reposSampled,
    fetchedAt: new Date().toISOString(),
  }
}

export const getGitHubLineStats = unstable_cache(
  _getGitHubLineStats,
  ["github-line-stats"],
  { revalidate: 86400, tags: ["github"] }
)
