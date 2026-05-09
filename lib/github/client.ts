// Low-level fetch helpers for GitHub GraphQL and REST APIs.
// Requires GITHUB_TOKEN env var with `repo` scope for private repos.

const GQL_URL = "https://api.github.com/graphql"
const REST_URL = "https://api.github.com"

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error("GITHUB_TOKEN environment variable is not set")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
}

export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(GQL_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error(`GitHub GraphQL HTTP ${res.status}`)
  const json = (await res.json()) as { data: T; errors?: { message: string }[] }
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

// Returns null on 202 (GitHub computing stats) or 204 (no content)
export async function rest<T>(path: string, revalidate = 86400): Promise<T | null> {
  const res = await fetch(`${REST_URL}${path}`, {
    headers: headers(),
    next: { revalidate },
  })
  if (res.status === 202 || res.status === 204) return null
  if (!res.ok) throw new Error(`GitHub REST HTTP ${res.status}: ${path}`)
  return res.json() as Promise<T>
}
