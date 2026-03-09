import Link from "next/link"
import { prisma } from "@/lib/db/prisma"
import SectionRenderer from "@/components/public/sections/SectionRenderer"
import type { Metadata } from "next"
import { getOrCreateSettings } from "@/lib/db/settings"
import type { SectionData } from "@/types/cms"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getOrCreateSettings()
  if (!settings.homePageId) {
    return {
      title: "Home",
      description: "Welcome to our CMS",
    }
  }
  const page = await prisma.page.findUnique({
    where: { id: settings.homePageId },
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
  const settings = await getOrCreateSettings()
  const homePageId = settings.homePageId

  if (homePageId) {
    const page = await prisma.page.findUnique({
      where: { id: homePageId },
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
              <SectionRenderer
                key={section.id}
                section={section as SectionData}
              />
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Nothing is created
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Let&apos;s start building your site. Create your first page and set it
          as the home page from the admin.
        </p>
        <Link
          href="/admin"
          className="inline-block px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Let&apos;s start building
        </Link>
      </div>
    </div>
  )
}
