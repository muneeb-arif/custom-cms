"use client"

import { useState } from "react"
import Image from "next/image"
import { CardItem } from "@/types/cms"
import CardDetailModal from "./CardDetailModal"

interface CardsSectionProps {
  content: {
    title?: string
    subText?: string
    cardsPerRow?: number
    cards?: CardItem[]
  }
}

export default function CardsSection({ content }: CardsSectionProps) {
  const {
    title = "",
    subText = "",
    cardsPerRow = 3,
    cards = [],
  } = content

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  )

  const gridCols =
    cardsPerRow === 1
      ? "grid-cols-1"
      : cardsPerRow === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-2 lg:grid-cols-3"

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="w-full mx-auto">
          {(title || subText) && (
            <div className="text-center mb-10">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {title}
                </h2>
              )}
              {subText && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {subText}
                </p>
              )}
            </div>
          )}
          {cards.length > 0 && (
            <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col"
                >
                  {card.image && (
                    <div className="relative w-full aspect-video bg-gray-100">
                      <Image
                        src={card.image}
                        alt={card.heading}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {card.heading}
                    </h3>
                    {card.description && (
                      <p className="text-gray-600 text-sm flex-1 mb-4">
                        {card.description}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedCardIndex(index)}
                      className="mt-auto w-full py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-50 transition text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedCardIndex !== null && cards[selectedCardIndex] && (
        <CardDetailModal
          card={cards[selectedCardIndex]}
          onClose={() => setSelectedCardIndex(null)}
          allCards={cards}
          currentIndex={selectedCardIndex}
          onNavigate={(index) => setSelectedCardIndex(index)}
        />
      )}
    </section>
  )
}
