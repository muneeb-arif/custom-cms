"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ServiceData } from "@/types/cms"

interface ServiceEditorProps {
  service?: ServiceData
}

export default function ServiceEditor({ service }: ServiceEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: service?.slug || "",
    title: service?.title || "",
    description: service?.description || "",
    shortDescription: service?.shortDescription || "",
    image: service?.image || "",
    order: service?.order || 0,
    isPublished: service?.isPublished || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = service ? `/api/services/${service.id}` : "/api/services"
      const method = service ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save service")

      const savedService = await response.json()
      router.push(`/admin/services/${savedService.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error saving service:", error)
      alert("Failed to save service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        {service ? "Edit Service" : "Create New Service"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="web-development"
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
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Short Description
          </label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Brief description for service cards"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Full Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            placeholder="Full service description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Image URL</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Order</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          {loading ? "Saving..." : "Save Service"}
        </button>
      </form>
    </div>
  )
}
