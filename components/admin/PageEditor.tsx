"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageData, SectionData } from "@/types/cms"
import SectionEditor from "./SectionEditor"
import SetHomePageButton from "./SetHomePageButton"

interface PageEditorProps {
  page?: PageData
  homePageId?: string | null
}

export default function PageEditor({ page, homePageId = null }: PageEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingBannerBg, setUploadingBannerBg] = useState(false)
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    slug: page?.slug || "",
    title: page?.title || "",
    metaTitle: page?.metaTitle || "",
    metaDescription: page?.metaDescription || "",
    isPublished: page?.isPublished || false,
    bannerBackgroundImage: page?.bannerBackgroundImage ?? "",
    bannerOverlayColor: page?.bannerOverlayColor ?? "#ffffff",
    bannerOverlayOpacity: page?.bannerOverlayOpacity ?? 0.8,
    bannerTitle: page?.bannerTitle ?? "",
    bannerText: page?.bannerText ?? "",
    bannerButtonText: page?.bannerButtonText ?? "",
    bannerButtonLink: page?.bannerButtonLink ?? "",
    bannerButtonVisible: page?.bannerButtonVisible ?? true,
    bannerImage: page?.bannerImage ?? "",
    bannerHeightPercent: page?.bannerHeightPercent ?? 60,
  })
  const [sections, setSections] = useState<SectionData[]>(page?.sections || [])

  useEffect(() => {
    if (page) {
      loadSections()
    }
  }, [page])

  const loadSections = async () => {
    if (!page) return
    try {
      const response = await fetch(`/api/sections?pageId=${page.id}`)
      const data = await response.json()
      setSections(data)
    } catch (error) {
      console.error("Failed to load sections:", error)
    }
  }

  const handleBannerBackgroundUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploadingBannerBg(true)
    try {
      const fd = new FormData()
      fd.set("file", file)
      fd.set("prefix", "page-banner")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Upload failed")
      if (data.url) setFormData((prev) => ({ ...prev, bannerBackgroundImage: data.url }))
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadingBannerBg(false)
      e.target.value = ""
    }
  }

  const handleBannerImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploadingBannerImage(true)
    try {
      const fd = new FormData()
      fd.set("file", file)
      fd.set("prefix", "page-banner-image")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Upload failed")
      if (data.url) setFormData((prev) => ({ ...prev, bannerImage: data.url }))
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadingBannerImage(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = page ? `/api/pages/${page.id}` : "/api/pages"
      const method = page ? "PUT" : "POST"
      const payload = {
        ...formData,
        bannerBackgroundImage: formData.bannerBackgroundImage || null,
        bannerOverlayColor: formData.bannerOverlayColor || null,
        bannerTitle: formData.bannerTitle || null,
        bannerText: formData.bannerText || null,
        bannerButtonText: formData.bannerButtonText || null,
        bannerButtonLink: formData.bannerButtonLink || null,
        bannerImage: formData.bannerImage || null,
        bannerHeightPercent: formData.bannerHeightPercent ?? null,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to save page")

      const savedPage = await response.json()
      router.push(`/admin/pages/${savedPage.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error saving page:", error)
      alert("Failed to save page")
    } finally {
      setLoading(false)
    }
  }

  const addSection = async (type: string) => {
    if (!page) {
      alert("Please save the page first before adding sections")
      return
    }

    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: page.id,
          type,
          order: sections.length,
          content: getDefaultContent(type),
          isVisible: true,
        }),
      })

      if (!response.ok) throw new Error("Failed to create section")

      const newSection = await response.json()
      setSections([...sections, newSection])
    } catch (error) {
      console.error("Error creating section:", error)
      alert("Failed to create section")
    }
  }

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "textImage":
        return { text: "", image: "", alignment: "left" }
      case "imageSlider":
        return { images: [], autoplay: false }
      case "headingParagraph":
        return { heading: "", paragraphs: [""] }
      default:
        return {}
    }
  }

  const deleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete section")

      setSections(sections.filter((s) => s.id !== sectionId))
    } catch (error) {
      console.error("Error deleting section:", error)
      alert("Failed to delete section")
    }
  }

  const updateSection = (updatedSection: SectionData) => {
    setSections(
      sections.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        {page ? "Edit Page" : "Create New Page"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="about-us"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Meta Title</label>
          <input
            type="text"
            value={formData.metaTitle}
            onChange={(e) =>
              setFormData({ ...formData, metaTitle: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Meta Description
          </label>
          <textarea
            value={formData.metaDescription}
            onChange={(e) =>
              setFormData({ ...formData, metaDescription: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Page banner</h2>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Banner height (% of viewport)
              </label>
              <input
                type="number"
                min={20}
                max={100}
                value={formData.bannerHeightPercent ?? 60}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bannerHeightPercent: Number(e.target.value) || 60,
                  })
                }
                className="w-full max-w-[120px] px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Height as % of viewport (e.g. 60 = 60vh). Default 60.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Top banner (background image)
              </label>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerBackgroundUpload}
                disabled={uploadingBannerBg}
                className="text-sm text-gray-600"
              />
              <input
                type="url"
                value={formData.bannerBackgroundImage}
                onChange={(e) =>
                  setFormData({ ...formData, bannerBackgroundImage: e.target.value })
                }
                placeholder="Or paste image URL"
                className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {uploadingBannerBg && (
              <p className="text-xs text-gray-500 mt-1">Uploading…</p>
            )}
            {formData.bannerBackgroundImage && (
              <p className="text-xs text-gray-500 mt-1 truncate max-w-full">
                Current: {formData.bannerBackgroundImage}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Banner overlay color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.bannerOverlayColor}
                  onChange={(e) =>
                    setFormData({ ...formData, bannerOverlayColor: e.target.value })
                  }
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.bannerOverlayColor}
                  onChange={(e) =>
                    setFormData({ ...formData, bannerOverlayColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Overlay transparency (0–1)
              </label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={formData.bannerOverlayOpacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bannerOverlayOpacity: Number(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Banner title
            </label>
            <input
              type="text"
              value={formData.bannerTitle}
              onChange={(e) =>
                setFormData({ ...formData, bannerTitle: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. InforMityx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Banner text
            </label>
            <textarea
              value={formData.bannerText}
              onChange={(e) =>
                setFormData({ ...formData, bannerText: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="e.g. Building modern web applications..."
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Custom banner button</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Button text</label>
                <input
                  type="text"
                  value={formData.bannerButtonText}
                  onChange={(e) =>
                    setFormData({ ...formData, bannerButtonText: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Let's get started"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Button link</label>
                <input
                  type="text"
                  value={formData.bannerButtonLink}
                  onChange={(e) =>
                    setFormData({ ...formData, bannerButtonLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/contact"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bannerButtonVisible"
                checked={formData.bannerButtonVisible}
                onChange={(e) =>
                  setFormData({ ...formData, bannerButtonVisible: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="bannerButtonVisible" className="text-gray-700 text-sm">
                Button visible
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Image on the banner (circular)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerImageUpload}
                disabled={uploadingBannerImage}
                className="text-sm text-gray-600"
              />
              <input
                type="url"
                value={formData.bannerImage}
                onChange={(e) =>
                  setFormData({ ...formData, bannerImage: e.target.value })
                }
                placeholder="Or paste image URL"
                className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {uploadingBannerImage && (
              <p className="text-xs text-gray-500 mt-1">Uploading…</p>
            )}
            {uploadError && (
              <p className="text-xs text-red-600 mt-1">{uploadError}</p>
            )}
            {formData.bannerImage && (
              <p className="text-xs text-gray-500 mt-1 truncate max-w-full">
                Current: {formData.bannerImage}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData({ ...formData, isPublished: e.target.checked })
            }
            className="mr-2"
          />
          <label htmlFor="isPublished" className="text-gray-700">
            Appear in menu (publish to show this page in the header)
          </label>
        </div>
        {page && (
          <div className="flex items-center gap-2">
            <span className="text-gray-700 text-sm">Home page:</span>
            <SetHomePageButton
              pageId={page.id}
              isCurrentHome={page.id === homePageId}
              variant="button"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Page"}
        </button>
      </form>

      {page && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sections</h2>
            <div className="flex gap-2">
              <button
                onClick={() => addSection("textImage")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Text + Image
              </button>
              <button
                onClick={() => addSection("imageSlider")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Image Slider
              </button>
              <button
                onClick={() => addSection("headingParagraph")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Heading + Paragraph
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {sections.map((section) => (
              <SectionEditor
                key={section.id}
                section={section}
                onUpdate={updateSection}
                onDelete={deleteSection}
              />
            ))}
            {sections.length === 0 && (
              <p className="text-gray-500">No sections yet. Add one above.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
