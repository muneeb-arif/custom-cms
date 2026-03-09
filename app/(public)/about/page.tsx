import { prisma } from "@/lib/db/prisma"
import SectionRenderer from "@/components/public/sections/SectionRenderer"
import type { Metadata } from "next"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({
    where: { slug: "about" },
  })

  if (page && page.isPublished) {
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
    }
  }

  return {
    title: "About Us",
  }
}

export default async function AboutPage() {
  const page = await prisma.page.findUnique({
    where: { slug: "about" },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  })

  if (page && page.isPublished) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
        <div className="space-y-12">
          {page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-4">
          This is the about us page. You can customize this content through the admin panel.
        </p>
        <p className="text-lg text-gray-700">
          Our mission is to provide a flexible and powerful content management system
          that makes it easy to create and manage beautiful websites.
        </p>
      </div>
    </div>
  )
}
