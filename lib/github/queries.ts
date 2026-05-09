export const PROFILE_AND_REPOS = `
  query ProfileAndRepos($after: String) {
    viewer {
      login
      name
      avatarUrl
      createdAt
      followers { totalCount }
      following { totalCount }
      repositories(
        first: 100
        after: $after
        ownerAffiliations: OWNER
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          isPrivate
          isFork
          stargazerCount
          forkCount
          watchers { totalCount }
          diskUsage
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history { totalCount }
              }
            }
          }
        }
      }
    }
  }
`

// Max range per query is 1 year — call once per calendar year for lifetime stats
export const CONTRIBUTIONS_BY_YEAR = `
  query ContributionsByYear($from: DateTime!, $to: DateTime!) {
    viewer {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalRepositoryContributions
      }
    }
  }
`
