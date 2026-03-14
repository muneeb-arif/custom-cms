import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getStorageService } from "@/lib/storage"
import { BLOB_NOT_CONFIGURED_MESSAGE } from "@/lib/blob"

const MAX_FILE_BYTES = 4 * 1024 * 1024 // 4 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_BYTES) {
    return `File too large. Maximum size is ${MAX_FILE_BYTES / 1024 / 1024} MB.`
  }
  const type = file.type?.toLowerCase() || ""
  if (!ALLOWED_TYPES.some((t) => type === t || type.startsWith("image/"))) {
    return "Invalid file type. Allowed: images (JPEG, PNG, GIF, WebP, SVG)."
  }
  return null
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const storage = getStorageService()
    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get("prefix") || undefined
    const cursor = searchParams.get("cursor") || undefined
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? parseInt(limitParam, 10) : 100

    const result = await storage.list({ prefix, cursor, limit })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    if (message === BLOB_NOT_CONFIGURED_MESSAGE) {
      return NextResponse.json({ error: message }, { status: 503 })
    }
    console.error("Media list failed:", err)
    return NextResponse.json(
      { error: "Failed to list media." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 }
    )
  }

  const file = formData.get("file")
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing or invalid file (use field name 'file')" },
      { status: 400 }
    )
  }

  const validationError = validateFile(file)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const prefix =
    (formData.get("prefix") as string)?.trim().replace(/[^a-z0-9-_]/gi, "") ||
    "media"

  try {
    const storage = getStorageService()
    const { url } = await storage.upload(file, prefix)
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    if (message === BLOB_NOT_CONFIGURED_MESSAGE) {
      return NextResponse.json({ error: message }, { status: 503 })
    }
    console.error("Media upload failed:", err)
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let url: string | null = null
  const contentType = request.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    try {
      const body = await request.json()
      url = body?.url ?? null
    } catch {
      // fall through to query param
    }
  }
  if (!url) {
    url = request.nextUrl.searchParams.get("url")
  }

  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "Missing url (query param or JSON body)" },
      { status: 400 }
    )
  }

  try {
    const storage = getStorageService()
    await storage.delete(url)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    if (message === BLOB_NOT_CONFIGURED_MESSAGE) {
      return NextResponse.json({ error: message }, { status: 503 })
    }
    console.error("Media delete failed:", err)
    return NextResponse.json(
      { error: "Failed to delete file." },
      { status: 500 }
    )
  }
}
