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

/**
 * Legacy upload API - thin wrapper around storage service.
 * Prefer POST /api/media for new code.
 */
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

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_FILE_BYTES / 1024 / 1024} MB.` },
      { status: 400 }
    )
  }

  const type = file.type?.toLowerCase() || ""
  if (!ALLOWED_TYPES.some((t) => type === t || type.startsWith("image/"))) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: images (JPEG, PNG, GIF, WebP, SVG)." },
      { status: 400 }
    )
  }

  const prefix =
    (formData.get("prefix") as string)?.trim().replace(/[^a-z0-9-_]/gi, "") ||
    "uploads"

  try {
    const storage = getStorageService()
    const { url } = await storage.upload(file, prefix)
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    if (message === BLOB_NOT_CONFIGURED_MESSAGE) {
      return NextResponse.json({ error: message }, { status: 503 })
    }
    console.error("Upload failed:", err)
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
