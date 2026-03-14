"use client"

import { CardItem, CardServiceItem } from "@/types/cms"
import Image from "next/image"
import { useEffect, useMemo } from "react"

interface CardDetailModalProps {
  card: CardItem
  onClose: () => void
  allCards?: CardItem[]
  currentIndex?: number
  onNavigate?: (index: number) => void
}

export default function CardDetailModal({
  card,
  onClose,
  allCards = [],
  currentIndex = 0,
  onNavigate,
}: CardDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [onClose])

  const hasPrev = onNavigate && allCards.length > 0 && currentIndex > 0
  const hasNext =
    onNavigate && allCards.length > 0 && currentIndex < allCards.length - 1

  // Support both new services and legacy technologies (migration at render time)
  const services = useMemo((): CardServiceItem[] => {
    if (card.services && card.services.length > 0) {
      return card.services
    }
    const legacy = (card as { technologies?: string[] }).technologies
    if (Array.isArray(legacy) && legacy.length > 0) {
      return legacy.map((title) => ({ title, description: "" }))
    }
    return []
  }, [card])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            {hasPrev && (
              <button
                type="button"
                onClick={() => onNavigate!(currentIndex - 1)}
                className="text-gray-600 hover:text-gray-900"
              >
                &larr; Previous
              </button>
            )}
            <h2 className="text-3xl font-bold text-gray-900">{card.heading}</h2>
            {hasNext && (
              <button
                type="button"
                onClick={() => onNavigate!(currentIndex + 1)}
                className="text-gray-600 hover:text-gray-900"
              >
                Next &rarr;
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          {card.image && (
            <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
              <Image
                src={card.image}
                alt={card.heading}
                fill
                className="object-cover"
              />
            </div>
          )}
          {card.overview && (
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-line">{card.overview}</p>
            </div>
          )}
          {services.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Services
              </h3>
              <div className="space-y-3">
                {services.map((svc, i) => (
                  <div key={i} className="border-l-2 border-amber-200 pl-3 py-1">
                    <h4 className="font-medium text-gray-900">{svc.title}</h4>
                    {svc.description && (
                      <p className="text-sm text-gray-600 mt-0.5">
                        {svc.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 flex-wrap">
            {card.liveDemoUrl && (
              <a
                href={card.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded-lg bg-amber-700 text-white font-medium hover:bg-amber-800 transition"
              >
                View Live Demo
              </a>
            )}
            {card.sourceCodeUrl && (
              <a
                href={card.sourceCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                View Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
