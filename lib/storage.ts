import { randomUUID } from "crypto"
import { getStorageBucket } from "./firebase-admin"

const BUCKET_NAME = process.env.FIREBASE_STORAGE_BUCKET ?? "vennik-v3.appspot.com"
const STORAGE_BASE = `https://storage.googleapis.com/${BUCKET_NAME}/`

export function isStorageUrl(url: string): boolean {
  return url.startsWith(STORAGE_BASE + "project-images/")
}

function urlToStoragePath(publicUrl: string): string {
  return decodeURIComponent(publicUrl.replace(STORAGE_BASE, ""))
}

export async function uploadProjectImage(slug: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin"
  const storagePath = `project-images/${slug}/${randomUUID()}.${ext}`

  const bucket = getStorageBucket()
  const fileRef = bucket.file(storagePath)

  const buffer = Buffer.from(await file.arrayBuffer())
  await fileRef.save(buffer, {
    metadata: { contentType: file.type },
    // No signed URL needed — Firebase rules allow public read
  })
  await fileRef.makePublic()

  return `${STORAGE_BASE}${storagePath}`
}

export async function deleteStorageFile(publicUrl: string): Promise<void> {
  if (!isStorageUrl(publicUrl)) return
  try {
    const bucket = getStorageBucket()
    await bucket.file(urlToStoragePath(publicUrl)).delete()
  } catch {
    // Ignore not-found errors — file may already be gone
  }
}

export async function deleteProjectImages(slug: string): Promise<void> {
  const bucket = getStorageBucket()
  const [files] = await bucket.getFiles({ prefix: `project-images/${slug}/` })
  await Promise.all(files.map((f) => f.delete().catch(() => null)))
}

export function extractCoverUrls(data: unknown): string[] {
  if (!data || typeof data !== "object") return []
  const urls: string[] = []

  function walk(node: unknown) {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    const obj = node as Record<string, unknown>
    for (const [key, val] of Object.entries(obj)) {
      if (key === "cover" && typeof val === "string" && isStorageUrl(val)) {
        urls.push(val)
      } else {
        walk(val)
      }
    }
  }

  walk(data)
  return urls
}
