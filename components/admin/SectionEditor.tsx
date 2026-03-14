"use client"

import { useState, useEffect } from "react"
import { SectionData, CardItem, CardServiceItem } from "@/types/cms"
import ImagePicker from "./ImagePicker"

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
              <ImagePicker
                value={(content as any).image || ""}
                onChange={(url) =>
                  setContent({ ...content, image: url })
                }
                label="Image"
                prefix="media"
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
      case "imageSlider": {
        const images: string[] = Array.isArray((content as any).images)
          ? (content as any).images
          : []
        return (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Images
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      images: [...images, ""],
                    })
                  }
                  className="text-lg bg-gray-800 text-gray-100 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Add image
                </button>
              </div>
              <div className="space-y-3">
                {images.map((url, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <ImagePicker
                        value={url}
                        onChange={(newUrl) => {
                          const next = [...images]
                          next[index] = newUrl
                          setContent({ ...content, images: next })
                        }}
                        label={`Image ${index + 1}`}
                        prefix="media"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = images.filter((_, i) => i !== index)
                        setContent({ ...content, images: next })
                      }}
                      className="text-lg text-red-600 hover:text-red-800 mt-8"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
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
      }
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
      case "cards": {
        const cards: CardItem[] = Array.isArray((content as any).cards)
          ? (content as any).cards
          : []
        const getCardServices = (card: CardItem): CardServiceItem[] => {
          if (card.services && card.services.length > 0) return card.services
          const legacy = (card as { technologies?: string[] }).technologies
          if (Array.isArray(legacy) && legacy.length > 0) {
            return legacy.map((t) => ({ title: t, description: "" }))
          }
          return []
        }
        const inputClass =
          "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Title</label>
              <input
                type="text"
                value={(content as any).title || ""}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Sub-text</label>
              <textarea
                value={(content as any).subText || ""}
                onChange={(e) => setContent({ ...content, subText: e.target.value })}
                className={inputClass}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Cards per row</label>
              <select
                value={(content as any).cardsPerRow ?? 3}
                onChange={(e) =>
                  setContent({ ...content, cardsPerRow: parseInt(e.target.value, 10) })
                }
                className={inputClass}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Cards</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      cards: [...cards, { heading: "", description: "" }],
                    })
                  }
                  className="text-lg bg-gray-800 text-gray-100 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Add card
                </button>
              </div>
              <div className="space-y-6">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Card {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = cards.filter((_, i) => i !== index)
                          setContent({ ...content, cards: next })
                        }}
                        className="text-lg text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <ImagePicker
                        value={card.image || ""}
                        onChange={(url) => {
                          const next = [...cards]
                          next[index] = { ...next[index], image: url }
                          setContent({ ...content, cards: next })
                        }}
                        label="Image"
                        prefix="media"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">Heading</label>
                      <input
                        type="text"
                        value={card.heading || ""}
                        onChange={(e) => {
                          const next = [...cards]
                          next[index] = { ...next[index], heading: e.target.value }
                          setContent({ ...content, cards: next })
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">
                        Description
                      </label>
                      <textarea
                        value={card.description || ""}
                        onChange={(e) => {
                          const next = [...cards]
                          next[index] = { ...next[index], description: e.target.value }
                          setContent({ ...content, cards: next })
                        }}
                        className={inputClass}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">
                        Overview (modal)
                      </label>
                      <textarea
                        value={card.overview || ""}
                        onChange={(e) => {
                          const next = [...cards]
                          next[index] = { ...next[index], overview: e.target.value }
                          setContent({ ...content, cards: next })
                        }}
                        className={inputClass}
                        rows={2}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-600">
                          Services (title + short description)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...cards]
                            const svcs: CardServiceItem[] = getCardServices(next[index])
                            svcs.push({ title: "", description: "" })
                            const { technologies, keyFeatures, ...rest } = next[index] as CardItem & {
                              technologies?: string[]
                              keyFeatures?: string[]
                            }
                            next[index] = { ...rest, services: svcs }
                            setContent({ ...content, cards: next })
                          }}
                          className="text-lg bg-gray-800 text-gray-100 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Add service
                        </button>
                      </div>
                      <div className="space-y-2">
                        {getCardServices(card).map((svc, svcIdx) => (
                          <div
                            key={svcIdx}
                            className="flex gap-2 items-start p-2 bg-white rounded border border-gray-200"
                          >
                            <div className="flex-1 space-y-1">
                              <input
                                type="text"
                                placeholder="Title"
                                value={svc.title}
                                onChange={(e) => {
                                  const next = [...cards]
                                  const svcs = [...getCardServices(next[index])]
                                  svcs[svcIdx] = { ...svcs[svcIdx], title: e.target.value }
                                  const { technologies, keyFeatures, ...rest } = next[index] as CardItem & {
                                    technologies?: string[]
                                    keyFeatures?: string[]
                                  }
                                  next[index] = { ...rest, services: svcs }
                                  setContent({ ...content, cards: next })
                                }}
                                className={inputClass}
                              />
                              <textarea
                                placeholder="Short description"
                                value={svc.description}
                                onChange={(e) => {
                                  const next = [...cards]
                                  const svcs = [...getCardServices(next[index])]
                                  svcs[svcIdx] = { ...svcs[svcIdx], description: e.target.value }
                                  const { technologies, keyFeatures, ...rest } = next[index] as CardItem & {
                                    technologies?: string[]
                                    keyFeatures?: string[]
                                  }
                                  next[index] = { ...rest, services: svcs }
                                  setContent({ ...content, cards: next })
                                }}
                                className={inputClass}
                                rows={2}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...cards]
                                const svcs = getCardServices(next[index]).filter(
                                  (_, i) => i !== svcIdx
                                )
                                const { technologies, keyFeatures, ...rest } = next[index] as CardItem & {
                                  technologies?: string[]
                                  keyFeatures?: string[]
                                }
                                next[index] = { ...rest, services: svcs }
                                setContent({ ...content, cards: next })
                              }}
                              className="text-lg text-red-600 hover:text-red-800 mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-600">
                          Live demo URL
                        </label>
                        <input
                          type="url"
                          value={card.liveDemoUrl || ""}
                          onChange={(e) => {
                            const next = [...cards]
                            next[index] = { ...next[index], liveDemoUrl: e.target.value }
                            setContent({ ...content, cards: next })
                          }}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-600">
                          Source code URL
                        </label>
                        <input
                          type="url"
                          value={card.sourceCodeUrl || ""}
                          onChange={(e) => {
                            const next = [...cards]
                            next[index] = { ...next[index], sourceCodeUrl: e.target.value }
                            setContent({ ...content, cards: next })
                          }}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
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
