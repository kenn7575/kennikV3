import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { uploadProjectImage } from "@/lib/storage"

const MAX_SIZE = 8 * 1024 * 1024 // 8 MB

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const form = await req.formData()
  const file = form.get("file")
  const slug = (form.get("slug") as string | null)?.trim()

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 })
  }
  if (!slug) {
    return NextResponse.json({ error: "No slug provided." }, { status: 400 })
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 8 MB limit." }, { status: 400 })
  }

  const url = await uploadProjectImage(slug, file)
  return NextResponse.json({ url })
}
