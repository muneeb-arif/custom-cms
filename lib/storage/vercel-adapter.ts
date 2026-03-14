import { put, list, del } from "@vercel/blob"
import { getBlobToken, BLOB_NOT_CONFIGURED_MESSAGE } from "@/lib/blob"
import type { IStorageService, ListOptions, ListResult, StorageBlob } from "./types"

function requireToken(): string {
  const token = getBlobToken()
  if (!token) {
    throw new Error(BLOB_NOT_CONFIGURED_MESSAGE)
  }
  return token
}

function sanitizePrefix(prefix: string): string {
  return prefix.trim().replace(/[^a-z0-9-_/]/gi, "").replace(/\/+/g, "/") || "uploads"
}

function buildPathname(prefix: string, file: File): string {
  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 80)
  const ext = file.name.includes(".")
    ? file.name.split(".").pop()?.slice(0, 10) || "bin"
    : "bin"
  return `${prefix}/${baseName}-${Date.now()}.${ext}`
}

export class VercelBlobStorageService implements IStorageService {
  async upload(file: File, prefix = "uploads"): Promise<{ url: string }> {
    const token = requireToken()
    const safePrefix = sanitizePrefix(prefix)
    const pathname = buildPathname(safePrefix, file)

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      token,
    })
    return { url: blob.url }
  }

  async list(options?: ListOptions): Promise<ListResult> {
    const token = requireToken()
    const { blobs, cursor, hasMore } = await list(
      {
        prefix: options?.prefix,
        cursor: options?.cursor,
        limit: options?.limit ?? 1000,
        token,
      }
    )

    const storageBlobs: StorageBlob[] = blobs.map((b) => ({
      url: b.url,
      pathname: b.pathname,
      size: b.size ?? 0,
      uploadedAt: b.uploadedAt ?? new Date(0),
    }))

    return {
      blobs: storageBlobs,
      cursor: cursor ?? undefined,
      hasMore: hasMore ?? false,
    }
  }

  async delete(urlOrPathname: string | string[]): Promise<void> {
    const token = requireToken()
    await del(urlOrPathname, { token })
  }
}
