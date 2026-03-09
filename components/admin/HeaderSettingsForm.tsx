"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export type HeaderBrandType = "text" | "logo"

interface HeaderSettingsFormProps {
  initialBrandType: HeaderBrandType | null
  initialBrandText: string | null
  initialLogoUrl: string | null
}

export default function HeaderSettingsForm({
  initialBrandType,
  initialBrandText,
  initialLogoUrl,
}: HeaderSettingsFormProps) {
  const router = useRouter()
  const [brandType, setBrandType] = useState<HeaderBrandType>(
    initialBrandType === "logo" ? "logo" : "text"
  )
  const [brandText, setBrandText] = useState(initialBrandText ?? "InforMityx")
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl ?? "")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.set("file", file)
      formData.set("prefix", "header")
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }
      if (data.url) {
        setLogoUrl(data.url)
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headerBrandType: brandType,
          headerBrandText: brandType === "text" ? (brandText.trim() || "InforMityx") : null,
          headerLogoUrl:
            brandType === "logo" && logoUrl.trim()
              ? logoUrl.trim()
              : "",
        }),
      })
      if (!res.ok) throw new Error("Failed to save")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to save header settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-xl">
        <h3 className="font-semibold text-gray-900 mb-4">Header branding</h3>
        <p className="text-sm text-gray-600 mb-4">
          Show either text or a logo in the header. For logo, upload an image or
          paste a direct image URL.
        </p>

        <div className="space-y-4">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="brandType"
                value="text"
                checked={brandType === "text"}
                onChange={() => setBrandType("text")}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Text</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="brandType"
                value="logo"
                checked={brandType === "logo"}
                onChange={() => setBrandType("logo")}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Logo</span>
            </label>
          </div>

          {brandType === "text" && (
            <div>
              <label
                htmlFor="headerBrandText"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Header text
              </label>
              <input
                id="headerBrandText"
                type="text"
                value={brandText}
                onChange={(e) => setBrandText(e.target.value)}
                placeholder="InforMityx"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          )}

          {brandType === "logo" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload logo image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium file:cursor-pointer hover:file:bg-blue-100"
                />
                {uploading && (
                  <p className="text-xs text-gray-500 mt-1">Uploading…</p>
                )}
                {uploadError && (
                  <p className="text-xs text-red-600 mt-1">{uploadError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="headerLogoUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Or paste logo image URL
                </label>
                <input
                  id="headerLogoUrl"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value)
                    setUploadError(null)
                  }}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              {logoUrl && (
                <div className="pt-2">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Current logo
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="h-10 w-auto max-w-[200px] object-contain border border-gray-200 rounded"
                    />
                    <span className="text-xs text-gray-500 truncate max-w-[200px]" title={logoUrl}>
                      {logoUrl}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save header settings"}
          </button>
        </div>
      </div>
    </form>
  )
}
