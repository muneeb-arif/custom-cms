"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageData, SectionData } from "@/types/cms"
import SectionEditor from "./SectionEditor"

interface PageEditorProps {
  page?: PageData
}

export default function PageEditor({ page }: PageEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: page?.slug || "",
    title: page?.title || "",
    metaTitle: page?.metaTitle || "",
    metaDescription: page?.metaDescription || "",
    isPublished: page?.isPublished || false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = page ? `/api/pages/${page.id}` : "/api/pages"
      const method = page ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
          <label htmlFor="isPublished" className="text-gray-700">Published</label>
        </div>
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
