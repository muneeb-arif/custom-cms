"use client"

import { useState, useEffect, useCallback } from "react"

interface StorageBlob {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

interface ListResult {
  blobs: StorageBlob[]
  cursor?: string
  hasMore: boolean
}

export default function MediaLibrary() {
  const [blobs, setBlobs] = useState<StorageBlob[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [prefix, setPrefix] = useState("")

  const loadMedia = useCallback(
    async (cursorParam?: string) => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (prefix) params.set("prefix", prefix)
        if (cursorParam) params.set("cursor", cursorParam)
        params.set("limit", "50")
        const res = await fetch(`/api/media?${params}`)
        if (!res.ok) throw new Error("Failed to load media")
        const data: ListResult = await res.json()
        if (cursorParam) {
          setBlobs((prev) => [...prev, ...data.blobs])
        } else {
          setBlobs(data.blobs)
        }
        setCursor(data.cursor ?? null)
        setHasMore(data.hasMore)
      } catch (err) {
        console.error(err)
        setBlobs([])
      } finally {
        setLoading(false)
      }
    },
    [prefix]
  )

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.set("file", file)
      fd.set("prefix", "media")
      const res = await fetch("/api/media", { method: "POST", body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Upload failed")
      loadMedia()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDelete = async (url: string) => {
    if (!confirm("Delete this file?")) return
    setDeleting(url)
    try {
      const res = await fetch(`/api/media?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      setBlobs((prev) => prev.filter((b) => b.url !== url))
    } catch (err) {
      console.error(err)
      alert("Failed to delete file")
    } finally {
      setDeleting(null)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by prefix
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadMedia()}
              placeholder="e.g. media, header"
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
            />
          </div>
          <button
            type="button"
            onClick={() => loadMedia()}
            className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
          >
            Filter
          </button>
        </div>
        <div className="flex items-end gap-2">
          <label className="cursor-pointer">
            <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium">
              {uploading ? "Uploading…" : "Upload file"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}

      {loading ? (
        <p className="text-gray-500">Loading media…</p>
      ) : blobs.length === 0 ? (
        <p className="text-gray-500">No media files yet. Upload one to get started.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {blobs.map((blob) => (
              <div
                key={blob.url}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white group"
              >
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={blob.url}
                    alt={blob.pathname}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' fill='%23999' text-anchor='middle' dy='.3em' font-size='12'%3EFile%3C/text%3E%3C/svg%3E"
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(blob.url)}
                      disabled={deleting === blob.url}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting === blob.url ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
                <div className="p-2 text-xs text-gray-600 truncate" title={blob.pathname}>
                  {blob.pathname.split("/").pop() ?? blob.pathname}
                </div>
                <div className="px-2 pb-2 text-xs text-gray-400">
                  {formatSize(blob.size)}
                </div>
              </div>
            ))}
          </div>
          {hasMore && cursor && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => loadMedia(cursor)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
