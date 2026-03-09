import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getBlobToken, BLOB_NOT_CONFIGURED_MESSAGE } from "@/lib/blob"
import { put } from "@vercel/blob"

const MAX_FILE_BYTES = 4 * 1024 * 1024 // 4 MB (under Vercel server 4.5 MB limit)
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]

/**
 * Reusable upload API for Vercel Blob.
 * Use with prefix=header for logo, prefix=banners, prefix=sections, etc. for future assets.
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = getBlobToken()
  if (!token) {
    return NextResponse.json(
      { error: BLOB_NOT_CONFIGURED_MESSAGE },
      { status: 503 }
    )
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
  const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 80)
  const ext = file.name.includes(".") ? file.name.split(".").pop()?.slice(0, 10) || "bin" : "bin"
  const pathname = `${prefix}/${baseName}-${Date.now()}.${ext}`

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
    })
    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error("Blob upload failed:", err)
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
