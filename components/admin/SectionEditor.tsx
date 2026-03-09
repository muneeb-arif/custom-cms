"use client"

import { useState, useEffect } from "react"
import { SectionData } from "@/types/cms"

interface SectionEditorProps {
  section: SectionData
  onUpdate: (section: SectionData) => void
  onDelete: (sectionId: string) => void
}

export default function SectionEditor({
  section,
  onUpdate,
  onDelete,
}: SectionEditorProps) {
  const [content, setContent] = useState(section.content)
  const [isVisible, setIsVisible] = useState(section.isVisible)
  const [order, setOrder] = useState(section.order)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setContent(section.content)
    setIsVisible(section.isVisible)
    setOrder(section.order)
  }, [section])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          isVisible,
          order,
        }),
      })

      if (!response.ok) throw new Error("Failed to update section")

      const updated = await response.json()
      onUpdate(updated)
    } catch (error) {
      console.error("Error updating section:", error)
      alert("Failed to update section")
    } finally {
      setSaving(false)
    }
  }

  const renderEditor = () => {
    switch (section.type) {
      case "textImage":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Text</label>
              <textarea
                value={(content as any).text || ""}
                onChange={(e) =>
                  setContent({ ...content, text: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Image URL</label>
              <input
                type="text"
                value={(content as any).image || ""}
                onChange={(e) =>
                  setContent({ ...content, image: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Alignment
              </label>
              <select
                value={(content as any).alignment || "left"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    alignment: e.target.value as "left" | "right",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        )
      case "imageSlider":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Images (one per line)
              </label>
              <textarea
                value={
                  Array.isArray((content as any).images)
                    ? (content as any).images.join("\n")
                    : ""
                }
                onChange={(e) =>
                  setContent({
                    ...content,
                    images: e.target.value.split("\n").filter((url) => url),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={(content as any).autoplay || false}
                onChange={(e) =>
                  setContent({ ...content, autoplay: e.target.checked })
                }
                className="mr-2"
              />
              <label className="text-gray-700">Autoplay</label>
            </div>
          </div>
        )
      case "headingParagraph":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Heading</label>
              <input
                type="text"
                value={(content as any).heading || ""}
                onChange={(e) =>
                  setContent({ ...content, heading: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Paragraphs (one per line)
              </label>
              <textarea
                value={
                  Array.isArray((content as any).paragraphs)
                    ? (content as any).paragraphs.join("\n")
                    : ""
                }
                onChange={(e) =>
                  setContent({
                    ...content,
                    paragraphs: e.target.value.split("\n").filter((p) => p),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
              />
            </div>
          </div>
        )
      default:
        return (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Content (JSON)</label>
            <textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setContent(JSON.parse(e.target.value))
                } catch {}
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={10}
            />
          </div>
        )
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold capitalize text-gray-900">
          {section.type} Section
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-24 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center pt-8">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="mr-2"
            />
            <label className="text-gray-700">Visible</label>
          </div>
        </div>
        {renderEditor()}
      </div>
    </div>
  )
}
