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

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: string
  prefix?: string
}

export default function ImagePicker({
  value,
  onChange,
  label = "Image",
  accept = "image/*",
  prefix = "media",
}: ImagePickerProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [blobs, setBlobs] = useState<StorageBlob[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const loadMedia = useCallback(async (cursorParam?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("limit", "30")
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
  }, [])

  useEffect(() => {
    if (modalOpen) loadMedia()
  }, [modalOpen, loadMedia])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.set("file", file)
      fd.set("prefix", prefix)
      const res = await fetch("/api/media", { method: "POST", body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Upload failed")
      if (data.url) {
        onChange(data.url)
        setModalOpen(false)
        loadMedia()
      }
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium"
        >
          Choose from Media
        </button>
        <label className="cursor-pointer">
          <span className="inline-block px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
            {uploading ? "Uploading…" : "Upload new"}
          </span>
          <input
            type="file"
            accept={accept}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setUploading(true)
              try {
                const fd = new FormData()
                fd.set("file", file)
                fd.set("prefix", prefix)
                const res = await fetch("/api/media", { method: "POST", body: fd })
                const data = await res.json().catch(() => ({}))
                if (!res.ok) throw new Error(data.error || "Upload failed")
                if (data.url) onChange(data.url)
              } catch (err) {
                alert(err instanceof Error ? err.message : "Upload failed")
              } finally {
                setUploading(false)
                e.target.value = ""
              }
            }}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className={inputClass}
      />
      {value && (
        <div className="pt-2">
          <p className="text-xs font-medium text-gray-700 mb-1">Preview</p>
          <img
            src={value}
            alt="Preview"
            className="h-20 w-auto max-w-[200px] object-contain border border-gray-200 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none"
            }}
          />
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Choose image</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-4 border-b">
              <label className="cursor-pointer">
                <span className="inline-block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  {uploading ? "Uploading…" : "Upload new file"}
                </span>
                <input
                  type="file"
                  accept={accept}
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <div className="p-4 overflow-auto flex-1">
              {loading ? (
                <p className="text-gray-500">Loading…</p>
              ) : blobs.length === 0 ? (
                <p className="text-gray-500">No media. Upload a file above.</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {blobs.map((blob) => (
                    <button
                      key={blob.url}
                      type="button"
                      onClick={() => {
                        onChange(blob.url)
                        setModalOpen(false)
                      }}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                    >
                      <img
                        src={blob.url}
                        alt={blob.pathname}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' fill='%23999' text-anchor='middle' dy='.3em' font-size='10'%3EFile%3C/text%3E%3C/svg%3E"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
              {hasMore && cursor && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => loadMedia(cursor)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
