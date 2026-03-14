import { prisma } from "@/lib/db/prisma"
import ServiceList from "@/components/public/services/ServiceList"
import type { Metadata } from "next"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Services",
  description: "Our services and offerings",
}

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center text-brand-header">Our Services</h1>
      <ServiceList services={services} />
    </div>
  )
}
