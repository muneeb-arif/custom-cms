import Image from "next/image"
import Link from "next/link"
import { ServiceData } from "@/types/cms"

interface ServiceCardProps {
  service: ServiceData
  onCardClick?: (service: ServiceData) => void
}

export default function ServiceCard({ service, onCardClick }: ServiceCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {service.image && (
        <div className="relative w-full h-48">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
        {service.shortDescription && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {service.shortDescription}
          </p>
        )}
        <div className="flex gap-2">
          <Link
            href={`/services/${service.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details →
          </Link>
          {onCardClick && (
            <button
              onClick={() => onCardClick(service)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Quick View
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
