"use client"

import { ServiceData } from "@/types/cms"
import Image from "next/image"
import { useEffect } from "react"

interface ServiceModalProps {
  service: ServiceData
  onClose: () => void
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-brand-header">{service.title}</h2>
          <button
            onClick={onClose}
            className="text-brand-primary hover:text-brand-hover text-2xl transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {service.image && (
            <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          {service.description && (
            <div className="prose max-w-none mb-4">
              <p className="text-lg text-gray-700 whitespace-pre-line">
                {service.description}
              </p>
            </div>
          )}
          {service.content && (
            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(service.content),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
