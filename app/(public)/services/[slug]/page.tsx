import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import Image from "next/image"
import type { Metadata } from "next"

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await prisma.service.findUnique({
    where: { slug },
  })

  if (!service || !service.isPublished) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: service.title,
    description: service.description || service.shortDescription || undefined,
  }
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params

  const service = await prisma.service.findUnique({
    where: { slug },
  })

  if (!service || !service.isPublished) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-brand-header">{service.title}</h1>
        {service.image && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        {service.description && (
          <div className="prose max-w-none mb-6">
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
  )
}
