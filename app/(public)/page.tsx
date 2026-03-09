import { prisma } from "@/lib/db/prisma"
import SectionRenderer from "@/components/public/sections/SectionRenderer"
import type { Metadata } from "next"

export const revalidate = 60 // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({
    where: { slug: "home" },
  })

  if (page && page.isPublished) {
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
    }
  }

  return {
    title: "Home",
    description: "Welcome to our CMS",
  }
}

export default async function HomePage() {
  // Try to fetch the home page from database
  const page = await prisma.page.findUnique({
    where: { slug: "home" },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  })

  // If page exists in DB, render it dynamically
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

  // Default static home page
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our CMS</h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern content management system built with Next.js
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Dynamic Pages</h2>
            <p className="text-gray-600">
              Create and manage pages with flexible sections
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Rich Content</h2>
            <p className="text-gray-600">
              Add text, images, sliders, and more to your pages
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">SEO Friendly</h2>
            <p className="text-gray-600">
              Built for search engine optimization
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
