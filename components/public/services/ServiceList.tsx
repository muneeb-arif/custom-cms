"use client"

import { useState } from "react"
import { ServiceData } from "@/types/cms"
import ServiceCard from "./ServiceCard"
import ServiceModal from "./ServiceModal"

interface ServiceListProps {
  services: ServiceData[]
}

export default function ServiceList({ services }: ServiceListProps) {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (service: ServiceData) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedService(null)
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No services available at the moment.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
      {isModalOpen && selectedService && (
        <ServiceModal service={selectedService} onClose={closeModal} />
      )}
    </>
  )
}
