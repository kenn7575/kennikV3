// Raw GitHub API response shapes

export interface RawLanguageEdge {
  size: number
  node: { name: string; color: string | null }
}

export interface RawRepo {
  name: string
  isPrivate: boolean
  isFork: boolean
  stargazerCount: number
  forkCount: number
  watchers: { totalCount: number }
  diskUsage: number | null
  languages: { edges: RawLanguageEdge[] }
  defaultBranchRef: {
    target: { history: { totalCount: number } } | null
  } | null
}

export interface RawContributions {
  totalCommitContributions: number
  totalIssueContributions: number
  totalPullRequestContributions: number
  totalPullRequestReviewContributions: number
  totalRepositoryContributions: number
}

export interface RawProfilePage {
  viewer: {
    login: string
    name: string | null
    avatarUrl: string
    createdAt: string
    followers: { totalCount: number }
    following: { totalCount: number }
    repositories: {
      totalCount: number
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
      nodes: RawRepo[]
    }
  }
}

export interface RawYearContributions {
  viewer: {
    contributionsCollection: RawContributions
  }
}

export interface RawContributorStat {
  author: { login: string } | null
  total: number
  weeks: Array<{ w: number; a: number; d: number; c: number }>
}

// Public output types

export interface LanguageStat {
  name: string
  color: string
  bytes: number
  percentage: number
}

export interface GitHubStats {
  profile: {
    login: string
    name: string
    avatarUrl: string
    createdAt: string
    yearsActive: number
    followers: number
    following: number
  }
  repos: {
    total: number
    public: number
    private: number
    forks: number
    original: number
    totalStars: number
    totalForks: number
    totalWatchers: number
    totalDiskUsageMB: number
  }
  contributions: {
    totalCommits: number
    totalPRs: number
    totalIssues: number
    totalReviews: number
    totalReposCreated: number
  }
  code: {
    totalRepoCommits: number
    topLanguages: LanguageStat[]
  }
  fetchedAt: string
}

// Separate type for the expensive REST-based line stats
export interface GitHubLineStats {
  totalAdditions: number
  totalDeletions: number
  netLines: number
  reposSampled: number
  fetchedAt: string
}
